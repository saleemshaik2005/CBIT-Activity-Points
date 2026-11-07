import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { requireRole } from '@/lib/auth';
import { saveServerUploadedFile } from '@/lib/server-db';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB max
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
]);

/**
 * Validates actual binary content using magic bytes (file signatures)
 * to prevent file masquerading and malicious executable uploads.
 */
export function validateMagicBytes(buffer: Buffer): { isValid: boolean; detectedMime?: string } {
  if (!buffer || buffer.length < 4) {
    return { isValid: false };
  }

  // 1. PDF Signature: %PDF- (0x25 0x50 0x44 0x46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { isValid: true, detectedMime: 'application/pdf' };
  }

  // 2. PNG Signature: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47
  ) {
    return { isValid: true, detectedMime: 'image/png' };
  }

  // 3. JPEG Signature: 0xFF 0xD8 0xFF
  if (
    buffer[0] === 0xFF &&
    buffer[1] === 0xD8 &&
    buffer[2] === 0xFF
  ) {
    return { isValid: true, detectedMime: 'image/jpeg' };
  }

  // 4. WEBP Signature: RIFF....WEBP (0x52 0x49 0x46 0x46 ... 0x57 0x45 0x42 0x50)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, detectedMime: 'image/webp' };
  }

  return { isValid: false };
}

/**
 * Compresses certificate and avatar images using `sharp` (MozJPEG)
 * to minimize Supabase Storage footprint (~65KB - 115KB per certificate).
 */
async function compressImageBuffer(
  inputBuffer: Buffer,
  mimeType: string,
  isAvatar: boolean
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
  const lowerMime = (mimeType || '').toLowerCase();
  if (lowerMime.includes('pdf') || lowerMime.includes('svg')) {
    return {
      buffer: inputBuffer,
      contentType: lowerMime.includes('pdf') ? 'application/pdf' : mimeType,
      ext: lowerMime.includes('pdf') ? 'pdf' : 'svg',
    };
  }

  try {
    if (isAvatar) {
      const compressed = await sharp(inputBuffer)
        .rotate()
        .resize(360, 360, { fit: 'cover' })
        .jpeg({ quality: 75, mozjpeg: true })
        .toBuffer();
      return { buffer: compressed, contentType: 'image/jpeg', ext: 'jpg' };
    }

    const compressed = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 1350, height: 1350, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 74, mozjpeg: true, progressive: true })
      .toBuffer();

    return { buffer: compressed, contentType: 'image/jpeg', ext: 'jpg' };
  } catch (err) {
    console.warn('[Upload Compression] sharp compression fallback:', err);
    return { buffer: inputBuffer, contentType: mimeType || 'image/jpeg', ext: 'jpg' };
  }
}

// Sliding window upload tracker (max 50 certificates per student/IP per 24 hours)
const uploadRateLimiter = new Map<string, number[]>();

function checkDailyUploadQuota(key: string, limit = 50, windowMs = 24 * 60 * 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = (uploadRateLimiter.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    uploadRateLimiter.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  uploadRateLimiter.set(key, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole([], { allowMustChangePassword: true });
    if (auth.response || !auth.user) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required to upload files.' }, { status: 401 })
      );
    }

    const contentType = req.headers.get('content-type') || '';
    const { user } = auth;

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ success: false, error: 'Multipart form data expected.' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const isAvatar = (formData.get('type') as string) === 'avatar';
    const bucket = isAvatar ? 'avatars' : 'certificates';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in form data.' },
        { status: 400 }
      );
    }

    // Size limit check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum 20MB limit.' },
        { status: 413 }
      );
    }

    const rawMime = file.type || 'image/jpeg';
    if (!ALLOWED_MIME_TYPES.has(rawMime.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type (${rawMime}). Only JPG, PNG, WEBP, and PDF files are allowed.` },
        { status: 415 }
      );
    }

    // Rate limit
    if (!isAvatar && !checkDailyUploadQuota(user.id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Daily upload quota reached (maximum 50 certificates per student per 24 hours).',
          dailyLimitReached: true,
        },
        { status: 429 }
      );
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);
    const originalSize = rawBuffer.byteLength;

    // Cryptographic Magic Byte Signature Verification
    const magicCheck = validateMagicBytes(rawBuffer);
    if (!magicCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'File contents do not match a valid PDF, JPEG, PNG, or WEBP document signature. Upload rejected for security.',
        },
        { status: 400 }
      );
    }

    // Compress image before storing
    const { buffer, contentType: outMime, ext } = await compressImageBuffer(
      rawBuffer,
      magicCheck.detectedMime || rawMime,
      isAvatar
    );

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const safeFilename = `${Date.now()}_${randomSuffix}.${ext}`;
    const objectStoragePath = `${user.id}/${safeFilename}`;

    // Upload to Supabase Storage
    try {
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from(bucket)
        .upload(objectStoragePath, buffer, {
          contentType: outMime,
          upsert: true,
        });

      if (!uploadErr && uploadData?.path) {
        let finalUrl = '';
        if (isAvatar) {
          const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path);
          finalUrl = urlData.publicUrl;
        } else {
          // For private certificates, generate a signed URL
          const { data: signedData } = await supabaseAdmin.storage
            .from(bucket)
            .createSignedUrl(uploadData.path, 3600); // 1-hour initial signed URL
          finalUrl = signedData?.signedUrl || '';
        }

        return NextResponse.json({
          success: true,
          url: finalUrl,
          storagePath: uploadData.path,
          bucket,
          filename: file.name,
          originalSize,
          size: buffer.byteLength,
          compressionSavedPercent:
            originalSize > 0
              ? Math.max(0, Math.round(((originalSize - buffer.byteLength) / originalSize) * 100))
              : 0,
          storage: 'supabase',
        });
      }
      console.warn('[Upload API] Supabase storage warning:', uploadErr?.message);
    } catch (storageErr: any) {
      console.warn('[Upload API] Storage exception:', storageErr?.message);
    }

    // Fallback: Local Server File Save
    const result = saveServerUploadedFile(buffer, safeFilename, bucket);
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      storagePath: safeFilename,
      bucket,
      filename: file.name,
      originalSize,
      size: buffer.byteLength,
      storage: 'local',
    });
  } catch (error: any) {
    console.error('[Upload API] Server error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server file upload error' },
      { status: 500 }
    );
  }
}
