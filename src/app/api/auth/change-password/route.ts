import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    // Explicitly allow users whose must_change_password is true so they can execute their first-login reset
    const auth = await requireRole([], { allowMustChangePassword: true });

    if (auth.response || !auth.user || !auth.profile) {
      return (
        auth.response ||
        NextResponse.json(
          { success: false, error: 'Authentication required. Please sign in.' },
          { status: 401 }
        )
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Require current password for voluntary changes (when not in forced first-login reset)
    const isForcedReset = auth.profile.must_change_password === true;

    if (!isForcedReset) {
      if (!currentPassword || typeof currentPassword !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Current password is required to change your password.' },
          { status: 400 }
        );
      }

      // Verify current password with Supabase Auth
      const { error: verifyErr } = await supabaseAdmin.auth.signInWithPassword({
        email: auth.user.email || auth.profile.email,
        password: currentPassword.trim(),
      });

      if (verifyErr) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect.' },
          { status: 400 }
        );
      }
    }

    if (currentPassword && currentPassword.trim() === newPassword.trim()) {
      return NextResponse.json(
        { success: false, error: 'New password cannot be identical to your current password.' },
        { status: 400 }
      );
    }

    // Update password strictly for the authenticated session user
    const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(
      auth.user.id,
      { password: newPassword.trim() }
    );

    if (updateAuthErr) {
      console.error('[Change Password API] Auth update error:', updateAuthErr);
      return NextResponse.json(
        { success: false, error: updateAuthErr.message || 'Failed to update password.' },
        { status: 500 }
      );
    }

    // Clear must_change_password flag on profile
    const { error: profileErr } = await supabaseAdmin
      .from('profiles')
      .update({
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', auth.user.id);

    if (profileErr) {
      console.warn('[Change Password API] Profile flag update warning:', profileErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Password successfully updated. You may now continue using your account.',
    });
  } catch (err: any) {
    console.error('[Change Password API] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
