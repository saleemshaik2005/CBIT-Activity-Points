import { NextRequest, NextResponse } from 'next/server';
import { analyzeCertificateDocument } from '@/lib/gemini';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

// Sliding window rate limiter for expensive AI requests (max 6 requests per minute per user/IP)
const aiRateLimiter = new Map<string, { count: number; windowStart: number }>();

function checkAIRateLimit(key: string, limit = 6, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = aiRateLimiter.get(key) || { count: 0, windowStart: now };

  if (now - record.windowStart > windowMs) {
    record.count = 1;
    record.windowStart = now;
    aiRateLimiter.set(key, record);
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  aiRateLimiter.set(key, record);
  return true;
}

function validateFileSignature(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  // PDF: %PDF
  if (buffer.subarray(0, 4).toString('ascii') === '%PDF') return true;
  // WEBP: RIFF...WEBP
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { user, profile } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required to analyze certificates.' },
        { status: 401 }
      );
    }

    const rateKey = user.id;
    if (!checkAIRateLimit(rateKey)) {
      return NextResponse.json(
        { error: 'AI analysis rate limit exceeded. Please wait a minute before analyzing another document.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const studentName = profile?.full_name || (formData.get('studentName') as string | null) || undefined;
    const studentRollNo = profile?.roll_number || (formData.get('studentRollNo') as string | null) || undefined;
    const clientOcrText = (formData.get('clientOcrText') as string | null) || undefined;
    const clientQrRaw = (formData.get('clientQrPayloads') as string | null) || undefined;

    let clientQrPayloads: string[] | undefined = undefined;
    if (clientQrRaw) {
      try {
        const parsed = JSON.parse(clientQrRaw);
        if (Array.isArray(parsed)) clientQrPayloads = parsed.slice(0, 5);
      } catch {
        clientQrPayloads = [clientQrRaw.slice(0, 500)];
      }
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No certificate file was uploaded.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum 15MB limit.' },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateFileSignature(buffer)) {
      return NextResponse.json(
        { error: 'Unsupported file signature. Upload genuine JPG, PNG, WEBP, or PDF files.' },
        { status: 415 }
      );
    }

    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Run Institutional Gemini AI Document Intelligence & Forensics Pipeline
    const extraction = await analyzeCertificateDocument(
      base64Data,
      mimeType,
      {
        studentName,
        studentRollNo,
        clientOcrText,
        clientQrPayloads,
        fileName: file.name,
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
      { error: 'Failed to complete certificate AI analysis. Please try again or submit directly.' },
      { status: 500 }
    );
  }
}
