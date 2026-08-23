import { NextRequest, NextResponse } from 'next/server';
import { analyzeCertificateDocument } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const manualApiKey = formData.get('apiKey') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No certificate file was uploaded.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Call AI document intelligence extraction
    const extraction = await analyzeCertificateDocument(
      base64Data,
      mimeType,
      manualApiKey || undefined,
      file.name
    );

    return NextResponse.json({
      success: true,
      data: extraction,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze certificate document' },
      { status: 500 }
    );
  }
}
