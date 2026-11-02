import { NextRequest, NextResponse } from 'next/server';
import { submissionEventBroker, SubmissionStatusEvent } from '@/lib/events/event-broker';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAuthenticatedUser } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await getAuthenticatedUser();
    if (!user) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    const params = await props.params;
    const submissionId = params.id;

    if (!submissionId) {
      return new NextResponse('Missing submission ID', { status: 400 });
    }

    // Set up Server-Sent Events stream
    const encoder = new TextEncoder();
    let cleanupListener: (() => void) | null = null;

    const stream = new ReadableStream({
      async start(controller) {
        // 1. Initial State Delivery from Database
        try {
          const { data: job } = await supabaseAdmin
            .from('certificate_processing_jobs')
            .select('*')
            .eq('submission_id', submissionId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const initialStatus = job?.status || 'QUEUED';
          const initialPayload: SubmissionStatusEvent = {
            status: initialStatus,
            submissionId,
            jobId: job?.id,
            message: job?.error_message || `Initial status: ${initialStatus}`,
            aiData: job?.extraction_result,
            timestamp: new Date().toISOString(),
          };

          controller.enqueue(encoder.encode(`event: status\ndata: ${JSON.stringify(initialPayload)}\n\n`));
        } catch (fetchErr) {
          console.warn('[SSE] Could not fetch initial job status:', fetchErr);
        }

        // 2. Real-time Event Listener Binding
        const eventHandler = (event: SubmissionStatusEvent) => {
          try {
            const dataStr = `event: status\ndata: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(dataStr));

            // If terminal state reached, close stream gracefully
            if (['PARSED', 'MANUAL_REVIEW_REQUIRED', 'FAILED_FATAL'].includes(event.status)) {
              setTimeout(() => {
                try {
                  controller.close();
                } catch {}
              }, 1500);
            }
          } catch (err) {
            console.warn('[SSE Stream] Error enqueuing event:', err);
          }
        };

        const eventKey = `submission:${submissionId}`;
        submissionEventBroker.on(eventKey, eventHandler);

        cleanupListener = () => {
          submissionEventBroker.off(eventKey, eventHandler);
        };

        // 3. Keep-alive heartbeat every 20 seconds
        const heartbeat = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: ping\n\n`));
          } catch {
            clearInterval(heartbeat);
          }
        }, 20000);

        req.signal.addEventListener('abort', () => {
          clearInterval(heartbeat);
          if (cleanupListener) cleanupListener();
          try {
            controller.close();
          } catch {}
        });
      },
      cancel() {
        if (cleanupListener) cleanupListener();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable proxy buffering (Nginx / Cloudflare)
      },
    });
  } catch (err: any) {
    console.error('[SSE Endpoint] Unexpected stream error:', err);
    return new NextResponse('Internal Stream Error', { status: 500 });
  }
}
