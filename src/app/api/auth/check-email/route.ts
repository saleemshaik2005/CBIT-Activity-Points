import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// In-memory rate limiting with automated eviction
const checkEmailRateLimiter = new Map<string, { count: number; lockedUntil: number; lastSeen: number }>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of checkEmailRateLimiter.entries()) {
      if (now - record.lastSeen > 15 * 60 * 1000 && record.lockedUntil < now) {
        checkEmailRateLimiter.delete(ip);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

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
    const record = checkEmailRateLimiter.get(ip) || { count: 0, lockedUntil: 0, lastSeen: now };

    if (record.lockedUntil > now) {
      const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return NextResponse.json(
        { registered: false, error: `Too many verification requests. Please wait ${waitSeconds} seconds.` },
        { status: 429 }
      );
    }

    record.count += 1;
    record.lastSeen = now;
    if (record.count > 10) {
      record.lockedUntil = now + 5 * 60 * 1000;
      checkEmailRateLimiter.set(ip, record);
      return NextResponse.json(
        { registered: false, error: 'Too many verification attempts. Please wait 5 minutes.' },
        { status: 429 }
      );
    }
    checkEmailRateLimiter.set(ip, record);

    const body = await req.json();
    const cleanEmail = String(body.email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length > 120) {
      return NextResponse.json(
        { registered: false, error: 'Please enter a valid Google Mail address.' },
        { status: 400 }
      );
    }

    // Query pre-authorized 67 students + 6 faculty
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, role, roll_number')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (error || !profile) {
      return NextResponse.json({
        registered: false,
        error: 'Access Denied: The Google account is not registered in the official CBIT AI&DS Section 2 classroom roster.',
      });
    }

    // If student, confirm valid roll number
    if (profile.role === 'student' && (!profile.roll_number || !profile.roll_number.trim())) {
      return NextResponse.json({
        registered: false,
        error: 'This student account does not have an assigned CBIT roll number. Please contact your Class Coordinator.',
      });
    }

    // Do NOT leak full_name, role, or other PII
    return NextResponse.json({
      registered: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { registered: false, error: 'Unable to verify email with institutional roster.' },
      { status: 500 }
    );
  }
}
