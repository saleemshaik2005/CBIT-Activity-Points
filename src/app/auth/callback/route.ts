import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const appOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('[OAuth Callback] Error from provider:', error, errorDescription);
    return NextResponse.redirect(
      `${appOrigin}/login?error=${encodeURIComponent(errorDescription || error)}`
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
        `${appOrigin}/login?error=Authentication%20failed.%20Please%20try%20again.`
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
        `${appOrigin}/login?error=unauthorized_email&unauthorized_email=${encodeURIComponent(email)}`
      );
    }

    // Determine target route based on role
    let redirectPath = '/student';
    if (profile.role === 'mentor') redirectPath = '/mentor';
    else if (profile.role === 'class_teacher') redirectPath = '/teacher';
    else if (profile.role === 'hod') redirectPath = '/hod';
    else if (profile.role === 'admin') redirectPath = '/admin';

    const userProfile = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      roll_number: profile.roll_number || undefined,
      department: profile.department || 'Artificial Intelligence and Data Science (AI&DS)',
      section: profile.section || '2',
      batch_year: profile.batch_year || '2024-2028 (5th Semester)',
      is_lateral_entry: !!profile.is_lateral_entry,
      mentor_id: profile.mentor_id || undefined,
      mentor_name: (profile as any).mentor?.full_name || undefined,
      mentor_email: (profile as any).mentor?.email || undefined,
      mentor_phone: (profile as any).mentor?.phone_number || undefined,
      avatar_url: profile.avatar_url || undefined,
      phone_number: profile.phone_number || undefined,
    };

    const htmlResponse = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating with CBIT SPMS...</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #faf9f5; }
    .loader { text-align: center; }
    .spinner { width: 44px; height: 44px; border: 4px solid #e8e3d8; border-top-color: #385529; border-radius: 50%; animation: spin 0.8s infinite linear; margin: 0 auto 16px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <h3 style="color:#1c2718;margin:0 0 8px;font-family:serif;font-weight:bold;">CBIT Student Portfolio</h3>
    <p style="color:#666;font-size:13px;margin:0;">Verifying Two-Factor Authentication session...</p>
  </div>
  <script>
    try {
      var profile = ${JSON.stringify(userProfile)};
      localStorage.setItem('cbit_is_auth', 'true');
      localStorage.setItem('cbit_current_user', JSON.stringify(profile));
      localStorage.setItem('cbit_mar_active_role', profile.role);
      localStorage.setItem('cbit_spms_portal_mode', 'user');
      window.location.replace('${redirectPath}');
    } catch(e) {
      window.location.replace('/login?error=' + encodeURIComponent('Failed to synchronize session'));
    }
  </script>
</body>
</html>`;

    return new Response(htmlResponse, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return NextResponse.redirect(`${appOrigin}/login?error=Missing%20authorization%20code.`);
}
