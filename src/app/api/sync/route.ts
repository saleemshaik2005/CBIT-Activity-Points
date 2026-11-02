import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { readServerDB, writeServerDB } from '@/lib/server-db';
import { StudentSubmission, UserProfile, NotificationItem, SystemSettings, ActivityCategory } from '@/types';
import { getAuthenticatedUser } from '@/lib/supabase/server';
import { verifySessionToken } from '@/app/api/auth/team-gate/route';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// GET /api/sync - Scoped fetch from Supabase based on verified caller session
export async function GET(req: NextRequest) {
  try {
    const { user, profile } = await getAuthenticatedUser();
    const teamCookie = req.cookies.get('cbit_spms_team_session')?.value;
    const isTeamAuth = verifySessionToken(teamCookie);

    // Fetch public categories and settings (always safe)
    const [catsRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from('activity_categories')
        .select('*')
        .order('sno', { ascending: true })
        .order('id', { ascending: true }),

      supabaseAdmin
        .from('system_settings')
        .select('*')
        .limit(1)
        .maybeSingle(),
    ]);

    const categories = catsRes.data || [];
    const settings = settingsRes.data || null;

    // If caller is NOT authenticated (and not in team sandbox), return only public rules without private records
    if (!user && !isTeamAuth) {
      return NextResponse.json({
        success: true,
        data: {
          submissions: [],
          categories,
          settings,
          profiles: {},
          notifications: [],
          lastUpdated: Date.now(),
        },
      });
    }

    // Authenticated queries: Scope submissions according to user role
    const callerRole = isTeamAuth ? 'admin' : profile?.role || 'student';
    let subsQuery = supabaseAdmin
      .from('student_submissions')
      .select(`
        *,
        student:profiles!student_id (
          id,
          full_name,
          roll_number,
          email,
          phone_number,
          section,
          avatar_url,
          mentor_id
        ),
        category:activity_categories!category_id (
          id,
          sno,
          name,
          sub_type,
          default_points,
          max_points_allowed,
          description
        )
      `)
      .order('created_at', { ascending: false });

    // Role-based scope enforcement:
    // - Students can ONLY read their own submissions
    // - Mentors can ONLY read their mentees' submissions
    // - HOD, Class Teacher, Admin, Team can read all in department
    if (callerRole === 'student' && user?.id) {
      subsQuery = subsQuery.eq('student_id', user.id);
    } else if (callerRole === 'mentor' && user?.id) {
      subsQuery = subsQuery.eq('student.mentor_id', user.id);
    }

    const { data: rawSubs, error: subsError } = await subsQuery;

    if (subsError) {
      console.warn('[Sync API] Submissions query warning:', subsError.message);
    }

    const serverSubs: StudentSubmission[] = (rawSubs || []).map((row: any) => {
      const student = row.student || {};
      const cat = row.category || {};
      const aiMeta = row.ai_extracted_data || {};

      return {
        id: row.id,
        student_id: row.student_id,
        student_name: student.full_name || row.student_name || 'Student',
        student_roll_no: student.roll_number || row.student_roll_no || '',
        student_email: student.email || row.student_email || '',
        student_phone: student.phone_number || undefined,
        student_section: student.section || row.student_section || '2',
        student_avatar: student.avatar_url || undefined,
        mentor_id: student.mentor_id || undefined,
        category_id: row.category_id,
        category: cat.id ? cat : undefined,
        activity_title: row.activity_title,
        issuing_organization: row.issuing_organization || '',
        event_date: row.event_date ? String(row.event_date).split('T')[0] : '',
        semester: row.semester,
        academic_year: row.academic_year || '2025-2026',
        claimed_points: row.claimed_points,
        awarded_points: row.awarded_points || 0,
        certificate_url: row.certificate_url,
        file_type: row.file_type || 'application/pdf',
        credential_id: aiMeta.credential_id || undefined,
        verification_url: aiMeta.verification_url || undefined,
        description: aiMeta.description || undefined,
        ai_extracted_data: aiMeta.aiData || undefined,
        ai_tamper_analysis: aiMeta.tamperAnalysis || undefined,
        messages: Array.isArray(aiMeta.messages) ? aiMeta.messages : [],
        status: row.status,
        mentor_remarks: row.mentor_remarks || undefined,
        approved_by: row.approved_by || undefined,
        approved_at: row.approved_at || undefined,
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || undefined,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        submissions: serverSubs,
        categories,
        settings,
        profiles: {},
        notifications: [],
        lastUpdated: Date.now(),
      },
    });
  } catch (err: any) {
    console.error('[Sync API] GET handler error:', err);
    return NextResponse.json({ success: false, error: 'Failed to synchronize data' }, { status: 500 });
  }
}

