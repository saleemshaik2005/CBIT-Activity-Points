import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Allowed profile fields that can be updated by the account owner
const ALLOWED_UPDATE_FIELDS = new Set([
  'phone_number',
  'skills',
  'github_url',
  'linkedin_url',
  'resume_url',
  'avatar_url',
]);

function isValidUrl(val: string): boolean {
  if (!val) return true;
  try {
    const u = new URL(val);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidPhone(val: string): boolean {
  if (!val) return true;
  // Clean phone string
  const clean = val.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{10,15}$/.test(clean);
}

// GET /api/profile - Fetch current user profile
export async function GET() {
  try {
    const auth = await requireRole([], { allowMustChangePassword: true });
    if (auth.response) return auth.response;

    const profile = auth.profile!;

    // If student, attach mentor info
    let mentorData: any = null;
    if (profile.mentor_id) {
      const { data: mentorRecord } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, phone_number')
        .eq('id', profile.mentor_id)
        .maybeSingle();
      mentorData = mentorRecord;
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        mentor_name: mentorData?.full_name,
        mentor_email: mentorData?.email,
        mentor_phone: mentorData?.phone_number,
      },
    });
  } catch (err: any) {
    console.error('[/api/profile GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load profile.' }, { status: 500 });
  }
}

// PATCH /api/profile - Secure, authenticated profile update
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireRole();
    if (auth.response || !auth.user || !auth.profile) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const body = await req.json();

    // 1. Strict Allowlist Filtering (Prevents Mass Assignment of role, email, roll_number, etc.)
    const updatePayload: Record<string, any> = {};

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_UPDATE_FIELDS.has(key)) {
        continue;
      }

      if (key === 'phone_number') {
        const phoneStr = value ? String(value).trim() : '';
        if (phoneStr && !isValidPhone(phoneStr)) {
          return NextResponse.json(
            { success: false, error: 'Invalid phone number format. Please provide a 10-digit mobile number.' },
            { status: 400 }
          );
        }
        updatePayload.phone_number = phoneStr || null;
      } else if (key === 'skills') {
        if (Array.isArray(value)) {
          updatePayload.skills = value.map((s) => String(s).trim()).filter(Boolean);
        } else if (typeof value === 'string') {
          updatePayload.skills = value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } else if (['github_url', 'linkedin_url', 'resume_url', 'avatar_url'].includes(key)) {
        const urlStr = value ? String(value).trim() : '';
        if (urlStr && !isValidUrl(urlStr)) {
          return NextResponse.json(
            { success: false, error: `Invalid URL format for ${key.replace('_', ' ')}.` },
            { status: 400 }
          );
        }
        updatePayload[key] = urlStr || null;
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid editable profile fields provided.' },
        { status: 400 }
      );
    }

    updatePayload.updated_at = new Date().toISOString();

    // 2. Perform authenticated update strictly for auth.user.id
    const { data: updatedProfile, error: updateErr } = await supabaseAdmin
      .from('profiles')
      .update(updatePayload)
      .eq('id', auth.user.id)
      .select('*')
      .single();

    if (updateErr) {
      console.error('[/api/profile PATCH] Database update error:', updateErr);
      return NextResponse.json(
        { success: false, error: 'Database error occurred while saving profile changes.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedProfile,
    });
  } catch (err: any) {
    console.error('[/api/profile PATCH] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while saving profile.' },
      { status: 500 }
    );
  }
}
