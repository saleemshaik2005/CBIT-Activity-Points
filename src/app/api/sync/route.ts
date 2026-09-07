import { NextRequest, NextResponse } from 'next/server';
import { readServerDB, writeServerDB } from '@/lib/server-db';
import { StudentSubmission, UserProfile, NotificationItem, SystemSettings } from '@/types';

export const runtime = 'nodejs';

// GET /api/sync - Fetch full shared server state
export async function GET() {
  try {
    const db = readServerDB();
    return NextResponse.json({
      success: true,
      data: db,
    });
  } catch (err: any) {
    console.error('[Sync API GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/sync - Update shared server state across devices
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const db = readServerDB();

    switch (action) {
      case 'add_submission': {
        const newSub: StudentSubmission = payload;
        // Check for duplicates
        const exists = db.submissions.some((s) => s.id === newSub.id);
        if (!exists) {
          db.submissions = [newSub, ...db.submissions];
        }
        break;
      }

      case 'update_submission_status': {
        const { id, status, remarks, awardedPoints, approverName, approverId } = payload;
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
        const idSet = new Set(ids);
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
        if (role && db.profiles[role]) {
          db.profiles[role].avatar_url = avatarUrl;
        }
        // Also update in all matching student submissions
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

      case 'add_notification': {
        const newNotif: NotificationItem = payload;
        db.notifications = [newNotif, ...(db.notifications || [])];
        break;
      }

      case 'update_settings': {
        const newSettings: Partial<SystemSettings> = payload;
        db.settings = {
          ...db.settings,
          ...newSettings,
        };
        break;
      }

      case 'update_submission': {
        const { id, updatedData } = payload;
        db.submissions = db.submissions.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              ...updatedData,
              updated_at: new Date().toISOString(),
            };
          }
          return s;
        });
        break;
      }

      case 'delete_submission': {
        const { id } = payload;
        db.submissions = db.submissions.filter((s) => s.id !== id);
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

      case 'reset_defaults': {
        const { getInitialRealtimeSubmissions } = await import('@/lib/server-db');
        db.submissions = getInitialRealtimeSubmissions();
        break;
      }

      default: {
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
      }
    }

    const saved = writeServerDB(db);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to write to server database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lastUpdated: db.lastUpdated });
  } catch (err: any) {
    console.error('[Sync API POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
