import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, mode, googleEmail, googleCredential } = body;

    // Handle Direct Google Sign-In & Strict Roster Whitelist Verification (Never redirects to localhost)
    if (mode === 'google_oauth') {
      let verifiedEmail = (googleEmail || '').trim().toLowerCase();

      // If a Google JWT credential token was returned by Google Identity Services, decode its email payload
      if (googleCredential && typeof googleCredential === 'string') {
        try {
          const parts = googleCredential.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            if (payload.email) {
              verifiedEmail = String(payload.email).toLowerCase();
            }
          }
        } catch (jwtErr) {
          console.warn('[Google Login API] JWT decode warning:', jwtErr);
        }
      }

      if (!verifiedEmail || !verifiedEmail.includes('@')) {
        return NextResponse.json(
          { success: false, error: 'Please enter or select your college-registered Google Mail address.' },
          { status: 400 }
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

    // 1. Identify User by Email or Roll Number / Faculty ID
    if (cleanId.includes('@')) {
      targetEmail = cleanId.toLowerCase();
      const { data: p, error: pErr } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .ilike('email', targetEmail)
        .maybeSingle();

      if (pErr || !p) {
        return NextResponse.json(
          { success: false, error: `No registered account found with email: ${cleanId}. Please check your email or contact the administrator.` },
          { status: 404 }
        );
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
        return NextResponse.json(
          {
            success: false,
            error: `No registered student or faculty found with Roll Number or ID: "${cleanId}". Please enter your full 12-digit roll number (e.g., 160124771129) or 3-digit shortcut (e.g., 129).`,
          },
          { status: 404 }
        );
      }

      foundProfile = p;
      targetEmail = p.email.toLowerCase();
    }

    // 3. Authenticate with Supabase Auth
    let authData: any = null;
    let authErr: any = null;

    // 3.1 Try user-entered password
    const res1 = await supabaseAdmin.auth.signInWithPassword({
      email: targetEmail,
      password: cleanPassword,
    });

    if (res1.data?.user) {
      authData = res1.data;
    } else {
      authErr = res1.error;

      // 3.2 If student formula was entered with different case (e.g. cbit@129, CBIT@129)
      if (foundProfile.roll_number) {
        const rollLast3 = foundProfile.roll_number.slice(-3);
        const canonicalDefault = `Cbit@${rollLast3}`;

        if (
          cleanPassword.toLowerCase() === canonicalDefault.toLowerCase() ||
          cleanPassword.toLowerCase() === `cbit@${rollLast3}`.toLowerCase()
        ) {
          const res2 = await supabaseAdmin.auth.signInWithPassword({
            email: targetEmail,
            password: canonicalDefault,
          });
          if (res2.data?.user) {
            authData = res2.data;
            authErr = null;
          }
        }
      }
    }

    if (authErr || !authData?.user) {
      const isRateLimit = authErr?.message?.toLowerCase().includes('rate limit');
      const errorMsg = isRateLimit
        ? 'Too many login attempts. Please wait 30 seconds before trying again, or use "Sign in with Google Mail".'
        : `Incorrect password for ${foundProfile.full_name}. Default formula for students is Cbit@<last3digits> (e.g., Cbit@${foundProfile.roll_number ? foundProfile.roll_number.slice(-3) : '129'}).`;

      return NextResponse.json({ success: false, error: errorMsg }, { status: 401 });
    }

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
