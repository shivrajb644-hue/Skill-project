'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { localSession } from '../../lib/storage/localStorage';
import { PersonalDevelopmentScore, SKILL_DIMENSION_ICONS } from '../../lib/types/extensions';
import { getStudentContext, StudentContext } from '../../lib/student/studentContext';
import { CheckCircle, ChevronRight, ChevronLeft, Play, ArrowRight, Brain, Volume2 } from 'lucide-react';

// ───────────────────────────────────────────────
// ASSESSMENT QUESTION BANK
// Short, simple-English questions taken from daily student life.
// Words like "school / college / office" and "teacher / manager"
// change automatically based on the student's background.
// ───────────────────────────────────────────────
interface AssessmentQuestion {
  id: string;
  category: 'communication' | 'speaking' | 'english' | 'listening' | 'personality' | 'career';
  type: 'mcq' | 'scenario' | 'text' | 'rating';
  question: string;
  /** Extra simple explanation shown under the question */
  hint?: string;
  options?: string[];
  correctAnswer?: number; // index for mcq
  /** Sentence starters a student can tap to begin writing */
  starters?: string[];
}

/** Emoji scale used for every "How do you feel" question (index 0 = low, 4 = high) */
const FEELING_SCALE = ['😟 Not at all', '🙁 A little', '😐 Sometimes', '🙂 Mostly', '😄 Yes, easily'];

function buildQuestions(ctx: StudentContext): AssessmentQuestion[] {
  const { place, guide, group } = ctx;
  const isWorking = ctx.lifeStage === 'working';

  const introStarters = [
    ctx.firstName ? `My name is ${ctx.firstName}.` : 'My name is ...',
    isWorking
      ? `I work as ${ctx.stream ? `a ${ctx.stream}` : '...'}.`
      : ctx.stream
        ? `I study ${ctx.stream}.`
        : `I study in ${ctx.place === 'school' ? 'class ...' : '...'}.`,
    'I like ...',
    'In the future, I want to ...',
  ];

  const careerGoalQuestion = isWorking
    ? 'Do you know your next career goal?'
    : ctx.lifeStage === 'school'
      ? 'Do you know what you want to study after school?'
      : 'Do you know what job you want after your studies?';

  return [
    // ── COMMUNICATION ──
    {
      id: 'c1', category: 'communication', type: 'mcq',
      question: `Your friend does not understand a topic. What do you do?`,
      hint: 'Pick the best way to help.',
      options: [
        'I explain slowly, step by step',
        'I tell them to read the book',
        'I use big, difficult words',
        'I say nothing',
      ],
      correctAnswer: 0,
    },
    {
      id: 'c2', category: 'communication', type: 'mcq',
      question: `You want your ${guide} to explain something again. What do you say?`,
      hint: 'Pick the most polite sentence.',
      options: [
        'Again!',
        `${guide === 'teacher' ? 'Sir / Ma\'am' : 'Excuse me'}, can you please explain it again?`,
        'I did not get it. Repeat.',
        'I stay quiet and do not ask',
      ],
      correctAnswer: 1,
    },

    // ── SPEAKING ──
    {
      id: 's1', category: 'speaking', type: 'rating',
      question: `Do you feel okay speaking in front of your ${group}?`,
      hint: 'There is no wrong answer. Just be honest.',
      options: FEELING_SCALE,
    },
    {
      id: 's2', category: 'speaking', type: 'text',
      question: 'Tell us about yourself in 2 or 3 short sentences.',
      hint: 'Tap a starter below to begin. Simple sentences are perfect. You can also skip.',
      starters: introStarters,
    },

    // ── ENGLISH ──
    {
      id: 'e1', category: 'english', type: 'mcq',
      question: 'Which sentence is correct?',
      options: [
        'She don\'t like tea.',
        'She doesn\'t like tea.',
        'She not like tea.',
        'She no likes tea.',
      ],
      correctAnswer: 1,
    },
    {
      id: 'e2', category: 'english', type: 'mcq',
      question: `Fill in the blank: "I ___ to ${place} every day."`,
      options: ['go', 'goes', 'going', 'gone'],
      correctAnswer: 0,
    },

    // ── LISTENING ──
    {
      id: 'l1', category: 'listening', type: 'mcq',
      question: 'Someone is talking to you. What do you do?',
      hint: 'Pick what a good listener does.',
      options: [
        'I look at my phone',
        'I stop them and talk about me',
        'I listen and ask a question if I do not understand',
        'I think about other things',
      ],
      correctAnswer: 2,
    },
    {
      id: 'l2', category: 'listening', type: 'rating',
      question: 'When people speak English, can you understand them?',
      options: FEELING_SCALE,
    },

    // ── PERSONALITY ──
    {
      id: 'p1', category: 'personality', type: 'mcq',
      question: isWorking
        ? 'A team member is not doing their work. What do you do?'
        : 'In a group project, one friend is not doing their part. What do you do?',
      options: [
        'I get angry at them',
        'I complain to everyone',
        'I talk to them kindly and ask how I can help',
        'I do all the work myself and stay quiet',
      ],
      correctAnswer: 2,
    },
    {
      id: 'p2', category: 'personality', type: 'rating',
      question: 'When you make a mistake, can you stay calm and try again?',
      options: FEELING_SCALE,
    },

    // ── CAREER ──
    {
      id: 'cr1', category: 'career', type: 'mcq',
      question: 'In an interview, they say: "Tell me about yourself." What is a good answer?',
      options: [
        'My full life story from childhood',
        ctx.lifeStage === 'school'
          ? 'My name, my school, what I am good at, and my dream'
          : 'My name, my studies, my skills, and my goal',
        '"I don\'t know."',
        'Only my favourite movies and games',
      ],
      correctAnswer: 1,
    },
    {
      id: 'cr2', category: 'career', type: 'rating',
      question: careerGoalQuestion,
      options: FEELING_SCALE,
    },
  ];
}

