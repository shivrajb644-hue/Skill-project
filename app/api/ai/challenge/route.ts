import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai/aiService';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const body = await req.json();
    const { weakestSkills, previousChallenges } = body;

    const safeSkills = Array.isArray(weakestSkills) ? weakestSkills.slice(0, 5) : [];
    const safePrev = Array.isArray(previousChallenges) ? previousChallenges.slice(0, 10) : [];

    const challenge = await aiService.generateDailyChallenge(safeSkills, safePrev);
    console.log('[API/challenge] Completed in', Date.now() - t0, 'ms');
    return NextResponse.json({ ...challenge, _debug_ms: Date.now() - t0 });
  } catch (error: any) {
    console.error('[API/challenge] Error after', Date.now() - t0, 'ms:', error.message);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
