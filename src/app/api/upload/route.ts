import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { saveServerUploadedFile } from '@/lib/server-db';

export const runtime = 'nodejs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lnowcdmmkycujdfafqbl.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

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

// In-memory sliding window upload tracker (max 50 certificates per student/IP per 24 hours)
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
    const contentType = req.headers.get('content-type') || '';
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';

    // 1. Handle Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const studentId = (formData.get('studentId') as string) || clientIp;
      const isAvatar = (formData.get('type') as string) === 'avatar';
      const subfolder = isAvatar ? 'avatars' : 'certificates';

      if (!isAvatar && !checkDailyUploadQuota(studentId)) {
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

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided in form data' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const rawBuffer = Buffer.from(bytes);
      const originalSize = rawBuffer.byteLength;

      // Compress image before storing in Supabase
      const { buffer, contentType: outMime, ext } = await compressImageBuffer(
        rawBuffer,
        file.type || 'image/jpeg',
        isAvatar
      );

      const bucket = isAvatar ? 'avatars' : 'certificates';
      const safeFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

      // Primary: Upload compressed buffer to Supabase Cloud Storage Bucket
      try {
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from(bucket)
          .upload(safeFilename, buffer, {
            contentType: outMime,
            upsert: true,
          });

        if (!uploadErr && uploadData?.path) {
          const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path);
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
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
      const result = saveServerUploadedFile(buffer, safeFilename, subfolder);
      if (!result.success) {
        return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        filename: file.name,
        originalSize,
        size: buffer.byteLength,
        storage: 'local',
      });
    }

    // 2. Handle JSON Base64 Data URL Payload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { dataUrl, filename, type, studentId } = body;

      if (!dataUrl || typeof dataUrl !== 'string') {
        return NextResponse.json({ success: false, error: 'Invalid dataUrl payload' }, { status: 400 });
      }

      const isAvatar = type === 'avatar';
      const quotaKey = studentId || clientIp;

      if (!isAvatar && !checkDailyUploadQuota(quotaKey)) {
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

      const subfolder = isAvatar ? 'avatars' : 'certificates';
      const bucket = isAvatar ? 'avatars' : 'certificates';
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      let rawBuffer: Buffer;
      let inMime = 'image/jpeg';

      if (matches && matches.length === 3) {
        inMime = matches[1];
        rawBuffer = Buffer.from(matches[2], 'base64');
      } else {
        rawBuffer = Buffer.from(dataUrl, 'base64');
      }

      const originalSize = rawBuffer.byteLength;
      const { buffer, contentType: outMime, ext } = await compressImageBuffer(
        rawBuffer,
        inMime,
        isAvatar
      );

      const safeFilename =
        (filename ? filename.replace(/\.[^/.]+$/, '') : `upload_${Date.now()}`) + `.${ext}`;

      try {
        const storagePath = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from(bucket)
          .upload(storagePath, buffer, {
            contentType: outMime,
            upsert: true,
          });

        if (!uploadErr && uploadData?.path) {
          const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path);
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            originalSize,
            size: buffer.byteLength,
            storage: 'supabase',
          });
        }
      } catch (storageErr) {
        console.warn('[Upload API] Supabase base64 upload failed, falling back:', storageErr);
      }

      const result = saveServerUploadedFile(buffer, safeFilename, subfolder);
      if (!result.success) {
        return NextResponse.json({ success: false, error: 'Failed to save base64 file' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        url: result.url,
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
