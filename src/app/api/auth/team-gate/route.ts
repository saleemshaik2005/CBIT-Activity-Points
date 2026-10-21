import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory rate limiting for brute-force protection
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function generateSessionToken(): string | null {
  const secret = process.env.SPMS_SECRET;
  if (!secret) return null;
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`team-session-${timestamp}`)
    .digest('hex');
  return `team_${timestamp}_${signature}`;
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token || !token.startsWith('team_')) return false;
  const parts = token.split('_');
  if (parts.length !== 3) return false;
  const [_, timestamp, signature] = parts;

  // Expire after 24 hours
  const time = parseInt(timestamp, 10);
  if (isNaN(time) || Date.now() - time > 1000 * 60 * 60 * 24) return false;

  const secret = process.env.SPMS_SECRET;
  // Fail closed if server secret is not configured
  if (!secret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`team-session-${timestamp}`)
    .digest('hex');

  if (signature.length !== expectedSignature.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expectedSignature, 'utf8')
    );
  } catch {
    return false;
  }
}

// POST: Verify Team Passcode and set secure HTTP-only cookie
export async function POST(req: NextRequest) {
  try {
    const expectedHash = process.env.SPMS_TEAM_PASS_HASH;
    if (!expectedHash) {
      return NextResponse.json(
        {
          success: false,
          error: 'Team test access is disabled on this deployment. Configure SPMS_TEAM_PASS_HASH to enable.',
        },
        { status: 403 }
      );
    }

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

    // Compute SHA-256 of submitted passcode
    const submittedHash = crypto
      .createHash('sha256')
      .update(passcode.trim())
      .digest('hex');

    const isMatch =
      submittedHash.length === expectedHash.length &&
      crypto.timingSafeEqual(
        Buffer.from(submittedHash, 'utf8'),
        Buffer.from(expectedHash, 'utf8')
      );

    if (!isMatch) {
      const count = (attempt?.count || 0) + 1;
      let lockedUntil = 0;
      if (count >= 5) {
        lockedUntil = now + 15 * 60 * 1000; // 15 min lock
      } else if (count >= 3) {
        lockedUntil = now + 60 * 1000; // 1 min lock
      }
      failedAttempts.set(ip, { count, lockedUntil });

      return NextResponse.json(
        {
          success: false,
          error: count >= 5 ? 'Account locked for 15 minutes.' : 'Invalid team passcode.',
        },
        { status: 401 }
      );
    }

    // Reset failed attempts on success
    failedAttempts.delete(ip);

    const token = generateSessionToken();
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: SPMS_SECRET is missing.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Team access verified.',
    });

    response.cookies.set('cbit_spms_team_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('[Team Gate] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// GET: Check if active team session cookie is valid
export async function GET(req: NextRequest) {
  const token = req.cookies.get('cbit_spms_team_session')?.value;
  const isValid = verifySessionToken(token);

  return NextResponse.json({
    isTeamAuthenticated: isValid,
  });
}

// DELETE: Sign out of team mode
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Signed out of team mode.',
  });

  response.cookies.set('cbit_spms_team_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
