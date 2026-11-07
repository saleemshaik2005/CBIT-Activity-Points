import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole([], { allowMustChangePassword: true });
    if (auth.response || !auth.user) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const body = await req.json();
    const { endpoint, keys, userAgent } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { success: false, error: 'Invalid push subscription payload.' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from('push_subscriptions').upsert(
      {
        user_id: auth.user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth_key: keys.auth,
        user_agent: userAgent || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    );

    if (error) {
      console.error('[Push Subscribe API] Database error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Web Push subscription registered.' });
  } catch (err: any) {
    console.error('[Push Subscribe API] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireRole([], { allowMustChangePassword: true });
    if (auth.response || !auth.user) {
      return (
        auth.response ||
        NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 })
      );
    }

    const body = await req.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ success: false, error: 'Endpoint required.' }, { status: 400 });
    }

    await supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint)
      .eq('user_id', auth.user.id);

    return NextResponse.json({ success: true, message: 'Push subscription removed.' });
  } catch (err: any) {
    console.error('[Push Unsubscribe API] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