const CATEGORIES = [
  { key: 'communication', label: 'Talking with People', icon: '💬', color: '#3b82f6' },
  { key: 'speaking', label: 'Speaking', icon: '🎙️', color: '#8b5cf6' },
  { key: 'english', label: 'English', icon: '📚', color: '#06b6d4' },
  { key: 'listening', label: 'Listening', icon: '👂', color: '#10b981' },
  { key: 'personality', label: 'Feelings & Teamwork', icon: '🧠', color: '#f59e0b' },
  { key: 'career', label: 'Future & Jobs', icon: '🚀', color: '#ec4899' },
];

type Phase = 'intro' | 'assessment' | 'processing' | 'results';

// ───────────────────────────────────────────────
// SCORE CALCULATION
// ───────────────────────────────────────────────
function computeScoresFromAnswers(
  questions: AssessmentQuestion[],
  answers: Record<string, string | number>
): PersonalDevelopmentScore {
  const studentId = localSession.getActiveStudentId();

  function scoreCategory(category: AssessmentQuestion['category']): number {
    let total = 0;
    let count = 0;
    for (const q of questions.filter(x => x.category === category)) {
      const ans = answers[q.id];
      if (ans === undefined || ans === '') continue; // skipped questions do not lower the score
      count++;
      if (q.type === 'mcq' && q.correctAnswer !== undefined) {
        total += Number(ans) === q.correctAnswer ? 90 : 45;
      } else if (q.type === 'rating') {
        total += ((Number(ans) + 1) / 5) * 100;
      } else if (q.type === 'scenario' || q.type === 'text') {
        const wordCount = String(ans).trim().split(/\s+/).filter(Boolean).length;
        // Short, simple answers are welcome — even 10 words is a good effort
        total += Math.min(90, 45 + wordCount * 2.5);
      }
    }
    return count === 0 ? 50 : Math.round(total / count);
  }

  const communication = scoreCategory('communication');
  const speaking = scoreCategory('speaking');
  const english = scoreCategory('english');
  const listening = scoreCategory('listening');
  const personality = scoreCategory('personality');
  const confidence = Math.round((speaking + personality * 0.5) / 1.5);
  const presentation = Math.round(speaking * 0.8 + communication * 0.2);
  const leadership = Math.round(personality * 0.7 + communication * 0.3);
  const emotional_intelligence = Math.round(personality * 0.75 + listening * 0.25);
  const career_readiness = scoreCategory('career');
  const overall_index = Math.round(
    (communication + speaking + english + confidence + listening + presentation + leadership + emotional_intelligence + career_readiness) / 9
  );

  const scores = { communication, speaking, english, confidence, listening, presentation, leadership, emotional_intelligence, career_readiness };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const pretty = (k: string) => k.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const strengths = sorted.slice(0, 3).map(([k]) => pretty(k));
  const development_areas = sorted.slice(-4).reverse().map(([k]) => pretty(k));
  const priority_areas = sorted.slice(-3).reverse().map(([k]) => pretty(k));

  return {
    student_id: studentId,
    communication, speaking, english, confidence, listening, presentation,
    leadership, emotional_intelligence, career_readiness, overall_index,
    strengths, development_areas, priority_areas,
    assessed_at: new Date().toISOString(),
  };
}

