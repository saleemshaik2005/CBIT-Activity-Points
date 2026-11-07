import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Allow users with must_change_password=true to query /api/me so UI knows their status
    const auth = await requireRole([], { allowMustChangePassword: true });

    if (auth.response) {
      return auth.response;
    }

    const profile = auth.profile!;

    // Resolve assigned mentor details if user is a student
    let mentorData: any = null;
    if (profile.mentor_id) {
      const { data: mentorRecord } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, phone_number')
        .eq('id', profile.mentor_id)
        .maybeSingle();
      mentorData = mentorRecord;
    }

    const safeUserProfile = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      roll_number: profile.roll_number || undefined,
      department: profile.department || 'Artificial Intelligence and Data Science (AI&DS)',
      section: profile.section || '2',
      batch_year: profile.batch_year || '2024-2028',
      is_lateral_entry: !!profile.is_lateral_entry,
      mentor_id: profile.mentor_id || undefined,
      mentor_name: mentorData?.full_name || undefined,
      mentor_email: mentorData?.email || undefined,
      mentor_phone: mentorData?.phone_number || undefined,
      avatar_url: profile.avatar_url || undefined,
      phone_number: profile.phone_number || undefined,
      skills: profile.skills || [],
      github_url: profile.github_url || undefined,
      linkedin_url: profile.linkedin_url || undefined,
      resume_url: profile.resume_url || undefined,
      login_method: profile.login_method || (profile.role === 'student' ? 'google' : 'password'),
      must_change_password: !!profile.must_change_password,
      is_active: profile.is_active !== false,
    };

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: safeUserProfile,
    });
  } catch (err: any) {
    console.error('[/api/me] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while resolving user session.' },
      { status: 500 }
    );
  }
}
