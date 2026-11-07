import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { StudentSubmission, NotificationItem, SystemSettings, ActivityCategory } from '@/types';
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

    // Fetch public categories and settings
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

    // If caller is NOT authenticated, return only public rules without private records
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

    if (callerRole === 'student' && user?.id) {
      subsQuery = subsQuery.eq('student_id', user.id);
    } else if (callerRole === 'mentor' && user?.id) {
      subsQuery = subsQuery.eq('student.mentor_id', user.id);
    }

    // Also fetch real notifications from database
    let notifsQuery = supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (user?.id) {
      notifsQuery = notifsQuery.or(
        `recipient_id.eq.${user.id},and(recipient_id.is.null,or(recipient_role.eq.${callerRole},recipient_role.is.null))`
      );
    }

    const [subsRes, notifsRes] = await Promise.all([subsQuery, notifsQuery]);

    if (subsRes.error) {
      console.warn('[Sync API] Submissions query warning:', subsRes.error.message);
    }

    const serverSubs: StudentSubmission[] = (subsRes.data || []).map((row: any) => {
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
        notifications: notifsRes.data || [],
        lastUpdated: Date.now(),
      },
    });
  } catch (err: any) {
    console.error('[Sync API] GET handler error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
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

    if (!action) {
      return NextResponse.json({ success: false, error: 'Action parameter is required.' }, { status: 400 });
    }

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
          awarded_points: 0, // Points are never self-awarded
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
          return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
        }

        // Notify mentor if student has one assigned
        if (profile?.mentor_id) {
          await supabaseAdmin.from('notifications').insert({
            recipient_id: profile.mentor_id,
            recipient_role: 'mentor',
            type: 'submission',
            title: 'New Certificate Under Review',
            message: `${profile.full_name} submitted "${row.activity_title}" (${row.claimed_points} claimed pts).`,
            link: '/mentor',
            related_submission_id: subId,
            sender_id: user?.id,
            sender_name: profile.full_name,
            is_read: false,
          });
        }
        break;
      }

      case 'update_submission': {
        const { id, updatedData } = payload;
        if (!isValidUUID(id)) {
          return NextResponse.json({ success: false, error: 'Invalid submission ID.' }, { status: 400 });
        }

        // Fetch submission to verify ownership
        const { data: existingSub, error: fetchErr } = await supabaseAdmin
          .from('student_submissions')
          .select('student_id, status')
          .eq('id', id)
          .single();

        if (fetchErr || !existingSub) {
          return NextResponse.json({ success: false, error: 'Submission not found.' }, { status: 404 });
        }

        if (callerRole === 'student') {
          if (existingSub.student_id !== user?.id) {
            return NextResponse.json({ success: false, error: 'Forbidden: You do not own this submission.' }, { status: 403 });
          }
          if (existingSub.status === 'approved') {
            return NextResponse.json({ success: false, error: 'Forbidden: Approved submissions cannot be modified.' }, { status: 403 });
          }
        }

        const safeUpdate: any = {};
        if (updatedData.activity_title !== undefined) safeUpdate.activity_title = updatedData.activity_title;
        if (updatedData.issuing_organization !== undefined) safeUpdate.issuing_organization = updatedData.issuing_organization;
        if (updatedData.event_date !== undefined) safeUpdate.event_date = updatedData.event_date;
        if (updatedData.semester !== undefined) safeUpdate.semester = updatedData.semester;
        if (updatedData.category_id !== undefined) safeUpdate.category_id = updatedData.category_id;
        if (updatedData.claimed_points !== undefined) safeUpdate.claimed_points = updatedData.claimed_points;
        if (updatedData.certificate_url !== undefined) safeUpdate.certificate_url = updatedData.certificate_url;
        if (updatedData.status !== undefined && ['draft', 'pending_mentor'].includes(updatedData.status)) {
          safeUpdate.status = updatedData.status;
        }
        safeUpdate.updated_at = new Date().toISOString();

        const { error: updateErr } = await supabaseAdmin
          .from('student_submissions')
          .update(safeUpdate)
          .eq('id', id);

        if (updateErr) {
          return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
        }
        break;
      }

      case 'update_submission_status': {
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

        if (!isValidUUID(id)) {
          return NextResponse.json({ success: false, error: 'Valid submission ID required.' }, { status: 400 });
        }

        // Verify mentor mentee scoping if caller is mentor
        const { data: subWithStudent, error: subErr } = await supabaseAdmin
          .from('student_submissions')
          .select('student_id, activity_title, student:profiles!student_id(mentor_id)')
          .eq('id', id)
          .single();

        if (subErr || !subWithStudent) {
          return NextResponse.json({ success: false, error: 'Submission not found.' }, { status: 404 });
        }

        const studentMentorId = (subWithStudent.student as any)?.mentor_id;
        if (callerRole === 'mentor' && studentMentorId !== user?.id) {
          return NextResponse.json(
            { success: false, error: 'Forbidden: You are not the assigned mentor for this student.' },
            { status: 403 }
          );
        }

        const updatePayload: any = {
          status: validStatus,
          mentor_remarks: remarks !== undefined ? remarks : null,
          awarded_points: validStatus === 'approved' && awardedPoints !== undefined ? awardedPoints : 0,
          approved_by: validStatus === 'approved' ? callerId : null,
          approved_at: validStatus === 'approved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        };

        const { error: updateErr } = await supabaseAdmin
          .from('student_submissions')
          .update(updatePayload)
          .eq('id', id);

        if (updateErr) {
          return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
        }

        // Create student notification
        await supabaseAdmin.from('notifications').insert({
          recipient_id: subWithStudent.student_id,
          recipient_role: 'student',
          type: validStatus === 'approved' ? 'approval' : validStatus === 'rejected' ? 'rejection' : 'clarification',
          title: validStatus === 'approved'
            ? `Certificate Approved (+${updatePayload.awarded_points} Pts)`
            : validStatus === 'rejected'
            ? 'Certificate Rejected'
            : 'Mentor Requested Clarification',
          message: remarks || `Status updated to ${validStatus}.`,
          link: '/student/history',
          related_submission_id: id,
          sender_id: user?.id,
          sender_name: profile?.full_name || 'Faculty Mentor',
          is_read: false,
        });
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
          const { error: bulkErr } = await supabaseAdmin
            .from('student_submissions')
            .update({
              status: 'approved',
              mentor_remarks: remarks || 'Approved by Faculty Mentor',
              approved_by: callerId,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .in('id', validIds);

          if (bulkErr) {
            return NextResponse.json({ success: false, error: bulkErr.message }, { status: 500 });
          }
        }
        break;
      }

      case 'delete_submission': {
        const { id } = payload;
        if (!isValidUUID(id)) {
          return NextResponse.json({ success: false, error: 'Valid submission ID required.' }, { status: 400 });
        }

        let deleteQuery = supabaseAdmin.from('student_submissions').delete().eq('id', id);
        if (callerRole === 'student' && user?.id) {
          deleteQuery = deleteQuery.eq('student_id', user.id);
        }

        const { error: delErr } = await deleteQuery;
        if (delErr) {
          return NextResponse.json({ success: false, error: delErr.message }, { status: 500 });
        }
        break;
      }

      case 'update_profile': {
        const targetId = callerRole === 'student' && user?.id ? user.id : payload.userId || callerId;
        if (!isValidUUID(targetId)) {
          return NextResponse.json({ success: false, error: 'Invalid profile ID.' }, { status: 400 });
        }

        const p = payload.profile || payload;
        const safeProfile: any = {};
        if (p.phone_number !== undefined) safeProfile.phone_number = p.phone_number;
        if (p.skills !== undefined) safeProfile.skills = Array.isArray(p.skills) ? p.skills : [];
        if (p.github_url !== undefined) safeProfile.github_url = p.github_url;
        if (p.linkedin_url !== undefined) safeProfile.linkedin_url = p.linkedin_url;
        if (p.resume_url !== undefined) safeProfile.resume_url = p.resume_url;
        if (p.avatar_url !== undefined) safeProfile.avatar_url = p.avatar_url;
        safeProfile.updated_at = new Date().toISOString();

        const { error: profErr } = await supabaseAdmin
          .from('profiles')
          .update(safeProfile)
          .eq('id', targetId);

        if (profErr) {
          return NextResponse.json({ success: false, error: profErr.message }, { status: 500 });
        }
        break;
      }

      case 'reassign_mentor': {
        if (!['hod', 'class_teacher', 'admin'].includes(callerRole)) {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Only HoD, Class Coordinator, or Admin can reassign mentors.' },
            { status: 403 }
          );
        }

        const { studentId, newMentorId } = payload;
        if (!isValidUUID(studentId) || !isValidUUID(newMentorId)) {
          return NextResponse.json(
            { success: false, error: 'Valid student ID and new mentor ID are required.' },
            { status: 400 }
          );
        }

        const { error: reassignErr } = await supabaseAdmin
          .from('profiles')
          .update({ mentor_id: newMentorId, updated_at: new Date().toISOString() })
          .eq('id', studentId);

        if (reassignErr) {
          return NextResponse.json({ success: false, error: reassignErr.message }, { status: 500 });
        }

        // Notify student of reassignment
        await supabaseAdmin.from('notifications').insert({
          recipient_id: studentId,
          recipient_role: 'student',
          type: 'reassignment',
          title: 'Faculty Mentor Reassigned',
          message: 'Your official faculty mentor assignment has been updated by the department coordinator.',
          link: '/student',
          sender_id: user?.id,
          sender_name: profile?.full_name || 'Department Coordinator',
          is_read: false,
        });
        break;
      }

      case 'update_user_role': {
        if (callerRole !== 'admin') {
          return NextResponse.json(
            { success: false, error: 'Forbidden: Only Administrators can modify user roles.' },
            { status: 403 }
          );
        }

        const { targetUserId, newRole } = payload;
        if (!isValidUUID(targetUserId) || !newRole) {
          return NextResponse.json({ success: false, error: 'Valid user ID and role required.' }, { status: 400 });
        }

        const { error: roleErr } = await supabaseAdmin
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', targetUserId);

        if (roleErr) {
          return NextResponse.json({ success: false, error: roleErr.message }, { status: 500 });
        }
        break;
      }

      case 'add_notification': {
        const { recipient_id, recipient_role, type, title, message, link, related_submission_id } = payload;
        const { error: notifErr } = await supabaseAdmin.from('notifications').insert({
          recipient_id: recipient_id && isValidUUID(recipient_id) ? recipient_id : null,
          recipient_role: recipient_role || null,
          type: type || 'announcement',
          title: String(title || 'Announcement').trim(),
          message: String(message || '').trim(),
          link: link || null,
          related_submission_id: related_submission_id && isValidUUID(related_submission_id) ? related_submission_id : null,
          sender_id: user?.id,
          sender_name: profile?.full_name || 'System Notification',
          is_read: false,
        });

        if (notifErr) {
          return NextResponse.json({ success: false, error: notifErr.message }, { status: 500 });
        }
        break;
      }

      case 'mark_notification_read': {
        const { id } = payload;
        if (isValidUUID(id) && user?.id) {
          await supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .eq('recipient_id', user.id);
        }
        break;
      }

      case 'mark_all_notifications_read': {
        if (user?.id) {
          await supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .eq('recipient_id', user.id);
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
        const { error: setErr } = await supabaseAdmin.from('system_settings').update(newSettings).eq('id', 1);
        if (setErr) {
          return NextResponse.json({ success: false, error: setErr.message }, { status: 500 });
        }
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
          const { error: catErr } = await supabaseAdmin
            .from('activity_categories')
            .update({
              default_points: cat.default_points,
              max_points_allowed: cat.max_points_allowed,
              description: cat.description,
              is_active: cat.is_active,
            })
            .eq('id', cat.id);

          if (catErr) {
            return NextResponse.json({ success: false, error: catErr.message }, { status: 500 });
          }
        }
        break;
      }

      case 'add_message': {
        const { submissionId, message } = payload;
        if (isValidUUID(submissionId)) {
          const { data: current } = await supabaseAdmin
            .from('student_submissions')
            .select('ai_extracted_data')
            .eq('id', submissionId)
            .single();

          if (current) {
            const curData = current.ai_extracted_data || {};
            const existingMsgs = Array.isArray(curData.messages) ? curData.messages : [];
            curData.messages = [...existingMsgs, message];

            const { error: msgErr } = await supabaseAdmin
              .from('student_submissions')
              .update({ ai_extracted_data: curData, updated_at: new Date().toISOString() })
              .eq('id', submissionId);

            if (msgErr) {
              return NextResponse.json({ success: false, error: msgErr.message }, { status: 500 });
            }
          }
        }
        break;
      }

      case 'update_avatar': {
        const { avatarUrl } = payload;
        const targetId = callerRole === 'student' && user?.id ? user.id : payload.studentId || callerId;
        if (isValidUUID(targetId)) {
          const { error: avErr } = await supabaseAdmin
            .from('profiles')
            .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
            .eq('id', targetId);

          if (avErr) {
            return NextResponse.json({ success: false, error: avErr.message }, { status: 500 });
          }
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown synchronization action: '${action}'.` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, lastUpdated: Date.now() });
  } catch (err: any) {
    console.error('[Sync API] POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
