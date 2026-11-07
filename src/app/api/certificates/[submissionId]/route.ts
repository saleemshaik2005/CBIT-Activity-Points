import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ submissionId: string }> }
) {
  try {
    const auth = await requireRole([], { allowMustChangePassword: true });
    if (auth.response || !auth.user || !auth.profile) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const params = await props.params;
    const submissionId = params.submissionId;

    if (!submissionId || !isValidUUID(submissionId)) {
      return NextResponse.json({ success: false, error: 'Invalid submission ID.' }, { status: 400 });
    }

    // Fetch submission and student's mentor details
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('student_submissions')
      .select(`
        id,
        student_id,
        certificate_url,
        storage_bucket,
        storage_path,
        student:profiles!student_id (
          id,
          department,
          mentor_id
        )
      `)
      .eq('id', submissionId)
      .single();

    if (subErr || !sub) {
      return NextResponse.json({ success: false, error: 'Submission not found.' }, { status: 404 });
    }

    const { user, profile } = auth;
    const student = sub.student as any;

    // Authorization checks:
    // 1. Student who owns the submission
    const isOwner = sub.student_id === user.id;

    // 2. Assigned faculty mentor
    const isAssignedMentor = profile.role === 'mentor' && student?.mentor_id === user.id;

    // 3. Department coordinator / HoD / Admin
    const isDeptAuthority =
      ['class_teacher', 'hod', 'admin'].includes(profile.role) &&
      (profile.role === 'admin' || !student?.department || student.department === profile.department);

    if (!isOwner && !isAssignedMentor && !isDeptAuthority) {
      return NextResponse.json(
        { success: false, error: 'Access Forbidden: You do not have permission to view this certificate.' },
        { status: 403 }
      );
    }

    // Resolve private storage path
    const bucket = sub.storage_bucket || 'certificates';
    let storagePath = sub.storage_path;

    if (!storagePath && sub.certificate_url) {
      // Extract path from legacy Supabase URL if needed
      const parts = sub.certificate_url.split('/certificates/');
      if (parts.length > 1) {
        storagePath = decodeURIComponent(parts[1]);
      }
    }

    if (storagePath) {
      // Generate temporary signed URL valid for 5 minutes (300 seconds)
      const { data: signedData, error: signErr } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(storagePath, 300);

      if (!signErr && signedData?.signedUrl) {
        const wantsJson = req.headers.get('accept')?.includes('application/json');
        if (wantsJson) {
          return NextResponse.json({ success: true, signedUrl: signedData.signedUrl });
        }
        return NextResponse.redirect(signedData.signedUrl);
      }
    }

    // Fallback if stored as legacy direct URL
    if (sub.certificate_url && sub.certificate_url.startsWith('http')) {
      return NextResponse.redirect(sub.certificate_url);
    }

    return NextResponse.json(
      { success: false, error: 'Certificate file location unavailable in private storage.' },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('[/api/certificates/[submissionId]] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
