import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf']);

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to initiate file upload.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { filename, fileType, fileSize, bucket = 'certificates' } = body;

    if (!filename || !fileType || typeof filename !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Filename and valid MIME type are required.' },
        { status: 400 }
      );
    }

    const cleanMime = fileType.toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.has(cleanMime)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file format (${cleanMime}). Only genuine JPG, PNG, WEBP, and PDF files are permitted.`,
        },
        { status: 415 }
      );
    }

    if (fileSize && Number(fileSize) > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum 15MB limit.' },
        { status: 413 }
      );
    }

    const rawExt = path.extname(filename).replace('.', '').toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : cleanMime.includes('pdf') ? 'pdf' : 'jpg';

    const targetBucket = bucket === 'avatars' ? 'avatars' : 'certificates';
    const randomSuffix = crypto.randomUUID();
    const storagePath = `${user.id}/${Date.now()}_${randomSuffix}.${safeExt}`;

    // Request direct presigned upload URL from Supabase Cloud Storage
    const { data, error } = await supabaseAdmin.storage
      .from(targetBucket)
      .createSignedUploadUrl(storagePath);

    if (error || !data?.signedUrl) {
      console.warn('[Presigned URL] Supabase storage signed URL warning:', error?.message);
      // Fallback: Return structured direct path reference
      const { data: urlData } = supabaseAdmin.storage.from(targetBucket).getPublicUrl(storagePath);
      return NextResponse.json({
        success: true,
        directUploadMode: 'direct_rest',
        bucket: targetBucket,
        storagePath,
        publicUrl: urlData.publicUrl,
        expiresIn: 300,
      });
    }

    const { data: urlData } = supabaseAdmin.storage.from(targetBucket).getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      directUploadMode: 'presigned_url',
      bucket: targetBucket,
      storagePath,
      signedUrl: data.signedUrl,
      token: data.token,
      publicUrl: urlData.publicUrl,
      expiresIn: 300, // 5 minutes
    });
  } catch (err: any) {
    console.error('[Presigned URL] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to generate presigned upload session.' },
      { status: 500 }
    );
  }
}
