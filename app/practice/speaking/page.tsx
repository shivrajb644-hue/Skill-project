'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Mic, Square, RefreshCcw, ArrowRight, Loader2,
  CheckCircle2, SkipForward, Clock, WifiOff
} from 'lucide-react';
import { localSession } from '../../../lib/storage/localStorage';

type State = 'topic_select' | 'preparation' | 'recording' | 'processing' | 'feedback' | 'error';

// ─── Beginner-friendly topics (everyday life, no work experience needed) ───
const BEGINNER_TOPICS = [
  "Tell me about your hometown. What do you love about it?",
  "What is your favourite food and why do you like it?",
  "Describe a person in your family who you admire.",
  "What is your favourite subject and why?",
  "What do you like to do in your free time?",
  "Describe your daily routine.",
  "Tell me about a movie or show you enjoyed recently.",
  "What kind of job would you love to have in the future?",
  "Describe a teacher who inspired you.",
  "What is one thing you are proud of about yourself?",
];

// ─── Standard topics (for confident speakers with some experience) ───
const STANDARD_TOPICS = [
  "Describe a time you overcame a significant challenge.",
  "What is your greatest strength and how have you used it?",
  "Explain a complex topic you learned recently.",
  "Where do you see your career in 5 years?",
  "Describe a situation where you had to work with a difficult person.",
  "Tell me about a time you failed and what you learned.",
  "How do you handle stress?",
  "Talk about a project or achievement you are proud of.",
];

const API_TIMEOUT_MS = 30000;
const MAX_TRANSCRIPT_CHARS = 3000;

interface FeedbackData {
  overall_score: number;
  scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  evidence: string | string[];
  improved_response: string;
  is_fallback?: boolean;
}

