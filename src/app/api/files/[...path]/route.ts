import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const UPLOADS_BASE = path.resolve(process.cwd(), 'public', 'uploads');

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

    // Defensive Segment Inspection
    for (const part of pathParts) {
      if (
        part.includes('..') ||
        part.includes('/') ||
        part.includes('\\') ||
        part.includes('\0') ||
        part.trim() === ''
      ) {
        return new NextResponse('Invalid file path request', { status: 400 });
      }
    }

    // Strict boundary enforcement via canonical path resolution
    const resolvedPath = path.resolve(UPLOADS_BASE, ...pathParts);
    if (!resolvedPath.startsWith(UPLOADS_BASE + path.sep)) {
      return new NextResponse('Forbidden: Path traversal detected', { status: 403 });
    }

    if (!fs.existsSync(resolvedPath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const stat = fs.statSync(resolvedPath);
    if (!stat.isFile()) {
      return new NextResponse('Requested path is not a file', { status: 400 });
    }

    const fileBuffer = fs.readFileSync(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();

    let contentType = 'application/octet-stream';
    let isSvg = false;

    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.svg') {
      contentType = 'image/svg+xml';
      isSvg = true;
    }

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    };

    // Stored XSS protection: Force download & isolate SVGs
    if (isSvg) {
      headers['Content-Disposition'] = `attachment; filename="${path.basename(resolvedPath)}"`;
      headers['Content-Security-Policy'] = "default-src 'none'; sandbox";
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error('[Files API] Error serving file:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
