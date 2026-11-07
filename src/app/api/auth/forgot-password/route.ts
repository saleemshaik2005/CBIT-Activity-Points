import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Verify if profile exists and uses password login
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, role, login_method')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (profile && profile.role === 'student') {
      return NextResponse.json(
        {
          success: false,
          error: 'Students use Google Sign-In and do not have local passwords. Please sign in with Google.',
        },
        { status: 400 }
      );
    }

    if (profile && profile.login_method === 'password') {
      await supabaseAdmin.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${appUrl}/settings?resetPassword=true`,
      });
    }

    // Always return generic success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If this email is registered as an active faculty or admin account, a password recovery link has been sent.',
    });
  } catch (err: any) {
    console.error('[Forgot Password API] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request.' },
      { status: 500 }
    );
  }
}
