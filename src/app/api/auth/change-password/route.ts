import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';

// Rate limiter for password changes (max 5 attempts per 15 minutes per IP)
const pwdAttempts = new Map<string, { count: number; lockedUntil: number; lastSeen: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();
    const record = pwdAttempts.get(ip) || { count: 0, lockedUntil: 0, lastSeen: now };

    if (record.lockedUntil > now) {
      const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return NextResponse.json(
        { success: false, error: `Too many password change attempts. Please wait ${waitSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { user, profile } = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, currentPassword, newPassword } = body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Password complexity check
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasDigitOrSpecial = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
    if (!hasLetter || !hasDigitOrSpecial) {
      return NextResponse.json(
        { success: false, error: 'New password must contain both letters and numbers or symbols.' },
        { status: 400 }
      );
    }

    const isTargetingOtherUser = userId && userId !== user.id;

    // Only administrators can change someone else's password
    if (isTargetingOtherUser && profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Permission denied. You can only change your own password.' },
        { status: 403 }
      );
    }

    // If changing own password, MUST verify current password first
    if (!isTargetingOtherUser) {
      if (!currentPassword || typeof currentPassword !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Current password is required to set a new password.' },
          { status: 400 }
        );
      }

      const verifyRes = await supabaseAdmin.auth.signInWithPassword({
        email: user.email || '',
        password: currentPassword,
      });

      if (verifyRes.error || !verifyRes.data.user) {
        record.count += 1;
        record.lastSeen = now;
        if (record.count >= 5) {
          record.lockedUntil = now + 15 * 60 * 1000;
        }
        pwdAttempts.set(ip, record);

        return NextResponse.json(
          { success: false, error: 'Current password verification failed. Please check your existing password.' },
          { status: 401 }
        );
      }
    }

    const targetUserId = isTargetingOtherUser ? userId : user.id;

    const { error } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
      password: newPassword,
    });

    if (error) {
      console.error('[Change Password API] Supabase update error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Failed to update password. Please try again.' },
        { status: 500 }
      );
    }

    // Clear rate limit record on success
    pwdAttempts.delete(ip);

    return NextResponse.json({ success: true, message: 'Password updated successfully!' });
  } catch (err: any) {
    console.error('[Change Password API] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process password change request.' },
      { status: 500 }
    );
  }
}
