import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mentorId = searchParams.get('mentor_id');
    const role = searchParams.get('role');

    let query = supabaseAdmin
      .from('profiles')
      .select('id, full_name, roll_number, email, phone_number, department, section, batch_year, is_lateral_entry, role, mentor_id, avatar_url, mentor:mentor_id(id, full_name, email)')
      .order('roll_number', { ascending: true });

    if (role && role !== 'all') {
      query = query.eq('role', role);
    } else if (!role) {
      query = query.eq('role', 'student');
    }

    if (mentorId) {
      query = query.eq('mentor_id', mentorId);
    }

    const { data: students, error } = await query;

    if (error) {
      console.error('[Students API] Error querying profiles:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Map to student profile format
    const formattedStudents = (students || []).map((s: any) => ({
      id: s.id,
      full_name: s.full_name,
      roll_number: s.roll_number,
      email: s.email,
      phone_number: s.phone_number || undefined,
      role: s.role || 'student',
      department: s.department || 'Artificial Intelligence and Data Science (AI&DS)',
      section: s.section || '2',
      batch_year: s.batch_year || '2024-2028 (5th Semester)',
      is_lateral_entry: !!s.is_lateral_entry,
      mentor_id: s.mentor_id,
      mentor_name: s.mentor?.full_name || (s.role === 'student' ? 'Assigned Faculty Mentor' : undefined),
      mentor_email: s.mentor?.email || undefined,
      avatar_url: s.avatar_url,
      skills: ['Academic Portfolio', 'Technical Certifications'],
      resume_url: undefined,
      github_url: undefined,
      linkedin_url: undefined,
    }));

    return NextResponse.json({
      success: true,
      count: formattedStudents.length,
      data: formattedStudents,
    });
  } catch (err: any) {
    console.error('[Students API] Unexpected exception:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
