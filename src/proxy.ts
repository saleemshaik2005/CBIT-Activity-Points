import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { verifySessionToken } from './app/api/auth/team-gate/route';

const ROLE_ALLOWED_ROUTES: Record<string, string[]> = {
  admin: ['/admin', '/hod', '/teacher', '/mentor', '/student'],
  hod: ['/hod'],
  class_teacher: ['/teacher'],
  mentor: ['/mentor'],
  student: ['/student'],
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedAcademicRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/hod') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/mentor') ||
    pathname.startsWith('/student');

  if (!isProtectedAcademicRoute) {
    return NextResponse.next();
  }

  // 1. Check for cryptographically verified team session cookie
  const teamCookie = request.cookies.get('cbit_spms_team_session')?.value;
  if (verifySessionToken(teamCookie)) {
    return NextResponse.next();
  }

  // 2. Cryptographically verify Supabase authentication session
  const response = NextResponse.next();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Authentication system configuration error.');
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Authentication required to access this portal.');
    return NextResponse.redirect(loginUrl);
  }

  // 3. Query role from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const userRole = profile?.role || 'student';
  const allowedPrefixes = ROLE_ALLOWED_ROUTES[userRole] || ['/student'];

  const hasAccess = allowedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!hasAccess) {
    // Redirect unauthorized user to their primary portal
    const primaryPath = allowedPrefixes[0] || '/student';
    const redirectUrl = new URL(primaryPath, request.url);
    redirectUrl.searchParams.set('error', 'Access denied: You lack permissions for that portal.');
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/hod/:path*',
    '/teacher/:path*',
    '/mentor/:path*',
    '/student/:path*',
  ],
};
