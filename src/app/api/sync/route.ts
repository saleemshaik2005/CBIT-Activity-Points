import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { readServerDB, writeServerDB } from '@/lib/server-db';
import { StudentSubmission, UserProfile, NotificationItem, SystemSettings, ActivityCategory } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// GET /api/sync - Fetch full shared state from Supabase (with fallback)
export async function GET() {
  try {
    // 1. Fetch from Supabase
    const [subsRes, catsRes, settingsRes] = await Promise.all([
      supabaseAdmin
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
        .order('created_at', { ascending: false }),

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

    // If Supabase returns successfully
    if (!subsRes.error && !catsRes.error) {
      const serverSubs: StudentSubmission[] = (subsRes.data || []).map((row: any) => {
        const aiData = row.ai_extracted_data || {};
        return {
          id: row.id,
          student_id: row.student_id,
          student_name: row.student?.full_name || 'Student',
          student_roll_no: row.student?.roll_number || '',
          student_email: row.student?.email || '',
          student_phone: row.student?.phone_number || '',
          student_section: row.student?.section || '2',
          student_avatar: row.student?.avatar_url,
          mentor_id: row.student?.mentor_id,
          category_id: row.category_id,
          category: row.category,
          activity_title: row.activity_title,
          issuing_organization: row.issuing_organization || '',
          event_date: row.event_date ? String(row.event_date) : '',
          semester: row.semester,
          academic_year: row.academic_year || '2025-2026',
          claimed_points: row.claimed_points || 0,
          awarded_points: row.awarded_points || 0,
          certificate_url: row.certificate_url,
          file_type: row.file_type || 'application/pdf',
          status: row.status,
          mentor_remarks: row.mentor_remarks,
          approved_by: row.approved_by,
          approved_at: row.approved_at,
          created_at: row.created_at,
          credential_id: aiData.credential_id || undefined,
          verification_url: aiData.verification_url || undefined,
          description: aiData.description || undefined,
          ai_extracted_data: aiData.aiData || aiData,
          ai_tamper_analysis: aiData.tamperAnalysis || aiData.ai_tamper_analysis || undefined,
          messages: Array.isArray(aiData.messages) ? aiData.messages : [],
        };
      });

      const serverCats: ActivityCategory[] = catsRes.data || [];
      const localDb = readServerDB();

      const serverSettings: SystemSettings = settingsRes.data
        ? {
            id: settingsRes.data.id,
            college_name: settingsRes.data.college_name,
            college_code: settingsRes.data.college_code,
            regular_target_points: settingsRes.data.regular_target_points,
            regular_max_points: settingsRes.data.regular_max_points || 100,
            lateral_entry_target_points: settingsRes.data.lateral_entry_target_points,
            lateral_entry_max_points: settingsRes.data.lateral_entry_max_points || 75,
            academic_year: settingsRes.data.academic_year || '2025-2026',
          }
        : localDb.settings;

      return NextResponse.json({
        success: true,
        data: {
          submissions: serverSubs,
          categories: serverCats.length > 0 ? serverCats : localDb.categories,
          settings: serverSettings,
          notifications: localDb.notifications || [],
          profiles: localDb.profiles || {},
          lastUpdated: new Date().toISOString(),
        },
      });
    }

    console.warn('[Sync API GET] Supabase query warning, falling back to local:', subsRes.error);
    const db = readServerDB();
    return NextResponse.json({ success: true, data: db });
  } catch (err: any) {
    console.error('[Sync API GET] Error, using local fallback:', err);
    try {
      const db = readServerDB();
      return NextResponse.json({ success: true, data: db });
    } catch {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
}

// POST /api/sync - Mutate state in Supabase and sync local state
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const db = readServerDB();

    switch (action) {
      case 'add_submission': {
        const sub: StudentSubmission = payload;
        const subId = isValidUUID(sub.id) ? sub.id : crypto.randomUUID();

        // 1. Resolve student UUID if needed
        let resolvedStudentId = sub.student_id;
        if (!isValidUUID(resolvedStudentId)) {
          const { data: prof } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .or(`roll_number.eq.${sub.student_roll_no || ''},email.eq.${sub.student_email || ''}`)
            .maybeSingle();

          if (prof?.id) {
            resolvedStudentId = prof.id;
          }
        }

        // Pack extra metadata into ai_extracted_data JSONB
        const packedAiData = {
          aiData: sub.ai_extracted_data || null,
          tamperAnalysis: sub.ai_tamper_analysis || null,
          messages: sub.messages || [],
          credential_id: sub.credential_id || null,
          verification_url: sub.verification_url || null,
          description: sub.description || null,
        };

        const validStatus = ['draft', 'pending_mentor', 'approved', 'rejected'].includes(sub.status)
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
          awarded_points: sub.awarded_points || 0,
          certificate_url: sub.certificate_url || '',
          file_type: sub.file_type || 'application/pdf',
          ai_extracted_data: packedAiData,
          status: validStatus,
          mentor_remarks: sub.mentor_remarks || null,
          approved_by: sub.approved_by || null,
          approved_at: sub.approved_at || null,
        };

        // Insert into Supabase
        const { error: insertErr } = await supabaseAdmin.from('student_submissions').insert(row);
        if (insertErr) {
          console.error('[Sync API] Supabase submission insert error:', insertErr);
        }

        // Local cache update
        const exists = db.submissions.some((s) => s.id === subId);
        if (!exists) {
          db.submissions = [{ ...sub, id: subId }, ...db.submissions];
        }
        break;
      }

      case 'update_submission_status': {
        const { id, status, remarks, awardedPoints, approverName, approverId } = payload;
        const validStatus = ['draft', 'pending_mentor', 'approved', 'rejected'].includes(status)
          ? status
          : 'pending_mentor';

        const updatePayload: any = {
          status: validStatus,
          mentor_remarks: remarks !== undefined ? remarks : null,
          awarded_points: awardedPoints !== undefined ? awardedPoints : 0,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        };

        if (approverId && isValidUUID(approverId)) {
          updatePayload.approved_by = approverId;
        }

        if (isValidUUID(id)) {
          const { error: updateErr } = await supabaseAdmin
            .from('student_submissions')
            .update(updatePayload)
            .eq('id', id);

          if (updateErr) {
            console.error('[Sync API] Supabase update status error:', updateErr);
          }
        }

        // Local cache
        db.submissions = db.submissions.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              status,
              mentor_remarks: remarks !== undefined ? remarks : s.mentor_remarks,
              awarded_points: awardedPoints !== undefined ? awardedPoints : s.awarded_points,
              approved_by: approverId || s.approved_by,
              approver_name: approverName || s.approver_name,
              approved_at: status === 'approved' ? new Date().toISOString() : s.approved_at,
              updated_at: new Date().toISOString(),
            };
          }
          return s;
        });
        break;
      }

      case 'bulk_approve_submissions': {
        const { ids, remarks, approverName, approverId } = payload;
        const validIds = (ids || []).filter(isValidUUID);

        if (validIds.length > 0) {
          const updatePayload: any = {
            status: 'approved',
            mentor_remarks: remarks || 'Bulk approved by faculty mentor',
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          if (approverId && isValidUUID(approverId)) {
            updatePayload.approved_by = approverId;
          }

          const { error: bulkErr } = await supabaseAdmin
            .from('student_submissions')
            .update(updatePayload)
            .in('id', validIds);

          if (bulkErr) {
            console.error('[Sync API] Supabase bulk approve error:', bulkErr);
          }
        }

        // Local cache
        const idSet = new Set(ids || []);
        db.submissions = db.submissions.map((s) => {
          if (idSet.has(s.id)) {
            return {
              ...s,
              status: 'approved' as const,
              mentor_remarks: remarks || 'Bulk approved by faculty mentor',
              awarded_points: s.claimed_points,
              approved_by: approverId || s.approved_by,
              approver_name: approverName || s.approver_name,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          }
          return s;
        });
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

            await supabaseAdmin
              .from('student_submissions')
              .update({ ai_extracted_data: curData, updated_at: new Date().toISOString() })
              .eq('id', submissionId);
          }
        }

        // Local cache
        db.submissions = db.submissions.map((s) => {
          if (s.id === submissionId) {
            return {
              ...s,
              messages: [...(s.messages || []), message],
              updated_at: new Date().toISOString(),
            };
          }
          return s;
        });
        break;
      }

      case 'update_profile': {
        const { role, profile } = payload;
        if (profile?.id && isValidUUID(profile.id)) {
          await supabaseAdmin
            .from('profiles')
            .update({
              full_name: profile.full_name,
              phone_number: profile.phone_number,
              avatar_url: profile.avatar_url,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);
        }

        if (role && profile) {
          db.profiles[role] = {
            ...(db.profiles[role] || {}),
            ...profile,
          };
        }
        break;
      }

      case 'update_avatar': {
        const { role, avatarUrl, studentId } = payload;
        if (studentId && isValidUUID(studentId)) {
          await supabaseAdmin
            .from('profiles')
            .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
            .eq('id', studentId);
        }

        if (role && db.profiles[role]) {
          db.profiles[role].avatar_url = avatarUrl;
        }
        if (studentId) {
          db.submissions = db.submissions.map((s) => {
            if (s.student_id === studentId) {
              return { ...s, student_avatar: avatarUrl } as any;
            }
            return s;
          });
        }
        break;
      }

      case 'delete_submission': {
        const { id } = payload;
        if (isValidUUID(id)) {
          await supabaseAdmin.from('student_submissions').delete().eq('id', id);
        }
        db.submissions = db.submissions.filter((s) => s.id !== id);
        break;
      }

      case 'add_notification': {
        const newNotif: NotificationItem = payload;
        db.notifications = [newNotif, ...(db.notifications || [])];
        break;
      }

      case 'update_settings': {
        const newSettings: Partial<SystemSettings> = payload;
        await supabaseAdmin
          .from('system_settings')
          .update(newSettings)
          .eq('id', 1);

        db.settings = { ...db.settings, ...newSettings };
        break;
      }

      case 'reassign_mentor': {
        const { studentId, mentorId } = payload;
        if (studentId && isValidUUID(studentId)) {
          const { error: reassignErr } = await supabaseAdmin
            .from('profiles')
            .update({
              mentor_id: mentorId && isValidUUID(mentorId) ? mentorId : null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', studentId);
          if (reassignErr) {
            console.error('[Sync API] Error reassigning mentor:', reassignErr);
          }
        }
        break;
      }

      case 'update_user_role': {
        const { userId, role } = payload;
        if (userId && isValidUUID(userId)) {
          const { error: roleErr } = await supabaseAdmin
            .from('profiles')
            .update({
              role: role,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          if (roleErr) {
            console.error('[Sync API] Error updating user role:', roleErr);
          }
        }
        break;
      }

      case 'mark_notification_read': {
        const { id } = payload;
        db.notifications = db.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
        break;
      }

      case 'mark_all_notifications_read': {
        const { role, userId } = payload;
        db.notifications = db.notifications.map((n) => {
          const isForMe = n.recipient_role === 'all' || n.recipient_role === role || n.recipient_id === userId;
          return isForMe ? { ...n, is_read: true } : n;
        });
        break;
      }

      default: {
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
      }
    }

    writeServerDB(db);
    return NextResponse.json({ success: true, lastUpdated: new Date().toISOString() });
  } catch (err: any) {
    console.error('[Sync API POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
