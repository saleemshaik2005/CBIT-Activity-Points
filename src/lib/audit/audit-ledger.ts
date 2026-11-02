import { supabaseAdmin } from '@/lib/supabase-admin';
import { UserRole } from '@/types';

export interface AuditLogEntry {
  actorId?: string | null;
  actorRole?: UserRole | string;
  targetSubmissionId?: string | null;
  studentId?: string | null;
  action:
    | 'SUBMISSION_CREATED'
    | 'AI_PARSED'
    | 'AI_PARSE_FAILED'
    | 'MENTOR_APPROVED'
    | 'MENTOR_REJECTED'
    | 'STATUS_CHANGED'
    | 'POINTS_OVERRIDDEN'
    | 'SUBMISSION_DELETED'
    | 'MANUAL_REVIEW_FLAGGED'
    | 'SYSTEM_SETTINGS_UPDATED'
    | 'CATEGORY_UPDATED';
  previousStatus?: string | null;
  newStatus?: string | null;
  previousPoints?: number | null;
  newPoints?: number | null;
  reasonCode?: string | null;
  remarks?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
}

/**
 * Immutable Append-Only Audit Ledger Recorder
 * Guarantees that all state mutations, points modifications, and approvals
 * leave an indelible trace for institutional compliance and NBA/NAAC accreditation audits.
 */
export async function recordAuditLog(entry: AuditLogEntry): Promise<{ success: boolean; logId?: string; error?: string }> {
  try {
    const row = {
      actor_id: entry.actorId || null,
      actor_role: entry.actorRole || null,
      target_submission_id: entry.targetSubmissionId || null,
      student_id: entry.studentId || null,
      action: entry.action,
      previous_status: entry.previousStatus || null,
      new_status: entry.newStatus || null,
      previous_points: entry.previousPoints !== undefined ? entry.previousPoints : null,
      new_points: entry.newPoints !== undefined ? entry.newPoints : null,
      reason_code: entry.reasonCode || null,
      remarks: entry.remarks ? String(entry.remarks).slice(0, 1500) : null,
      metadata: entry.metadata || {},
      ip_address: entry.ipAddress || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('activity_point_audit_logs')
      .insert(row)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('[Audit Ledger] Failed to persist audit entry:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, logId: data?.id };
  } catch (err: any) {
    console.error('[Audit Ledger] Unexpected exception writing audit log:', err);
    return { success: false, error: err.message };
  }
}
