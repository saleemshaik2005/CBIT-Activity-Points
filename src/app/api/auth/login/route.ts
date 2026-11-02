import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// In-memory rate limiting with automated eviction
const loginAttempts = new Map<string, { count: number; lockedUntil: number; lastSeen: number }>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of loginAttempts.entries()) {
      if (now - record.lastSeen > 30 * 60 * 1000 && record.lockedUntil < now) {
        loginAttempts.delete(key);
      }
    }
  }, 15 * 60 * 1000).unref?.();
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

function checkRateLimit(key: string, maxAttempts = 10, lockoutMs = 5 * 60 * 1000): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (record && record.lockedUntil > now) {
    return { allowed: false, waitSeconds: Math.ceil((record.lockedUntil - now) / 1000) };
  }
  return { allowed: true };
}

function recordFailedAttempt(key: string, maxAttempts = 10, lockoutMs = 5 * 60 * 1000) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, lockedUntil: 0, lastSeen: now };
  record.count += 1;
  record.lastSeen = now;
  if (record.count >= maxAttempts) {
    record.lockedUntil = now + lockoutMs;
  }
  loginAttempts.set(key, record);
}

function resetAttempts(key: string) {
  loginAttempts.delete(key);
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, 10, 5 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please wait ${rateLimit.waitSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { identifier, password, mode, googleEmail, googleCredential } = body;

    // Handle Direct Google Sign-In with Google Credential JWT
    if (mode === 'google_oauth') {
      let verifiedEmail = '';

      if (!googleCredential || typeof googleCredential !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Direct email login is disabled. You must authenticate through official Google Sign-In.' },
          { status: 403 }
        );
      }

      // Verify ID token cryptographically using Google OAuth2 tokeninfo API
      try {
        const tokenRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(googleCredential.trim())}`
        );

        if (!tokenRes.ok) {
          return NextResponse.json(
            { success: false, error: 'Google authentication failed or token expired. Please try signing in again.' },
            { status: 401 }
          );
        }

        const tokenData = await tokenRes.json();
        if (
          tokenData.email &&
          (tokenData.email_verified === 'true' || tokenData.email_verified === true)
        ) {
          verifiedEmail = String(tokenData.email).toLowerCase();
        }
      } catch (jwtErr) {
        console.error('[Google Login API] Token validation error:', jwtErr);
        return NextResponse.json(
          { success: false, error: 'Failed to verify Google token with authentication provider.' },
          { status: 500 }
        );
      }

      if (!verifiedEmail || !verifiedEmail.includes('@')) {
        return NextResponse.json(
          { success: false, error: 'Unverified Google email. Sign-in rejected.' },
          { status: 403 }
        );
      }

      // Query Supabase profiles strictly for pre-authorized 67 students + 6 faculty
      const { data: foundProfile, error: pErr } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .ilike('email', verifiedEmail)
        .maybeSingle();

      // Ensure any student has a valid official roll_number
      const isUnauthorized =
        pErr ||
        !foundProfile ||
        (foundProfile.role === 'student' && (!foundProfile.roll_number || !foundProfile.roll_number.trim()));

      if (isUnauthorized) {
        return NextResponse.json(
          {
            success: false,
            error: `Access Restricted: The Google account (${verifiedEmail}) is not registered in the official CBIT AI&DS Section 2 classroom roster (67 Students & 6 Faculty).`,
          },
          { status: 403 }
        );
      }

      let mentorData: any = null;
      if (foundProfile.mentor_id) {
        const { data: mentorRecord } = await supabaseAdmin
          .from('profiles')
          .select('id, full_name, email, phone_number')
          .eq('id', foundProfile.mentor_id)
          .maybeSingle();
        mentorData = mentorRecord;
      }

      const userProfile = {
        id: foundProfile.id,
        email: foundProfile.email,
        full_name: foundProfile.full_name,
        role: foundProfile.role,
        roll_number: foundProfile.roll_number || undefined,
        department: foundProfile.department || 'Artificial Intelligence and Data Science (AI&DS)',
        section: foundProfile.section || '2',
        batch_year: foundProfile.batch_year || '2024-2028 (5th Semester)',
        is_lateral_entry: !!foundProfile.is_lateral_entry,
        mentor_id: foundProfile.mentor_id || undefined,
        mentor_name: mentorData?.full_name || undefined,
        mentor_email: mentorData?.email || undefined,
        mentor_phone: mentorData?.phone_number || undefined,
        avatar_url: foundProfile.avatar_url || undefined,
        phone_number: foundProfile.phone_number || undefined,
      };

      return NextResponse.json({
        success: true,
        user: userProfile,
      });
    }

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter both your Roll Number / Email and password.' },
        { status: 400 }
      );
    }

    const cleanId = String(identifier).trim().replace(/\s+/g, '');
    const cleanPassword = String(password).trim();
    let targetEmail = '';
    let foundProfile: any = null;

    const GENERIC_AUTH_ERROR = 'Invalid credentials. Please verify your Roll Number / Email and password.';

    // 1. Identify User by Email or Roll Number / Faculty ID
    if (cleanId.includes('@')) {
      targetEmail = cleanId.toLowerCase();
      const { data: p } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .ilike('email', targetEmail)
        .maybeSingle();

      if (!p) {
        recordFailedAttempt(clientIp);
        return NextResponse.json({ success: false, error: GENERIC_AUTH_ERROR }, { status: 401 });
      }
      foundProfile = p;
    } else {
      // 2. Look up by roll_number or faculty ID
      // 2.1 Direct exact match
      let { data: p } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('roll_number', cleanId)
        .maybeSingle();

      // 2.2 If student entered 3-digit shortcut (e.g., 071, 094, 129, 308)
      if (!p && cleanId.length === 3) {
        const fullRoll = `160124771${cleanId}`;
        const { data: pShort } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('roll_number', fullRoll)
          .maybeSingle();
        p = pShort;
      }

      // 2.3 Suffix match fallback
      if (!p && cleanId.length >= 3) {
        const { data: pSuffix } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .ilike('roll_number', `%${cleanId}`)
          .maybeSingle();
        p = pSuffix;
      }

      if (!p || !p.email) {
        recordFailedAttempt(clientIp);
        return NextResponse.json({ success: false, error: GENERIC_AUTH_ERROR }, { status: 401 });
      }

      foundProfile = p;
      targetEmail = p.email.toLowerCase();
    }

    // 3. Authenticate with Supabase Auth
    const res1 = await supabaseAdmin.auth.signInWithPassword({
      email: targetEmail,
      password: cleanPassword,
    });

    const authData = res1.data;
    const authErr = res1.error;

    if (authErr || !authData?.user) {
      recordFailedAttempt(clientIp);
      const isRateLimit = authErr?.message?.toLowerCase().includes('rate limit');
      const errorMsg = isRateLimit
        ? 'Too many login attempts. Please wait 30 seconds before trying again.'
        : GENERIC_AUTH_ERROR;

      return NextResponse.json({ success: false, error: errorMsg }, { status: 401 });
    }

    // Reset failed attempts on success
    resetAttempts(clientIp);

    // 4. Dynamically resolve assigned mentor details from database
    let mentorData: any = null;
    if (foundProfile.mentor_id) {
      const { data: mentorRecord } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, phone_number')
        .eq('id', foundProfile.mentor_id)
        .maybeSingle();
      mentorData = mentorRecord;
    }

    // Format complete authenticated user profile
    const userProfile = {
      id: foundProfile.id,
      email: foundProfile.email,
      full_name: foundProfile.full_name,
      role: foundProfile.role,
      roll_number: foundProfile.roll_number || undefined,
      department: foundProfile.department || 'Artificial Intelligence and Data Science (AI&DS)',
      section: foundProfile.section || '2',
      batch_year: foundProfile.batch_year || '2024-2028 (5th Semester)',
      is_lateral_entry: !!foundProfile.is_lateral_entry,
      mentor_id: foundProfile.mentor_id || undefined,
      mentor_name: mentorData?.full_name || undefined,
      mentor_email: mentorData?.email || undefined,
      mentor_phone: mentorData?.phone_number || undefined,
      avatar_url: foundProfile.avatar_url || undefined,
      phone_number: foundProfile.phone_number || undefined,
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at: authData.session?.expires_at,
      },
    });
  } catch (err: any) {
    console.error('[Login API] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal login error' },
      { status: 500 }
    );
  }
}
