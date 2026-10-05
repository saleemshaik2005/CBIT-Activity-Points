import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected administrative and faculty routes
  const isFacultyOrAdminRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/hod') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/mentor');

  if (isFacultyOrAdminRoute) {
    // 1. Check for verified team test session cookie
    const teamCookie = request.cookies.get('cbit_spms_team_session')?.value;
    if (teamCookie && teamCookie.startsWith('team_')) {
      return NextResponse.next();
    }

    // 2. Check for active Supabase authentication cookies
    const allCookies = request.cookies.getAll();
    const hasSupabaseCookie = allCookies.some(
      (c) => c.name.includes('sb-') || c.name.includes('auth-token')
    );

    // If accessing administrative routes directly without any session cookie, redirect to login
    if (!teamCookie && !hasSupabaseCookie) {
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
