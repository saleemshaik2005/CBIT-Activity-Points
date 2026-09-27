import { NextRequest, NextResponse } from 'next/server';
import { analyzeCertificateDocument } from '@/lib/certificate-intelligence';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const studentName = (formData.get('studentName') as string | null) || undefined;
    const studentRollNo = (formData.get('studentRollNo') as string | null) || undefined;
    const clientOcrText = (formData.get('clientOcrText') as string | null) || undefined;
    const clientQrRaw = (formData.get('clientQrPayloads') as string | null) || undefined;

    let clientQrPayloads: string[] | undefined = undefined;
    if (clientQrRaw) {
      try {
        const parsed = JSON.parse(clientQrRaw);
        if (Array.isArray(parsed)) clientQrPayloads = parsed;
      } catch {
        clientQrPayloads = [clientQrRaw];
      }
    }

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

    // Run Non-Gemini Pretrained/Local Certificate Intelligence Pipeline
    const extraction = await analyzeCertificateDocument(
      base64Data,
      mimeType,
      {
        studentName,
        studentRollNo,
        clientOcrText,
        clientQrPayloads,
      },
      file.name
    );

    if (extraction.isDocument === false) {
      return NextResponse.json({
        success: false,
        isDocument: false,
        error:
          extraction.documentRejectionReason ||
          'The uploaded file is not recognized as an official certificate or document proof.',
        data: extraction,
        fileName: file.name,
        fileSize: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      isDocument: true,
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
