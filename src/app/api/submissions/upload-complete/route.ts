import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { enqueueCertificateJob } from '@/lib/queue/certificate-queue';
import { recordAuditLog } from '@/lib/audit/audit-ledger';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { user, profile } = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      storagePath,
      publicUrl,
      fileHash,
      fileName,
      fileSize,
      clientOcrText,
      clientQrPayloads,
      category_id,
      activity_title,
      semester,
      academic_year,
    } = body;

    if (!storagePath || !publicUrl || typeof storagePath !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing required storagePath or publicUrl reference.' },
        { status: 400 }
      );
    }

    // Security Check: Verify user owns the storage subfolder
    if (!storagePath.startsWith(`${user.id}/`)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Storage path does not match authenticated user session.' },
        { status: 403 }
      );
    }

    const safeHash = fileHash && typeof fileHash === 'string' ? fileHash.trim() : crypto.randomUUID();
    const submissionId = crypto.randomUUID();

    // 1. Create Initial Submission Record
    const submissionRow = {
      id: submissionId,
      student_id: user.id,
      category_id: category_id || 1,
      activity_title: activity_title || fileName || 'Activity Certificate',
      issuing_organization: '',
      event_date: new Date().toISOString().split('T')[0],
      semester: semester || 5,
      academic_year: academic_year || '2025-2026',
      claimed_points: 0,
      awarded_points: 0,
      certificate_url: publicUrl,
      storage_bucket: 'certificates',
      storage_path: storagePath,
      file_type: fileName?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      file_hash: safeHash,
      status: 'pending_mentor',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: insertErr } = await supabaseAdmin
      .from('student_submissions')
      .insert(submissionRow);

    if (insertErr) {
      console.error('[Upload Complete] Submission insert failed:', insertErr);
      return NextResponse.json(
        { success: false, error: 'Failed to record certificate submission.' },
        { status: 500 }
      );
    }

    // 2. Record Immutable Audit Ledger Entry
    await recordAuditLog({
      actorId: user.id,
      actorRole: 'student',
      targetSubmissionId: submissionId,
      studentId: user.id,
      action: 'SUBMISSION_CREATED',
      newStatus: 'pending_mentor',
      remarks: `Direct cloud upload completed. Filename: ${fileName || 'certificate'}.`,
      metadata: { storagePath, fileHash: safeHash, fileSize },
    });

    // 3. Enqueue for Asynchronous AI Parsing & Deduplication
    let queueResult;
    try {
      queueResult = await enqueueCertificateJob({
        submissionId,
        studentId: user.id,
        fileUrl: publicUrl,
        storagePath,
        fileHash: safeHash,
        studentName: profile?.full_name || '',
        studentRollNo: profile?.roll_number || '',
        clientOcrText,
        clientQrPayloads,
        fileName: fileName || 'certificate',
      });
    } catch (queueErr: any) {
      if (String(queueErr?.message).includes('Duplicate submission')) {
        // Delete orphaned draft submission row
        await supabaseAdmin.from('student_submissions').delete().eq('id', submissionId);
        return NextResponse.json(
          {
            success: false,
            error: 'Duplicate Certificate: You have already submitted this identical document proof.',
          },
          { status: 409 }
        );
      }
      throw queueErr;
    }

    return NextResponse.json(
      {
        success: true,
        submissionId,
        jobId: queueResult.jobId,
        status: queueResult.status,
        isCached: queueResult.isCached || false,
        sseStreamUrl: `/api/submissions/${submissionId}/status/stream`,
        message: queueResult.isCached
          ? 'Certificate metadata matched and categorized instantly via fingerprint cache.'
          : 'Certificate uploaded and queued for background AI processing.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[Upload Complete API] Exception:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error processing upload.' },
      { status: 500 }
    );
  }
}
