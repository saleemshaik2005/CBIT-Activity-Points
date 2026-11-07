import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST() {
  try {
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
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, {
                  ...options,
                  maxAge: 0,
                  path: '/',
                });
              });
            } catch {
              // Ignore
            }
          },
        },
      }
    );

    await supabase.auth.signOut();

    // Expire team session cookie if present
    cookieStore.set('cbit_spms_team_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: any) {
    console.error('[Logout API] Error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Logout error' }, { status: 500 });
  }
}