export default function SpeakingPracticePage() {
  const [state, setState] = useState<State>('topic_select');
  const [isBeginner, setIsBeginner] = useState(true); // determined from onboarding
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [prepTime, setPrepTime] = useState(30);
  const [recTime, setRecTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [processingStatus, setProcessingStatus] = useState('Sending to AI Coach...');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const recognitionRef = useRef<any>(null);
  const prepTimerRef = useRef<any>(null);
  const recTimerRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const processingTimerRef = useRef<any>(null);

  // ─── Load onboarding profile to detect beginner ───
  useEffect(() => {
    const onboarding = localSession.getOnboarding();
    const confidence = onboarding?.speakingConfidence ?? 3;
    const isBeginnerMode = confidence <= 2 || onboarding?.englishLevel === 'beginner';
    setIsBeginner(isBeginnerMode);
    const pool = isBeginnerMode ? BEGINNER_TOPICS : STANDARD_TOPICS;
    setTopics(pool.slice(0, 4));
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(prepTimerRef.current);
      clearInterval(recTimerRef.current);
      clearInterval(processingTimerRef.current);
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch {} }
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const shuffleTopics = () => {
    const pool = isBeginner ? BEGINNER_TOPICS : STANDARD_TOPICS;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setTopics(shuffled.slice(0, 4));
  };

  const switchDifficulty = () => {
    const newIsBeginner = !isBeginner;
    setIsBeginner(newIsBeginner);
    const pool = newIsBeginner ? BEGINNER_TOPICS : STANDARD_TOPICS;
    setTopics(pool.slice(0, 4));
  };

  const startPreparation = (topic: string) => {
    setSelectedTopic(topic);
    setState('preparation');
    setFeedback(null);
    setErrorMessage('');
    setPrepTime(30);
    prepTimerRef.current = setInterval(() => {
      setPrepTime(prev => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipPreparation = () => {
    clearInterval(prepTimerRef.current);
    startRecording();
  };

  const startRecording = () => {
    setState('recording');
    setRecTime(0);
    setTranscript('');
    setIsSubmitting(false);

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current.slice(0, MAX_TRANSCRIPT_CHARS));
        };
        recognitionRef.current.onerror = (e: any) => {
          console.warn('Speech recognition error:', e.error);
        };
        recognitionRef.current.start();
      }
    } catch (e) {
      console.log('Speech recognition not available — use text input');
    }

    recTimerRef.current = setInterval(() => {
      setRecTime(prev => {
        if (prev >= 180) {
          stopRecording();
          return 180;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const startProcessingMessages = () => {
    const messages = [
      'Your AI Coach is reading your response... 📖',
      'Checking your vocabulary and grammar... 📝',
      'Listening for your confidence level... 🎤',
      'Writing personalised feedback for you... ✍️',
      'Almost ready! 🌟',
    ];
    let i = 0;
    setProcessingStatus(messages[0]);
    processingTimerRef.current = setInterval(() => {
      i = Math.min(i + 1, messages.length - 1);
      setProcessingStatus(messages[i]);
    }, 5000);
  };

  const stopRecording = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    clearInterval(recTimerRef.current);
    clearInterval(processingTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const currentTranscript = transcript.trim();
    const currentTopic = selectedTopic;
    const currentRecTime = recTime;

    setState('processing');
    startProcessingMessages();
    setAttemptCount(prev => prev + 1);

    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort();
    }, API_TIMEOUT_MS);

    const t0 = Date.now();

    try {
      const res = await fetch('/api/ai/speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic,
          transcript: currentTranscript,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(processingTimerRef.current);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Server error ${res.status}`);
      }

      const data: FeedbackData = await res.json();

      const normScores: Record<string, number> = {};
      for (const [k, v] of Object.entries(data.scores || {})) {
        normScores[k] = Math.min(100, Math.max(0, Number(v) || 0));
      }
      data.scores = normScores;

      if (Array.isArray(data.evidence)) {
        data.evidence = data.evidence.join(' ');
      }

      setFeedback(data);
      setState('feedback');
    } catch (err: any) {
      clearTimeout(timeoutId);
      clearInterval(processingTimerRef.current);

      setFeedback(buildFallbackFeedback(currentTranscript, currentTopic, currentRecTime));
      if (err.name === 'AbortError') {
        setErrorMessage('AI Coach is taking a bit long. Showing estimated feedback based on your response.');
      } else {
        setErrorMessage('Could not reach AI Coach right now. Here is estimated feedback.');
      }
      setState('feedback');
    } finally {
      setIsSubmitting(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, selectedTopic, recTime, isSubmitting]);

  function buildFallbackFeedback(text: string, topic: string, durationSec: number): FeedbackData {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const fillers = (text.match(/\b(um|uh|like|basically|actually|you know|right)\b/gi) || []).length;
    const wpm = durationSec > 0 ? Math.round((wordCount / durationSec) * 60) : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3).length;

    const fluency = Math.min(95, Math.max(30, 70 - fillers * 3 + Math.min(20, wordCount / 5)));
    const structure = Math.min(95, Math.max(30, sentences > 2 ? 65 : 45));
    const vocabulary = Math.min(95, Math.max(30, wordCount > 50 ? 72 : 55));
    const grammar = Math.min(95, Math.max(30, 68));
    const confidence = Math.min(95, Math.max(30, wpm > 80 && wpm < 160 ? 75 : 55));
    const overall = Math.round((fluency + structure + vocabulary + grammar + confidence) / 5);

    return {
      overall_score: overall,
      scores: { fluency, structure, vocabulary, grammar, confidence },
      strengths: [
        wordCount > 40 ? 'Great job — you spoke for a good length of time!' : 'You bravely attempted the topic. That takes courage!',
        fillers < 3 ? 'Very clean delivery — few filler words. Well done!' : 'You showed real effort in building your response.',
      ],
      weaknesses: [
        fillers >= 3
          ? `You used ${fillers} filler word(s) like "um" or "uh". That is totally normal! Next time, try pausing silently instead.`
          : sentences < 3
            ? 'Try to add one more point or example to make your answer richer.'
            : 'Keep working on wrapping up with a clear final sentence.',
      ],
      evidence: `You spoke about ${wordCount} words at roughly ${wpm} words per minute. Duration: ${Math.floor(durationSec / 60)}m ${durationSec % 60}s.`,
      improved_response: `Great start! Next time, try this simple structure: 1️⃣ Say your main point. 2️⃣ Give one reason or example. 3️⃣ End with how you feel or what you learned. Even a short answer with this structure sounds very confident!`,
      is_fallback: true,
    };
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent! 🌟', color: '#10b981' };
    if (score >= 65) return { label: 'Good effort! 👍', color: '#3b82f6' };
    if (score >= 50) return { label: 'Keep going! 💪', color: '#f59e0b' };
    return { label: 'You tried — that\'s the first step! 🌱', color: '#8b5cf6' };
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white">🎤 Speaking Practice</h1>
          <p className="text-slate-400">
            {isBeginner
              ? 'Start with everyday topics. Speak at your own pace. There are no wrong answers here! 😊'
              : 'Practice your speaking with AI coaching. Every attempt makes you stronger.'}
          </p>
        </div>

        {/* ── TOPIC SELECT ── */}
        {state === 'topic_select' && (
          <div className="glass-panel rounded-3xl p-8 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-xl font-bold text-white">Choose a Topic to Speak About</h2>
                <p className="text-slate-500 text-sm mt-1">
                  {isBeginner ? '🟢 Easy topics — everyday life, no work experience needed' : '🟡 Standard topics — professional practice'}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Button variant="outline" size="sm" onClick={shuffleTopics}>
                  <RefreshCcw className="w-4 h-4 mr-2" /> New Topics
                </Button>
                <button
                  onClick={switchDifficulty}
                  className="text-xs text-brand-400 hover:text-brand-300 underline"
                >
                  {isBeginner ? 'Switch to harder topics →' : '← Switch to easier topics'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {topics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => startPreparation(t)}
                  className="text-left p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-violet-500 hover:bg-violet-500/10 transition-all group"
                >
                  <Badge variant="slate" className="mb-3">Topic {i + 1}</Badge>
                  <p className="text-white font-medium text-base group-hover:text-violet-300 transition-colors">{t}</p>
                </button>
              ))}
            </div>

            {isBeginner && (
              <div className="mt-6 p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-sm text-green-300">
                💡 <strong>Tip:</strong> You can speak in simple sentences. Even 30 seconds of speaking is great practice! Don't worry about being perfect.
              </div>
            )}
          </div>
        )}

        {/* ── PREPARATION ── */}
        {state === 'preparation' && (
          <div className="glass-panel rounded-3xl p-10 border border-slate-800 text-center flex flex-col items-center">
            <Badge variant="purple" className="mb-6">Think Time ⏳</Badge>
            <h2 className="text-2xl font-bold text-white mb-10 max-w-2xl">{selectedTopic}</h2>

            <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="60" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle cx="64" cy="64" r="60" fill="none" stroke="#8b5cf6" strokeWidth="8"
                  strokeDasharray="377"
                  strokeDashoffset={377 - (prepTime / 30) * 377}
                  className="transition-all duration-1000 linear" />
              </svg>
              <span className="text-4xl font-black text-white">{prepTime}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg mb-8">
              <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Quick Tip
              </h4>
              {isBeginner ? (
                <p className="text-slate-300 text-sm">
                  Think of <strong className="text-white">one or two things</strong> to say about this topic. It's okay to speak slowly. Take a breath and begin when you're ready! 😊
                </p>
              ) : (
                <p className="text-slate-300 text-sm">
                  Use a simple structure: <strong className="text-white">Main Point → Reason → Example → Summary</strong>. Aim for 60–90 seconds.
                </p>
              )}
            </div>

            <Button variant="outline" onClick={skipPreparation}>
              I'm Ready — Start Now <SkipForward className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* ── RECORDING ── */}
        {state === 'recording' && (
          <div className="glass-panel rounded-3xl p-10 border border-violet-500/50 text-center">
            <Badge variant="purple" className="mb-6 animate-pulse">● Recording — Speak Now!</Badge>
            <h2 className="text-xl font-bold text-white mb-6">{selectedTopic}</h2>

            <div className="flex justify-center items-center gap-1.5 mb-8 h-16">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-violet-500 rounded-full"
                  style={{
                    height: `${20 + Math.abs(Math.sin(i * 0.8)) * 50}%`,
                    opacity: 0.5 + Math.abs(Math.sin(i * 0.5)) * 0.5,
                    animation: `pulse ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>

            <div className="text-3xl font-black text-white mb-2">
              {Math.floor(recTime / 60)}:{(recTime % 60).toString().padStart(2, '0')}
              <span className="text-slate-500 text-lg font-normal"> / 3:00</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              {isBeginner ? 'Even 30 seconds is great! Speak at your own pace. 😊' : 'Aim for 60–90 seconds for best feedback.'}
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 text-left w-full max-w-2xl mx-auto">
              <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">
                {recognitionRef.current ? '🎙 Live Transcript (auto-detected)' : '✏️ No microphone? Type your response below'}
              </p>
              <textarea
                className="w-full bg-transparent border-none outline-none text-slate-300 resize-none placeholder:text-slate-600 min-h-[80px]"
                placeholder={recognitionRef.current
                  ? "Speak aloud — your words will appear here..."
                  : "No microphone? No problem! Type what you would say. Your answer still gets AI feedback. 💪"}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value.slice(0, MAX_TRANSCRIPT_CHARS))}
              />
              <p className="text-xs text-slate-600 mt-1 text-right">{transcript.length}/{MAX_TRANSCRIPT_CHARS}</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={stopRecording}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 border-red-500 text-white disabled:opacity-50"
            >
              <Square className="w-5 h-5 mr-2 fill-current" /> Submit for Feedback
            </Button>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {state === 'processing' && (
          <div className="glass-panel rounded-3xl p-20 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">Your AI Coach is reviewing your response...</h3>
            <p className="text-slate-400 text-sm mb-6">{processingStatus}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Usually takes 3–8 seconds.</span>
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {state === 'feedback' && feedback && (
          <div className="space-y-6">
            {/* Connection notice (only if fallback) */}
            {(errorMessage || feedback.is_fallback) && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                <WifiOff className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Using estimated feedback</p>
                  <p className="opacity-80 mt-0.5">
                    {errorMessage || 'AI Coach unavailable — showing estimated analysis. Add a valid Gemini API key for full AI feedback.'}
                  </p>
                </div>
              </div>
            )}

            {/* Encouraging header */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 text-center">
              <div className="text-4xl mb-2">
                {feedback.overall_score >= 70 ? '🌟' : feedback.overall_score >= 50 ? '💪' : '🌱'}
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {getScoreLabel(feedback.overall_score).label}
              </h2>
              <p className="text-slate-400 text-sm">
                {attemptCount === 1
                  ? 'You completed your first attempt — that takes real courage!'
                  : `Attempt ${attemptCount} done! Every practice makes you better.`}
              </p>
            </div>

            {/* Score card */}
            <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-44 h-44 shrink-0 relative flex items-center justify-center rounded-full bg-slate-900 border-8 border-slate-800">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="88" cy="88" r="80" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle
                    cx="88" cy="88" r="80" fill="none"
                    stroke={getScoreLabel(feedback.overall_score).color}
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={(1 - feedback.overall_score / 100) * 2 * Math.PI * 80}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="text-center">
                  <div className="text-5xl font-black text-white">{feedback.overall_score}</div>
                  <div className="text-xs text-slate-400 font-bold uppercase mt-1">Score</div>
                </div>
              </div>

              <div className="flex-1 w-full space-y-3">
                {Object.entries(feedback.scores).map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-xs font-bold text-slate-300 uppercase mb-1">
                      <span>{k}</span>
                      <span>{Math.round(Number(v))}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.round(Number(v))}%`,
                          backgroundColor: Number(v) >= 70 ? '#10b981' : Number(v) >= 50 ? '#3b82f6' : '#8b5cf6',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-emerald-500/5">
              <h3 className="flex items-center text-emerald-400 font-bold mb-4">
                <CheckCircle2 className="w-5 h-5 mr-2" /> What you did well ✨
              </h3>
              <ul className="space-y-3">
                {(Array.isArray(feedback.strengths) ? feedback.strengths : []).map((s, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-3 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth areas — softened language */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-purple-500/5">
              <h3 className="flex items-center text-purple-400 font-bold mb-1">
                🌱 Let's work on these together
              </h3>
              <p className="text-slate-500 text-xs mb-4">Good attempt! Here's how to make it even better next time:</p>
              <ul className="space-y-3">
                {(Array.isArray(feedback.weaknesses) ? feedback.weaknesses : []).map((s, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-3 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Evidence + Improvement Tip */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h3 className="font-bold text-white mb-2">Insights</h3>
              <p className="text-slate-400 text-sm mb-6">
                {typeof feedback.evidence === 'string' ? feedback.evidence : (feedback.evidence as string[]).join(' ')}
              </p>

              <h4 className="font-bold text-blue-400 mb-2">💡 Improvement Tip</h4>
              <div className="bg-slate-900 rounded-xl p-4 text-slate-300 text-sm leading-relaxed border border-slate-800">
                {feedback.improved_response}
              </div>
            </div>

            {/* Actions — Try Again is primary */}
            <div className="flex justify-center gap-4 pt-4 flex-wrap">
              <Button variant="primary" onClick={() => startPreparation(selectedTopic)}>
                🔄 Try Again — You'll do even better!
              </Button>
              <Button variant="outline" onClick={() => setState('topic_select')}>
                Choose New Topic <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
