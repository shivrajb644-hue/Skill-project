import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai/aiService';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const body = await req.json();
    const { answers, category } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing or invalid answers array' }, { status: 400 });
    }
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Missing category' }, { status: 400 });
    }

    // Limit to 20 answers max
    const safeAnswers = answers.slice(0, 20).map((a: any) => ({
      question: String(a?.question || '').slice(0, 200),
      answer: String(a?.answer || '').slice(0, 500),
      category: String(a?.category || category),
    }));

    const score = await aiService.analyzeAssessmentAnswers(safeAnswers, category);
    console.log('[API/assess] Completed in', Date.now() - t0, 'ms');
    return NextResponse.json({ ...score, _debug_ms: Date.now() - t0 });
  } catch (error: any) {
    console.error('[API/assess] Error after', Date.now() - t0, 'ms:', error.message);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
