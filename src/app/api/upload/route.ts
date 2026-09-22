import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { saveServerUploadedFile } from '@/lib/server-db';

export const runtime = 'nodejs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lnowcdmmkycujdfafqbl.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle Multipart Form Data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const subfolder = (formData.get('type') as string) === 'avatar' ? 'avatars' : 'certificates';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided in form data' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const bucket = subfolder === 'avatars' ? 'avatars' : 'certificates';
      const cleanExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const safeFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

      // 1. Primary: Upload to Supabase Cloud Storage Bucket
      try {
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from(bucket)
          .upload(safeFilename, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr && uploadData?.path) {
          const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path);
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            filename: file.name,
            size: bytes.byteLength,
            storage: 'supabase',
          });
        }
        console.warn('[Upload API] Supabase storage upload warning:', uploadErr?.message);
      } catch (storageErr: any) {
        console.warn('[Upload API] Supabase storage exception:', storageErr?.message);
      }

      // 2. Fallback: Local Server File Save
      const result = saveServerUploadedFile(buffer, file.name, subfolder);
      if (!result.success) {
        return NextResponse.json({ success: false, error: 'Failed to save file' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        filename: file.name,
        size: bytes.byteLength,
        storage: 'local',
      });
    }

    // Handle JSON Base64 Data URL Payload
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { dataUrl, filename, type } = body;

      if (!dataUrl || typeof dataUrl !== 'string') {
        return NextResponse.json({ success: false, error: 'Invalid dataUrl payload' }, { status: 400 });
      }

      const subfolder = type === 'avatar' ? 'avatars' : 'certificates';
      const bucket = subfolder === 'avatars' ? 'avatars' : 'certificates';
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      let buffer: Buffer;
      let safeFilename = filename || `upload_${Date.now()}.jpg`;

      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(dataUrl, 'base64');
      }

      // 1. Primary: Upload Base64 buffer to Supabase Cloud Storage
      try {
        const storagePath = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
        const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
          .from(bucket)
          .upload(storagePath, buffer, {
            contentType: 'image/jpeg',
            upsert: true,
          });

        if (!uploadErr && uploadData?.path) {
          const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(uploadData.path);
          return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            size: buffer.length,
            storage: 'supabase',
          });
        }
      } catch (storageErr) {
        console.warn('[Upload API] Supabase base64 upload failed, falling back:', storageErr);
      }

      // 2. Fallback: Local Server File Save
      const result = saveServerUploadedFile(buffer, safeFilename, subfolder);
      if (!result.success) {
        return NextResponse.json({ success: false, error: 'Failed to save base64 file' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        size: buffer.length,
        storage: 'local',
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported Content-Type' }, { status: 415 });
  } catch (err: any) {
    console.error('[Upload API] Error processing upload:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal upload error' }, { status: 500 });
  }
}
