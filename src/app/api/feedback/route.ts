import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      rating,
      category,
      message,
      user_name,
      user_email,
      user_roll,
      user_role,
      page_url,
    } = body;

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Please enter a detailed feedback message (at least 3 characters).' },
        { status: 400 }
      );
    }

    const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const record = {
      id: feedbackId,
      rating: Number(rating) || 5,
      category: category || 'suggestion',
      message: message.trim(),
      user_name: user_name || 'Anonymous Student',
      user_email: user_email || 'Not provided',
      user_roll: user_roll || '',
      user_role: user_role || 'student',
      page_url: page_url || '',
      created_at: nowIso,
    };

    // Store in Supabase 'feedbacks' storage bucket as JSON
    const fileContent = Buffer.from(JSON.stringify(record, null, 2), 'utf-8');
    const { error: uploadError } = await supabaseAdmin.storage
      .from('feedbacks')
      .upload(`${feedbackId}.json`, fileContent, {
        contentType: 'application/json',
        upsert: true,
      });

    if (uploadError) {
      console.error('[Feedback API] Storage error:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Failed to record feedback. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your feedback has been received and shared with the development team.',
      feedback: record,
    });
  } catch (err: any) {
    console.error('[Feedback API POST] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // List all feedback files from 'feedbacks' bucket
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('feedbacks')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (listError) {
      console.error('[Feedback API GET] List error:', listError);
      return NextResponse.json({ success: true, feedbacks: [] });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ success: true, feedbacks: [] });
    }

    // Fetch and parse each JSON feedback file
    const feedbackPromises = files
      .filter((f) => f.name.endsWith('.json'))
      .map(async (f) => {
        try {
          const { data, error: downloadError } = await supabaseAdmin.storage
            .from('feedbacks')
            .download(f.name);

          if (downloadError || !data) return null;
          const text = await data.text();
          return JSON.parse(text);
        } catch {
          return null;
        }
      });

    const results = await Promise.all(feedbackPromises);
    const validFeedbacks = results
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      success: true,
      feedbacks: validFeedbacks,
    });
  } catch (err: any) {
    console.error('[Feedback API GET] Unexpected error:', err);
    return NextResponse.json(
      { success: false, feedbacks: [], error: err.message || 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
