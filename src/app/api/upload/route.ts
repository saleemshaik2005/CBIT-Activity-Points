import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
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

// Sliding window upload tracker with automated eviction
const uploadRateLimiter = new Map<string, number[]>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of uploadRateLimiter.entries()) {
      const active = timestamps.filter((t) => now - t < 24 * 60 * 60 * 1000);
      if (active.length === 0) {
        uploadRateLimiter.delete(key);
      } else {
        uploadRateLimiter.set(key, active);
      }
    }
  }, 30 * 60 * 1000).unref?.();
}

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

function validateMagicBytes(buffer: Buffer): { valid: boolean; detectedMime?: string; ext?: string } {
  if (buffer.length < 4) return { valid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, detectedMime: 'image/jpeg', ext: 'jpg' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, detectedMime: 'image/png', ext: 'png' };
  }

  // PDF: %PDF
  if (buffer.subarray(0, 4).toString('ascii') === '%PDF') {
    return { valid: true, detectedMime: 'application/pdf', ext: 'pdf' };
  }

  // WEBP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { valid: true, detectedMime: 'image/webp', ext: 'webp' };
  }

  return { valid: false };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    const { user } = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to upload files.' },
        { status: 401 }
      );
    }

    const effectiveUserId = user.id;

    // 1. Handle Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const isAvatar = (formData.get('type') as string) === 'avatar';
      const bucket = isAvatar ? 'avatars' : 'certificates';

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided in form data' },
          { status: 400 }
        );
      }

      // Explicit file size limit check
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'File size exceeds maximum 20MB limit.' },
          { status: 413 }
        );
      }

      if (!isAvatar && !checkDailyUploadQuota(effectiveUserId)) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Daily upload quota reached (maximum 50 certificates per student per 24 hours). Bulk uploads are restricted to protect system integrity.',
            dailyLimitReached: true,
          },
          { status: 429 }
        );
      }

      const bytes = await file.arrayBuffer();
      const rawBuffer = Buffer.from(bytes);
      const originalSize = rawBuffer.byteLength;

      // Cryptographic magic bytes validation
      const magicCheck = validateMagicBytes(rawBuffer);
      if (!magicCheck.valid) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unsupported or spoofed file format. Upload rejected. Only genuine JPG, PNG, WEBP, and PDF files are permitted.',
          },
          { status: 415 }
        );
      }

      const verifiedMime = magicCheck.detectedMime || 'image/jpeg';

      // Compress image before storing in Supabase
      const { buffer, contentType: outMime, ext } = await compressImageBuffer(
        rawBuffer,
        verifiedMime,
        isAvatar
      );

      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const safeFilename = `${Date.now()}_${randomSuffix}.${ext}`;
      // Partition by student/user ID
      const objectStoragePath = `${effectiveUserId}/${safeFilename}`;

      // Primary: Upload compressed buffer to Supabase Cloud Storage Bucket
      try {
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from(bucket)
          .upload(objectStoragePath, buffer, {
            contentType: outMime,
            upsert: true,
          });

        if (!uploadErr && uploadData?.path) {
          const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path);
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
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
        console.warn('[Upload API] Supabase storage upload warning:', uploadErr?.message);
      } catch (storageErr: any) {
        console.warn('[Upload API] Supabase storage exception:', storageErr?.message);
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
    }

    return NextResponse.json({ success: false, error: 'Unsupported Content-Type' }, { status: 400 });
  } catch (error: any) {
    console.error('[Upload API] Unexpected server error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server file upload error' },
      { status: 500 }
    );
  }
}
