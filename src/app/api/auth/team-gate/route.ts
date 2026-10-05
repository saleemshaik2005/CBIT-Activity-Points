import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Expected SHA-256 hash of team password
// Note: Plain text is never stored in server code or sent to client
const EXPECTED_HASH =
  process.env.SPMS_TEAM_PASS_HASH ||
  'dc86ec8e09a354b5a050c03669add4805a0b26c369e4496e3a91647e1203c265';

// In-memory rate limiting for brute-force protection
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

function generateSessionToken(): string {
  const secret = process.env.SPMS_SECRET || 'cbit-spms-team-salt-2026';
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`team-session-${timestamp}`)
    .digest('hex');
  return `team_${timestamp}_${signature}`;
}

function verifySessionToken(token: string): boolean {
  if (!token || !token.startsWith('team_')) return false;
  const parts = token.split('_');
  if (parts.length !== 3) return false;
  const [_, timestamp, signature] = parts;

  // Expire after 24 hours
  const time = parseInt(timestamp, 10);
  if (isNaN(time) || Date.now() - time > 1000 * 60 * 60 * 24) return false;

  const secret = process.env.SPMS_SECRET || 'cbit-spms-team-salt-2026';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`team-session-${timestamp}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expectedSignature, 'utf8')
  );
}

// POST: Verify Team Passcode and set secure HTTP-only cookie
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();

    // Check rate limit
    const attempt = failedAttempts.get(ip);
    if (attempt && attempt.lockedUntil > now) {
      const waitSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Try again in ${waitSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Passcode is required.' },
        { status: 400 }
      );
    }

    const inputHash = crypto.createHash('sha256').update(passcode.trim()).digest('hex');

    // Constant-time hash comparison
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(inputHash, 'utf8'),
      Buffer.from(EXPECTED_HASH, 'utf8')
    );

    if (!isMatch) {
      const currentCount = (attempt ? attempt.count : 0) + 1;
      let lockedUntil = 0;
      if (currentCount >= 5) {
        lockedUntil = now + 15 * 60 * 1000; // 15-minute lockout
      }
      failedAttempts.set(ip, { count: currentCount, lockedUntil });

      return NextResponse.json(
        {
          success: false,
          error:
            currentCount >= 5
              ? 'Too many failed attempts. Locked for 15 minutes.'
              : `Invalid team passcode. ${5 - currentCount} attempts remaining.`,
        },
        { status: 401 }
      );
    }

    // Success: clear failed attempts
    failedAttempts.delete(ip);

    const token = generateSessionToken();
    const response = NextResponse.json({
      success: true,
      message: 'Team test mode successfully unlocked.',
      mode: 'test',
    });

    // Set secure, HTTP-only cookie
    response.cookies.set('cbit_spms_team_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication service error.' },
      { status: 500 }
    );
  }
}

// GET: Check if current request has an active valid team session
export async function GET(req: NextRequest) {
  const token = req.cookies.get('cbit_spms_team_session')?.value;
  const isAuth = !!token && verifySessionToken(token);

  return NextResponse.json({
    isTeamAuthenticated: isAuth,
    mode: isAuth ? 'test' : 'user',
  });
}

// DELETE: Exit team test mode
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Exited team test mode.',
    mode: 'user',
  });

  response.cookies.delete('cbit_spms_team_session');
  return response;
}
