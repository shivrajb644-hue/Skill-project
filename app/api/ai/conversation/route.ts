import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai/aiService';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  try {
    const body = await req.json();
    const { scenario, history, userMessage, mode } = body;

    if (!scenario || typeof scenario !== 'string') {
      return NextResponse.json({ error: 'Missing scenario' }, { status: 400 });
    }
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'Missing userMessage' }, { status: 400 });
    }

    const safeHistory = Array.isArray(history) ? history.slice(-8) : []; // keep last 8 turns max
    const safeMessage = userMessage.slice(0, 1000);

    const result = await aiService.conductConversationTurn(scenario, safeHistory, safeMessage, mode || 'coaching');
    console.log('[API/conversation] Completed in', Date.now() - t0, 'ms');
    return NextResponse.json({ ...result, _debug_ms: Date.now() - t0 });
  } catch (error: any) {
    console.error('[API/conversation] Error after', Date.now() - t0, 'ms:', error.message);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
