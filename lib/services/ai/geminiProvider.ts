import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-flash-latest';
const DEFAULT_TIMEOUT_MS = 25000; // 25s — well under Next.js 30s serverless limit

/**
 * Robustly extract JSON from a Gemini response.
 * Handles: raw JSON, ```json...``` blocks, plain text with embedded JSON.
 */
function extractJSON(text: string): unknown {
  // 1. Try the whole string first (cleanest case)
  try { return JSON.parse(text.trim()); } catch {}

  // 2. Try stripping markdown code fences
  const fenced = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/i);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }

  // 3. Try finding the first { ... } block
  const brace = text.match(/\{[\s\S]*\}/);
  if (brace) {
    try { return JSON.parse(brace[0]); } catch {}
  }

  // 4. Failed — caller will handle null
  return null;
}

/**
 * Generate a structured JSON response from Gemini with timeout and retry.
 * Returns parsed object, or null if unavailable (caller should use fallback).
 */
export async function generateStructuredResponse(
  prompt: string,
  systemInstruction: string,
  _schemaHint?: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.trim() === '') {
    console.warn('[Gemini] GEMINI_API_KEY not set — returning null for fallback.');
    return null;
  }

  const t0 = Date.now();
  console.log('[Gemini] Request started, model:', MODEL_NAME, 'prompt length:', prompt.length);

  // Race the Gemini call against a timeout
  const geminiCall = async (): Promise<Record<string, unknown> | null> => {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction,
    });

    // Enforce concise JSON output
    const fullPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No explanations, no markdown, no code fences. Just the JSON object.`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();
    const elapsed = Date.now() - t0;
    console.log('[Gemini] Raw response received in', elapsed, 'ms, length:', text.length);

    const parsed = extractJSON(text);
    if (!parsed) {
      console.error('[Gemini] JSON parsing failed. Raw text (first 500):', text.slice(0, 500));
      return null;
    }

    console.log('[Gemini] JSON parsed successfully in', Date.now() - t0, 'ms');
    return parsed as Record<string, unknown>;
  };

  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error(`Gemini timeout after ${timeoutMs}ms`)), timeoutMs)
  );

  try {
    const result = await Promise.race([geminiCall(), timeoutPromise]);
    return result;
  } catch (error: any) {
    const elapsed = Date.now() - t0;
    console.error('[Gemini] Error after', elapsed, 'ms:', error.message);
    return null;
  }
}
