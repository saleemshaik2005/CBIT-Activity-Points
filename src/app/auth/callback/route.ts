import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('[OAuth Callback] Error from provider:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore in server action
            }
          },
        },
      }
    );

    const {
      data: { session },
      error: exchangeError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError || !session?.user?.email) {
      console.error('[OAuth Callback] Code exchange failed:', exchangeError);
      return NextResponse.redirect(
        `${origin}/login?error=Authentication%20failed.%20Please%20try%20again.`
      );
    }

    const email = session.user.email.toLowerCase();

    // Verify strictly against our pre-authorized 67-student + 6-faculty roster
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*, mentor:mentor_id(id, full_name, email, phone_number)')
      .ilike('email', email)
      .maybeSingle();

    // A valid student MUST have an official CBIT roll_number (prevents auto-created trigger rows from bypassing whitelist)
    const isUnauthorized =
      !profile || (profile.role === 'student' && (!profile.roll_number || profile.roll_number.trim() === ''));

    if (isUnauthorized) {
      console.warn(`[OAuth Callback] Blocked unauthorized Google login attempt: ${email}`);
      await supabase.auth.signOut();

      // Purge any auto-created auth.users / profiles row for this unauthorized Google account
      try {
        await supabaseAdmin.from('profiles').delete().eq('id', session.user.id);
        await supabaseAdmin.auth.admin.deleteUser(session.user.id);
      } catch (cleanupErr) {
        console.warn('[OAuth Callback] Cleanup warning:', cleanupErr);
      }

      return NextResponse.redirect(
        `${origin}/login?error=unauthorized_email&unauthorized_email=${encodeURIComponent(email)}`
      );
    }

    // Determine target route based on role
    let redirectPath = '/student';
    if (profile.role === 'mentor') redirectPath = '/mentor';
    else if (profile.role === 'class_teacher') redirectPath = '/teacher';
    else if (profile.role === 'hod') redirectPath = '/hod';
    else if (profile.role === 'admin') redirectPath = '/admin';

    return NextResponse.redirect(`${origin}${redirectPath}?auth_sync=true`);
  }

  return NextResponse.redirect(`${origin}/login?error=Missing%20authorization%20code.`);
}
