import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await props.params;
    const pathParts = params.path;

    if (!pathParts || pathParts.length === 0) {
      return new NextResponse('File path not provided', { status: 400 });
    }

    // Sanitize path against directory traversal
    const safeParts = pathParts.map((p) => p.replace(/(\.\.[\/\\])+/g, ''));

    // Check bucket: if accessing private certificates folder, require authenticated session
    const isCertAccess = safeParts.includes('certificates');
    if (isCertAccess) {
      const { user } = await getAuthenticatedUser();
      if (!user) {
        return new NextResponse('Unauthorized: Authentication required to access certificate documents.', {
          status: 401,
        });
      }
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', ...safeParts);

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': isCertAccess ? 'private, no-cache' : 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    console.error('[Files API] Error serving file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
