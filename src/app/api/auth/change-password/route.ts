import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { user, profile } = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in.' },
        { status: 401 }
      );
    }

    const { userId, newPassword } = await req.json();

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // A user can ONLY update their own password, unless the caller is an authenticated admin
    const isTargetingOtherUser = userId && userId !== user.id;
    if (isTargetingOtherUser && profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Permission denied. You can only change your own password.' },
        { status: 403 }
      );
    }

    const targetUserId = isTargetingOtherUser ? userId : user.id;

    const { error } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
      password: newPassword,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully!' });
  } catch (err: any) {
    console.error('[Change Password API] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