// POST /api/sync - Authoritative mutations with role validation
export async function POST(req: NextRequest) {
  try {
    const { user, profile } = await getAuthenticatedUser();
    const teamCookie = req.cookies.get('cbit_spms_team_session')?.value;
    const isTeamAuth = verifySessionToken(teamCookie);

    if (!user && !isTeamAuth) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to modify records.' },
        { status: 401 }
      );
    }

    const callerRole = isTeamAuth ? 'admin' : profile?.role || 'student';
    const callerId = user?.id || 'team-session';

    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case 'add_submission': {
        const sub: StudentSubmission = payload;
        const subId = isValidUUID(sub.id) ? sub.id : crypto.randomUUID();

        // Enforce ownership: students can only submit for themselves
        let resolvedStudentId = callerRole === 'student' && user?.id ? user.id : sub.student_id;
        if (!isValidUUID(resolvedStudentId)) {
          resolvedStudentId = callerId;
        }

        const packedAiData = {
          aiData: sub.ai_extracted_data || null,
          tamperAnalysis: sub.ai_tamper_analysis || null,
          messages: sub.messages || [],
          credential_id: sub.credential_id || null,
          verification_url: sub.verification_url || null,
          description: sub.description || null,
        };

        const validStatus = ['draft', 'pending_mentor'].includes(sub.status)
          ? sub.status
          : 'pending_mentor';

        const row = {
          id: subId,
          student_id: resolvedStudentId,
          category_id: sub.category_id || 1,
          activity_title: sub.activity_title || 'Activity Certificate',
          issuing_organization: sub.issuing_organization || '',
          event_date: sub.event_date || new Date().toISOString().split('T')[0],
          semester: sub.semester || 5,
          academic_year: sub.academic_year || '2025-2026',
          claimed_points: sub.claimed_points || 0,
          awarded_points: 0, // Points are never self-awarded!
          certificate_url: sub.certificate_url || '',
          file_type: sub.file_type || 'application/pdf',
          ai_extracted_data: packedAiData,
          status: validStatus,
          mentor_remarks: null,
          approved_by: null,
          approved_at: null,
        };

        const { error: insertErr } = await supabaseAdmin.from('student_submissions').insert(row);
        if (insertErr) {
          console.error('[Sync API] Submission insert error:', insertErr);
        }
        break;
      }

      case 'update_submission_status': {
        // Only mentors, faculty, HOD, and admins can approve or reject
        if (callerRole === 'student') {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Students cannot approve or reject certificates.' },
            { status: 403 }
          );
        }

        const { id, status, remarks, awardedPoints } = payload;
        const validStatus = ['approved', 'rejected', 'needs_clarification', 'pending_mentor'].includes(status)
          ? status
          : 'pending_mentor';

        if (isValidUUID(id)) {
          // IDOR Defense: If caller is a mentor, verify this submission belongs to their assigned mentee
          if (callerRole === 'mentor' && user?.id) {
            const { data: subCheck } = await supabaseAdmin
              .from('student_submissions')
              .select('id, student:profiles!student_id(mentor_id)')
              .eq('id', id)
              .maybeSingle();

            const studentMentorId = (subCheck?.student as any)?.mentor_id;
            if (!subCheck || studentMentorId !== user.id) {
              return NextResponse.json(
                { success: false, error: 'Forbidden: You can only evaluate submissions belonging to your assigned mentees.' },
                { status: 403 }
              );
            }
          }

          const updatePayload: any = {
            status: validStatus,
            mentor_remarks: remarks !== undefined ? String(remarks).slice(0, 1000) : null,
            awarded_points: status === 'approved' && awardedPoints !== undefined ? Math.max(0, Math.min(100, Number(awardedPoints) || 0)) : 0,
            approved_by: status === 'approved' ? callerId : null,
            approved_at: status === 'approved' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          };

          await supabaseAdmin
            .from('student_submissions')
            .update(updatePayload)
            .eq('id', id);
        }
        break;
      }

      case 'bulk_approve_submissions': {
        if (callerRole === 'student') {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Students cannot bulk-approve certificates.' },
            { status: 403 }
          );
        }

        const { ids, remarks } = payload;
        const validIds = (ids || []).filter(isValidUUID);

        if (validIds.length > 0) {
          // IDOR Defense: If mentor, ensure every ID belongs to an assigned mentee
          if (callerRole === 'mentor' && user?.id) {
            const { data: subsData } = await supabaseAdmin
              .from('student_submissions')
              .select('id, student:profiles!student_id(mentor_id)')
              .in('id', validIds);

            const hasUnauthorized = (subsData || []).some(
              (s: any) => s.student?.mentor_id !== user.id
            );

            if (hasUnauthorized || (subsData?.length || 0) !== validIds.length) {
              return NextResponse.json(
                { success: false, error: 'Forbidden: Some selected submissions do not belong to your assigned mentees.' },
                { status: 403 }
              );
            }
          }

          await supabaseAdmin
            .from('student_submissions')
            .update({
              status: 'approved',
              mentor_remarks: remarks ? String(remarks).slice(0, 1000) : 'Approved by Faculty Mentor',
              approved_by: callerId,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .in('id', validIds);
        }
        break;
      }

      case 'delete_submission': {
        const { id } = payload;
        if (isValidUUID(id)) {
          let deleteQuery = supabaseAdmin.from('student_submissions').delete().eq('id', id);
          // Students can only delete their own submissions
          if (callerRole === 'student' && user?.id) {
            deleteQuery = deleteQuery.eq('student_id', user.id);
          }
          await deleteQuery;
        }
        break;
      }

      case 'update_settings': {
        if (callerRole !== 'admin') {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Only administrators can modify system settings.' },
            { status: 403 }
          );
        }
        const newSettings: Partial<SystemSettings> = payload;
        await supabaseAdmin.from('system_settings').update(newSettings).eq('id', 1);
        break;
      }

      case 'update_category': {
        if (callerRole !== 'admin') {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Only administrators can modify activity categories.' },
            { status: 403 }
          );
        }
        const cat: ActivityCategory = payload;
        if (cat.id) {
          await supabaseAdmin
            .from('activity_categories')
            .update({
              default_points: cat.default_points,
              max_points_allowed: cat.max_points_allowed,
              description: cat.description,
              is_active: cat.is_active,
            })
            .eq('id', cat.id);
        }
        break;
      }

      case 'add_message': {
        const { submissionId, message } = payload;
        if (isValidUUID(submissionId) && message && typeof message.text === 'string') {
          const { data: current } = await supabaseAdmin
            .from('student_submissions')
            .select('id, student_id, ai_extracted_data, student:profiles!student_id(mentor_id)')
            .eq('id', submissionId)
            .maybeSingle();

          if (current) {
            // IDOR Protection: Verify caller is the student owner, assigned mentor, or admin/coordinator
            const isOwner = user?.id && current.student_id === user.id;
            const isAssignedMentor = user?.id && (current.student as any)?.mentor_id === user.id;
            const isPrivileged = callerRole === 'admin' || callerRole === 'hod' || callerRole === 'class_teacher' || isTeamAuth;

            if (!isOwner && !isAssignedMentor && !isPrivileged) {
              return NextResponse.json(
                { success: false, error: 'Forbidden: You cannot comment on this submission.' },
                { status: 403 }
              );
            }

            const cleanMessage = {
              id: message.id || crypto.randomUUID(),
              sender_role: callerRole,
              sender_name: profile?.full_name || (callerRole === 'admin' ? 'Administrator' : 'Faculty'),
              text: String(message.text).slice(0, 1000),
              created_at: new Date().toISOString(),
            };

            const curData = current.ai_extracted_data || {};
            const existingMsgs = Array.isArray(curData.messages) ? curData.messages : [];
            curData.messages = [...existingMsgs, cleanMessage];

            await supabaseAdmin
              .from('student_submissions')
              .update({ ai_extracted_data: curData, updated_at: new Date().toISOString() })
              .eq('id', submissionId);
          }
        }
        break;
      }

      case 'update_avatar': {
        const { avatarUrl } = payload;
        const targetId = callerRole === 'student' && user?.id ? user.id : payload.studentId || callerId;
        if (isValidUUID(targetId)) {
          await supabaseAdmin
            .from('profiles')
            .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
            .eq('id', targetId);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ success: true, lastUpdated: Date.now() });
  } catch (err: any) {
    console.error('[Sync API] POST error:', err);
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}