/** Reads text aloud using the browser voice (helps students who read English slowly). */
function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

// ───────────────────────────────────────────────
// MAIN ASSESSMENT PAGE
// ───────────────────────────────────────────────
export default function AssessmentPage() {
  const router = useRouter();
  const [ctx, setCtx] = useState<StudentContext | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [devScore, setDevScore] = useState<PersonalDevelopmentScore | null>(null);
  const [processingDots, setProcessingDots] = useState(0);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setCtx(getStudentContext()); }, []);

  const questions = useMemo(() => (ctx ? buildQuestions(ctx) : []), [ctx]);
  // Keep questions grouped in category order
  const orderedQuestions = useMemo(
    () => CATEGORIES.flatMap(c => questions.filter(q => q.category === c.key)),
    [questions]
  );
  const totalQuestions = orderedQuestions.length;
  const currentQuestion = orderedQuestions[qIdx];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? '' : '';
  const currentCategoryIdx = currentQuestion ? CATEGORIES.findIndex(c => c.key === currentQuestion.category) : 0;
  const overallProgress = totalQuestions ? Math.round((qIdx / totalQuestions) * 100) : 0;

  // Processing animation
  useEffect(() => {
    if (phase !== 'processing') return;
    const interval = setInterval(() => setProcessingDots(d => d + 1), 450);
    const timeout = setTimeout(() => {
      const score = computeScoresFromAnswers(orderedQuestions, answers);
      setDevScore(score);
      localSession.setDevScore(score as unknown as Record<string, unknown>);
      setPhase('results');
      clearInterval(interval);
    }, 2400);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase, answers, orderedQuestions]);

  const setAnswer = (value: string | number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const goNext = () => {
    if (qIdx < totalQuestions - 1) setQIdx(qIdx + 1);
    else setPhase('processing');
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
    goNext();
  };

  const addStarter = (starter: string) => {
    const existing = String(currentAnswer || '').trim();
    setAnswer(existing ? `${existing} ${starter}` : starter);
    setTimeout(() => textRef.current?.focus(), 0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 55) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#a855f7';
  };

  const getLevelLabel = (score: number) => {
    if (score >= 80) return 'Strong 💪';
    if (score >= 65) return 'Good 👍';
    if (score >= 50) return 'Growing 🌿';
    return 'Starting 🌱';
  };

  if (!ctx) return <div className="min-h-screen bg-slate-950" />;

  // ─── INTRO PHASE ───
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-xl w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-2">😊</div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Hi{ctx.firstName ? ` ${ctx.firstName}` : ''}! Let&apos;s get to know you.
            </h1>
            <p className="text-slate-300 text-lg max-w-md mx-auto leading-relaxed">
              This is <strong className="text-white">not an exam</strong>. Just answer a few easy questions.
              It helps us make lessons that are right for you.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '⏱️', title: '3 minutes', desc: 'No timer' },
              { emoji: '👆', title: 'Mostly tapping', desc: 'Very little typing' },
              { emoji: '🔒', title: 'Private', desc: 'Only you can see' },
            ].map(card => (
              <div key={card.title} className="glass-panel rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-3xl mb-1">{card.emoji}</div>
                <div className="font-bold text-white text-sm">{card.title}</div>
                <div className="text-xs text-slate-400">{card.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-300 text-sm space-y-1">
            <p>💡 Not sure? Pick the closest answer.</p>
            <p>⏭️ You can <strong>skip</strong> any question.</p>
            <p>🔊 Tap the speaker to <strong>hear</strong> the question.</p>
          </div>

          <button
            onClick={() => setPhase('assessment')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-glow"
          >
            <Play className="w-5 h-5" />
            Start
          </button>
          <p className="text-center text-xs text-slate-500">{totalQuestions} short questions</p>
        </div>
      </div>
    );
  }

  // ─── ASSESSMENT PHASE ───
  if (phase === 'assessment' && currentQuestion) {
    const catInfo = CATEGORIES[currentCategoryIdx];
    const isWriting = currentQuestion.type === 'text' || currentQuestion.type === 'scenario';
    const hasAnswer = currentAnswer !== '' && currentAnswer !== undefined;
    const isLast = qIdx === totalQuestions - 1;
    const wordCount = String(currentAnswer || '').split(/\s+/).filter(Boolean).length;

    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col">
        {/* Progress header */}
        <div className="max-w-xl mx-auto w-full space-y-3 mb-8">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span className="font-semibold">{catInfo.icon} {catInfo.label}</span>
            <span>{qIdx + 1} / {totalQuestions}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%`, background: `linear-gradient(90deg, #6366f1, ${catInfo.color})` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center space-y-5">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 space-y-5">
            <div className="flex items-start gap-3">
              <h2 className="flex-1 text-xl md:text-2xl font-bold text-white leading-snug">{currentQuestion.question}</h2>
              <button
                onClick={() => speak(currentQuestion.question)}
                title="Listen"
                aria-label="Read question aloud"
                className="shrink-0 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Volume2 className="w-5 h-5 text-slate-300" />
              </button>
            </div>
            {currentQuestion.hint && <p className="text-sm text-slate-400 -mt-2">{currentQuestion.hint}</p>}

            {/* MCQ + Rating */}
            {(currentQuestion.type === 'mcq' || currentQuestion.type === 'rating') && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-base ${
                      currentAnswer === idx
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-900'
                    }`}
                  >
                    {currentQuestion.type === 'mcq' && (
                      <span className="font-bold text-sm mr-2" style={{ color: catInfo.color }}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                    )}
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Writing */}
            {isWriting && (
              <div className="space-y-3">
                {currentQuestion.starters && (
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.starters.map(s => (
                      <button
                        key={s}
                        onClick={() => addStarter(s)}
                        className="px-3 py-1.5 rounded-full text-sm bg-slate-800 border border-slate-700 text-slate-200 hover:border-violet-500 transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  ref={textRef}
                  value={String(currentAnswer)}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Write here... Small sentences are okay. Mistakes are okay."
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-base text-white placeholder-slate-500 resize-none focus:outline-none focus:border-violet-500 transition-colors"
                />
                <p className="text-xs text-slate-500">
                  {wordCount === 0 ? 'Even 1 or 2 sentences is great 🙂' : wordCount < 10 ? `${wordCount} words — nice start! 👍` : `${wordCount} words — well done! 🌟`}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQIdx(Math.max(0, qIdx - 1))}
              disabled={qIdx === 0}
              className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-0 text-slate-300 font-semibold flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-4 rounded-2xl text-slate-400 hover:text-slate-200 font-semibold transition-colors"
            >
              Skip
            </button>
            <button
              onClick={goNext}
              disabled={!hasAnswer}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isLast ? 'Finish' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── PROCESSING PHASE ───
  if (phase === 'processing') {
    const steps = [
      'Reading your answers',
      'Finding your strengths',
      'Making your learning plan',
    ];
    const done = Math.min(steps.length, Math.floor(processingDots / 1.5));
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 mx-auto relative">
            <div className="w-20 h-20 rounded-full border-4 border-violet-600/30 border-t-violet-500 animate-spin" />
            <div className="absolute inset-3 rounded-full bg-violet-600/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Great job! 🎉</h2>
            <p className="text-slate-400">Please wait a moment...</p>
          </div>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 text-base text-left">
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                  done > idx ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700'
                }`}>
                  {done > idx && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                </div>
                <span className={done > idx ? 'text-emerald-400' : 'text-slate-500'}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS PHASE ───
  if (phase === 'results' && devScore) {
    const dimensionEntries = [
      { key: 'communication', label: 'Talking', score: devScore.communication },
      { key: 'speaking', label: 'Speaking', score: devScore.speaking },
      { key: 'english', label: 'English', score: devScore.english },
      { key: 'confidence', label: 'Confidence', score: devScore.confidence },
      { key: 'listening', label: 'Listening', score: devScore.listening },
      { key: 'presentation', label: 'Presenting', score: devScore.presentation },
      { key: 'leadership', label: 'Leading', score: devScore.leadership },
      { key: 'emotional_intelligence', label: 'Feelings', score: devScore.emotional_intelligence },
      { key: 'career_readiness', label: 'Job Ready', score: devScore.career_readiness },
    ];

    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
          {/* Header */}
          <div className="text-center space-y-3 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" /> All done!
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Well done{ctx.firstName ? `, ${ctx.firstName}` : ''}! 🎉
            </h1>
            <p className="text-slate-400 text-lg">This is where you are today. You will grow from here.</p>
          </div>

          {/* Overall Index */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-violet-600/10 to-blue-600/5 pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Your starting score</p>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="54" fill="none" stroke="#1e293b" strokeWidth="12" />
                    <circle
                      cx="64" cy="64" r="54" fill="none"
                      stroke="url(#grad)" strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={(1 - devScore.overall_index / 100) * 2 * Math.PI * 54}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white">{devScore.overall_index}</span>
                    <span className="text-xs text-slate-400 font-medium">/100</span>
                  </div>
                </div>
              </div>
              <div className="inline-flex px-4 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-semibold">
                {getLevelLabel(devScore.overall_index)}
              </div>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                This is only your start. Practice a little every day and this number will go up.
              </p>
            </div>
          </div>

          {/* Strengths & Focus Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-base font-bold text-emerald-400 mb-3">✅ You are good at</h3>
              <ul className="space-y-2">
                {devScore.strengths.map((s, i) => (
                  <li key={i} className="text-base text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
              <h3 className="text-base font-bold text-amber-400 mb-3">🌱 We will practice</h3>
              <ul className="space-y-2">
                {devScore.priority_areas.map((a, i) => (
                  <li key={i} className="text-base text-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skill Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">All your skills</h2>
            <div className="grid grid-cols-3 gap-3">
              {dimensionEntries.map(dim => (
                <div key={dim.key} className="glass-panel rounded-2xl p-4 border border-slate-800 text-center space-y-2">
                  <div className="text-2xl">{SKILL_DIMENSION_ICONS[dim.key] || '📊'}</div>
                  <div>
                    <div className="text-2xl font-black" style={{ color: getScoreColor(dim.score) }}>{dim.score}</div>
                    <div className="text-xs text-slate-400 leading-tight">{dim.label}</div>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${dim.score}%`, backgroundColor: getScoreColor(dim.score) }}
                    />
                  </div>
                  <div className="text-[10px] font-semibold" style={{ color: getScoreColor(dim.score) }}>
                    {getLevelLabel(dim.score)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-400">
            <strong className="text-slate-300">Remember:</strong> These numbers are not marks. They only help us choose the right lessons for you.
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push('/dashboard/student')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-glow"
          >
            See My Learning Plan
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
