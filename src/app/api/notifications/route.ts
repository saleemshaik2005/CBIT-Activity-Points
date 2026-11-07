import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// GET /api/notifications - Scoped notifications for authenticated user
export async function GET() {
  try {
    const auth = await requireRole([], { allowMustChangePassword: true });
    if (auth.response || !auth.user || !auth.profile) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const { user, profile } = auth;

    // Fetch user-directed notifications or broadcast announcements matching their role
    const { data: notifs, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .or(`recipient_id.eq.${user.id},and(recipient_id.is.null,or(recipient_role.eq.${profile.role},recipient_role.is.null))`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.warn('[/api/notifications GET] Query warning:', error.message);
      return NextResponse.json({ success: true, notifications: [] });
    }

    return NextResponse.json({
      success: true,
      notifications: notifs || [],
    });
  } catch (err: any) {
    console.error('[/api/notifications GET] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH /api/notifications - Mark notification(s) as read
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireRole([], { allowMustChangePassword: true });
    if (auth.response || !auth.user) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const body = await req.json();
    const { id, markAll } = body;

    if (markAll) {
      // Mark all notifications for this recipient as read
      await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', auth.user.id);

      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (id && isValidUUID(id)) {
      await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('recipient_id', auth.user.id);

      return NextResponse.json({ success: true, message: 'Notification marked as read.' });
    }

    return NextResponse.json({ success: false, error: 'Notification ID required.' }, { status: 400 });
  } catch (err: any) {
    console.error('[/api/notifications PATCH] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/notifications - Create an authenticated notification
export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole();
    if (auth.response || !auth.user || !auth.profile) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const { user, profile } = auth;
    const body = await req.json();
    const { recipient_id, recipient_role, type, title, message, link, related_submission_id } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        { success: false, error: 'Title, message, and notification type are required.' },
        { status: 400 }
      );
    }

    // Role check for broadcasting general announcements (only HoD, Class Teacher, Admin)
    const isBroadcast = !recipient_id;
    if (isBroadcast && !['hod', 'class_teacher', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { success: false, error: 'Only faculty and administrators can broadcast announcements.' },
        { status: 403 }
      );
    }

    const validRecipientId = recipient_id && isValidUUID(recipient_id) ? recipient_id : null;
    const validSubId = related_submission_id && isValidUUID(related_submission_id) ? related_submission_id : null;

    const newNotif = {
      recipient_id: validRecipientId,
      recipient_role: recipient_role || null,
      type,
      title: String(title).trim(),
      message: String(message).trim(),
      link: link || null,
      related_submission_id: validSubId,
      sender_id: user.id,
      sender_name: `${profile.full_name} (${profile.role.toUpperCase()})`,
      is_read: false,
    };

    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from('notifications')
      .insert(newNotif)
      .select('*')
      .single();

    if (insertErr) {
      console.error('[/api/notifications POST] Insert error:', insertErr);
      return NextResponse.json(
        { success: false, error: 'Failed to record notification.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, notification: inserted });
  } catch (err: any) {
    console.error('[/api/notifications POST] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/notifications - Delete notification
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireRole();
    if (auth.response || !auth.user) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const body = await req.json();
    const { id } = body;

    if (!id || !isValidUUID(id)) {
      return NextResponse.json({ success: false, error: 'Valid notification ID required.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('recipient_id', auth.user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Notification removed.' });
  } catch (err: any) {
    console.error('[/api/notifications DELETE] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
