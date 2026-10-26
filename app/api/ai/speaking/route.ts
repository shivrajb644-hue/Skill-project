import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai/aiService';

// Tell Next.js this route can use up to 30s (serverless function limit)
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  console.log('[API/speaking] Request received at', new Date().toISOString());

  try {
    const body = await req.json();
    const { topic, transcript } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid topic' }, { status: 400 });
    }
    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid transcript' }, { status: 400 });
    }

    // Truncate to prevent oversized prompts
    const safeTranscript = transcript.slice(0, 3000);
    const safeTopic = topic.slice(0, 300);

    const feedback = await aiService.evaluateSpeakingResponse(safeTopic, safeTranscript);
    const elapsed = Date.now() - t0;
    console.log('[API/speaking] Completed in', elapsed, 'ms, is_fallback:', !!(feedback as any).is_fallback);

    return NextResponse.json({ ...feedback, _debug_ms: elapsed });
  } catch (error: any) {
    const elapsed = Date.now() - t0;
    console.error('[API/speaking] Error after', elapsed, 'ms:', error.message);
    return NextResponse.json(
      { error: 'Internal server error', detail: error.message },
      { status: 500 }
    );
  }
}
