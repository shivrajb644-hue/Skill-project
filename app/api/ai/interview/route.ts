import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai/aiService';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const body = await req.json();
    const { question, answer, interviewType, studentProfile, englishLevel } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid question' }, { status: 400 });
    }
    if (!answer || typeof answer !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid answer' }, { status: 400 });
    }

    const safeAnswer = answer.slice(0, 3000);
    const profile = typeof studentProfile === 'string' ? studentProfile.slice(0, 300) : undefined;
    const level = typeof englishLevel === 'string' ? englishLevel.slice(0, 20) : undefined;
    const feedback = await aiService.evaluateInterviewAnswer(question, safeAnswer, interviewType || 'behavioral', profile, level);
    console.log('[API/interview] Completed in', Date.now() - t0, 'ms');
    return NextResponse.json({ ...feedback, _debug_ms: Date.now() - t0 });
  } catch (error: any) {
    console.error('[API/interview] Error after', Date.now() - t0, 'ms:', error.message);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
