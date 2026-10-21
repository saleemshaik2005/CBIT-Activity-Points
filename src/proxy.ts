import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './app/api/auth/team-gate/route';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected administrative and faculty routes
  const isFacultyOrAdminRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/hod') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/mentor');

  if (isFacultyOrAdminRoute) {
    // 1. Check for cryptographically verified team session cookie
    const teamCookie = request.cookies.get('cbit_spms_team_session')?.value;
    if (verifySessionToken(teamCookie)) {
      return NextResponse.next();
    }

    // 2. Check for active Supabase authentication session cookies
    const allCookies = request.cookies.getAll();
    const hasSupabaseCookie = allCookies.some(
      (c) =>
        (c.name.includes('sb-') && c.name.includes('auth-token')) ||
        c.name === 'supabase-auth-token'
    );

    // If accessing administrative routes directly without any valid session cookie, redirect to login
    if (!hasSupabaseCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'Authentication required to access faculty or administrative portals.');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/hod/:path*', '/teacher/:path*', '/mentor/:path*'],
};
