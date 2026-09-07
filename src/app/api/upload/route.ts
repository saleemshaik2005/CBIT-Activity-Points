import { NextRequest, NextResponse } from 'next/server';
import { saveServerUploadedFile } from '@/lib/server-db';

export const runtime = 'nodejs';

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
      const result = saveServerUploadedFile(buffer, file.name, subfolder);

      if (!result.success) {
        return NextResponse.json({ success: false, error: 'Failed to write file to disk' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        filename: file.name,
        size: bytes.byteLength,
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
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

      let buffer: Buffer;
      let safeFilename = filename || `upload_${Date.now()}.jpg`;

      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(dataUrl, 'base64');
      }

      const result = saveServerUploadedFile(buffer, safeFilename, subfolder);

      if (!result.success) {
        return NextResponse.json({ success: false, error: 'Failed to save base64 file to disk' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        url: result.url,
        size: buffer.length,
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported Content-Type' }, { status: 415 });
  } catch (err: any) {
    console.error('[Upload API] Error processing upload:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal upload error' }, { status: 500 });
  }
}
