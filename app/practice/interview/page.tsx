'use client';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Building, ChevronRight, UserCircle, Loader2,
  CheckCircle2, WifiOff, RotateCcw, Star, Volume2, Lightbulb
} from 'lucide-react';
import { getStudentContext, describeStudent, StudentContext } from '../../../lib/student/studentContext';

type State = 'setup' | 'in_progress' | 'processing' | 'debrief';

const INTERVIEW_TYPES = [
  'Fresher Interview',
  'HR Interview',
  'Behavioral Interview',
  'Situational Interview',
  'Technical Communication',
];

interface InterviewQuestion {
  q: string;
  /** One short tip in simple English */
  tip: string;
  /** A sentence starter the student can tap to begin */
  starter: string;
}

// ─── Question Banks (built from the student's background) ───
function buildQuestionBank(ctx: StudentContext): Record<string, InterviewQuestion[]> {
  const isWorking = ctx.lifeStage === 'working';
  const isSchool = ctx.lifeStage === 'school';
  const name = ctx.firstName || '...';
  const stream = ctx.stream;
  const work = isWorking ? 'tasks' : isSchool ? 'homework tasks' : 'assignments';

  const studyLine = isWorking
    ? `work as ${stream ? `a ${stream}` : '...'}`
    : isSchool
      ? 'study in class ...'
      : stream ? `study ${stream}` : 'study ...';

  // Question about the student's own subject area
  const subjectQ: InterviewQuestion = {
    tech: {
      q: 'Which computer skills or software do you know?',
      tip: 'Name 1 or 2 things. Say what you made with them.',
      starter: 'I know ... I used it to make ...',
    },
    commerce: {
      q: 'What did you learn about business or money in your studies?',
      tip: 'Name one topic you like and say why.',
      starter: 'In my studies, I learned about ... I like it because ...',
    },
    science: {
      q: 'Which science subject do you like the most? Why?',
      tip: 'Name the subject. Give one reason.',
      starter: 'I like ... the most because ...',
    },
    medical: {
      q: 'Why did you choose the health or medical field?',
      tip: 'Give one real reason from your life.',
      starter: 'I chose this field because ...',
    },
    arts: {
      q: 'Which subject do you enjoy the most? Why?',
      tip: 'Name the subject. Give one reason.',
      starter: 'I enjoy ... because ...',
    },
    general: {
      q: 'Which subject do you like the most? Why?',
      tip: 'Name the subject. Give one reason.',
      starter: 'I like ... because ...',
    },
  }[ctx.streamArea];

  // Question about a project / task the student did
  const projectQ: InterviewQuestion = isWorking
    ? { q: 'Tell me about one task at work that you are proud of.', tip: 'Say: what the task was → what you did → the result.', starter: 'At work, I had to ... I did ... Because of this, ...' }
    : isSchool
      ? { q: 'Tell me about a school project or activity you liked.', tip: 'Say what it was and what you learned.', starter: 'In school, I did a project on ... I learned ...' }
      : ctx.streamArea === 'tech'
        ? { q: 'Tell me about one project you made. What does it do?', tip: 'Explain it in simple words, like to a friend.', starter: 'In my project, I made a ... It helps people to ...' }
        : { q: 'Tell me about one project or assignment you did. What did you learn?', tip: 'Say what it was and one thing you learned.', starter: 'I did a project on ... I learned ...' };

  return {
    'Fresher Interview': [
      { q: 'Please tell me your name and where you are from.', tip: 'Just 2 short sentences are enough.', starter: `My name is ${name}. I am from ...` },
      isWorking
        ? { q: 'What is your job? What do you do every day?', tip: 'Say your job title and 2 things you do.', starter: `I work as ... Every day, I ...` }
        : isSchool
          ? { q: 'Which school are you in? Which class are you in?', tip: 'Say the school name and your class.', starter: `I study at ${ctx.placeName}. I am in class ...` }
          : stream
            ? { q: `You study ${stream}. Why did you choose it?`, tip: 'Give one simple reason.', starter: `I chose ${stream} because ...` }
            : { q: 'Which college are you from? What do you study?', tip: 'Say your college and your subject.', starter: `I study at ${ctx.placeName}. My subject is ...` },
      subjectQ,
      { q: 'What is one thing you are good at?', tip: 'Say the skill. Then give one small example.', starter: 'I am good at ... For example, ...' },
      isSchool
        ? { q: 'What do you want to become in the future? Why?', tip: 'Say your dream and one reason.', starter: 'In the future, I want to become ... because ...' }
        : { q: 'Why do you want this job?', tip: 'Say what you like about the job and what you can learn.', starter: 'I want this job because ... I can learn ...' },
    ],

    'HR Interview': [
      { q: 'Tell me about yourself.', tip: 'Say: your name → your studies → your skills → your goal.', starter: `My name is ${name}. I ${studyLine}. I am good at ... My goal is ...` },
      { q: 'Why should we choose you?', tip: 'Say 2 good things about you.', starter: 'You should choose me because I am ... and I can ...' },
      { q: 'What is your biggest strength?', tip: 'Say the strength. Then give one small example.', starter: 'My strength is ... For example, ...' },
      { q: 'What is one weakness you have? How are you improving it?', tip: 'Pick a small weakness. Say how you are working on it.', starter: 'Sometimes I ... Now I am improving by ...' },
      { q: 'Where do you see yourself in 5 years?', tip: 'Say your goal in simple words.', starter: 'In 5 years, I want to ...' },
    ],

    'Behavioral Interview': [
      { q: 'Tell me about a time you worked hard for something.', tip: 'Say: what happened → what you did → what you learned.', starter: 'One time, I ... I worked hard by ... In the end, ...' },
      { q: `Tell me about a time you helped a ${isWorking ? 'teammate' : 'friend'}.`, tip: 'Say what the problem was and how you helped.', starter: `My ${isWorking ? 'teammate' : 'friend'} had a problem with ... I helped by ...` },
      { q: 'Tell me about a time you learned something new.', tip: 'Say what you learned and how.', starter: 'I learned ... I practiced by ...' },
      { q: 'Tell me about a mistake you made. What did you learn?', tip: 'Everyone makes mistakes. Say what you learned.', starter: 'Once, I made a mistake. I ... Now I always ...' },
      { q: `Tell me about a time you worked in a team at ${ctx.place}.`, tip: 'Say what the team did and what your part was.', starter: `At ${ctx.place}, my team had to ... My part was ...` },
    ],

    'Situational Interview': [
      { q: `You have two ${work} due on the same day. What will you do first?`, tip: 'Say what you will do first and why.', starter: 'First, I will ... because ... Then I will ...' },
      { q: `Your ${ctx.guide} gives an instruction, but you do not understand. What will you do?`, tip: 'It is okay to ask. Say what you will say.', starter: `I will politely ask, "Can you please explain ... again?"` },
      { q: 'A team member is not doing their work. What will you do?', tip: 'Be kind. Talk first, then find a solution.', starter: 'First, I will talk to them kindly and ask ...' },
      { q: 'You find a mistake in your work after you submit it. What will you do?', tip: 'Be honest. Say how you will fix it.', starter: `I will tell my ${ctx.guide} honestly and ...` },
      { q: `Your ${ctx.guide} asks you to speak in front of everyone. You feel nervous. What will you do?`, tip: 'Say one thing that helps you feel calm.', starter: 'I will take a deep breath and ...' },
    ],

    'Technical Communication': [
      projectQ,
      { q: `Explain one topic from ${stream || 'your studies'} in very simple words.`, tip: 'Imagine you are explaining it to a younger brother or sister.', starter: 'One topic I know is ... In simple words, it means ...' },
      { q: 'What new skill do you want to learn next? Why?', tip: 'Name the skill and one reason.', starter: 'I want to learn ... because ...' },
      { q: 'How do you explain something to a friend who does not understand?', tip: 'Say the steps you follow.', starter: 'First, I ... Then I ... I also use examples like ...' },
      { q: 'Tell me about a time you spoke in front of a group.', tip: 'Say where it was, what you spoke about, and how you felt.', starter: 'One time, I spoke about ... in front of ... I felt ...' },
    ],
  };
}

const INTERVIEW_TYPE_INFO: Record<string, { label: string; desc: string; emoji: string; difficulty: string }> = {
  'Fresher Interview': {
    label: 'First Interview',
    emoji: '🌱',
    desc: 'Easy questions about you, your studies, and your interests. Best place to start!',
    difficulty: '🟢 Easy',
  },
  'HR Interview': {
    label: 'HR Questions',
    emoji: '🤝',
    desc: 'Common questions: tell me about yourself, strengths, weakness, and goals.',
    difficulty: '🟡 Easy–Medium',
  },
  'Behavioral Interview': {
    label: 'Real-Life Stories',
    emoji: '💬',
    desc: 'Tell short stories from your life — teamwork, helping, learning.',
    difficulty: '🟡 Medium',
  },
  'Situational Interview': {
    label: 'What Will You Do?',
    emoji: '🧠',
    desc: 'Small problems. Say what you would do.',
    difficulty: '🟠 Medium',
  },
  'Technical Communication': {
    label: 'Explain Your Studies',
    emoji: '💻',
    desc: 'Explain your project or subject in simple words.',
    difficulty: '🟠 Medium',
  },
};

const API_TIMEOUT_MS = 30000;

interface QuestionResult {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  improved_answer: string;
  strengths: string[];
  weaknesses: string[];
  is_fallback?: boolean;
}

function buildFallbackResult(question: InterviewQuestion, answer: string): QuestionResult {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const hasExample = /example|one time|once|i remember|in my|when i|because/i.test(answer);
  const score = Math.min(90, Math.max(50,
    55 +
    (words.length > 15 ? 10 : 0) +
    (words.length > 35 ? 10 : 0) +
    (hasExample ? 15 : 0)
  ));

  return {
    question: question.q,
    answer,
    score,
    feedback: hasExample
      ? 'Nice! You gave a reason or example. Next time, also say what you learned.'
      : 'Good start! Add one small example from your life. Use "For example, ..."',
    improved_answer: `Try this: ${question.starter}`,
    strengths: [words.length > 20 ? 'You gave a full answer 👏' : 'Your answer was short and clear 👍'],
    weaknesses: [hasExample ? 'Say what you learned at the end' : 'Add one small example'],
    is_fallback: true,
  };
}

function speak(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export default function InterviewPracticePage() {
  const [ctx, setCtx] = useState<StudentContext | null>(null);
  const [state, setState] = useState<State>('setup');
  const [interviewType, setInterviewType] = useState('Fresher Interview');
  const [companyType, setCompanyType] = useState('');

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showTip, setShowTip] = useState(true);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasFallback, setHasFallback] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // ─── Read the student's background from onboarding ───
  useEffect(() => {
    const c = getStudentContext();
    setCtx(c);
    // Shy / beginner students start with the easiest set
    if (c.needsExtraHelp || c.lifeStage !== 'working') setInterviewType('Fresher Interview');
    else setInterviewType('HR Interview');
  }, []);

  const questionBank = useMemo(() => (ctx ? buildQuestionBank(ctx) : {}), [ctx]);

  const startInterview = () => {
    const qs = questionBank[interviewType] || questionBank['Fresher Interview'] || [];
    setQuestions(qs);
    setState('in_progress');
    setQIndex(0);
    setResults([]);
    setAnswer('');
    setShowTip(true);
    setHasFallback(false);
  };

  const goToNextQuestion = (newResults: QuestionResult[]) => {
    setAnswer('');
    setShowTip(true);
    if (qIndex < questions.length - 1) {
      setQIndex(prev => prev + 1);
    } else {
      setResults(newResults);
      setState('debrief');
    }
  };

  const skipQuestion = () => {
    if (isProcessing) return;
    goToNextQuestion(results);
  };

  const submitAnswer = useCallback(async () => {
    if (!answer.trim() || isProcessing || !ctx) return;
    setIsProcessing(true);

    const currentQuestion = questions[qIndex];
    const currentAnswer = answer.trim().slice(0, 2000);
    const t0 = Date.now();

    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), API_TIMEOUT_MS);

    let result: QuestionResult;
    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.q,
          answer: currentAnswer,
          interviewType,
          studentProfile: describeStudent(ctx) + (companyType ? `, target company: ${companyType}` : ''),
          englishLevel: ctx.englishLevel,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);
      console.log('[Interview] API response in', Date.now() - t0, 'ms, status:', res.status);

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      result = {
        question: currentQuestion.q,
        answer: currentAnswer,
        score: Math.round(Number(data.overall_score) || 65),
        feedback: Array.isArray(data.weaknesses) && data.weaknesses[0]
          ? data.weaknesses[0]
          : 'Good try! Keep practicing.',
        improved_answer: data.improved_response || `Try this: ${currentQuestion.starter}`,
        strengths: Array.isArray(data.strengths) ? data.strengths : [],
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
        is_fallback: !!(data as any).is_fallback,
      };

      if (result.is_fallback) setHasFallback(true);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[Interview] Fallback triggered:', err.message);
      result = buildFallbackResult(currentQuestion, currentAnswer);
      setHasFallback(true);
    } finally {
      setIsProcessing(false);
    }

    const newResults = [...results, result];
    setResults(newResults);
    goToNextQuestion(newResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, isProcessing, questions, qIndex, interviewType, results, ctx, companyType]);

  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0;

  const getScoreMessage = (score: number) => {
    if (results.length === 0) return { emoji: '🌱', msg: 'You skipped all questions. That is okay — try again when you are ready!' };
    if (score >= 80) return { emoji: '🌟', msg: 'Excellent! You did really well.' };
    if (score >= 65) return { emoji: '👍', msg: 'Good job! Keep practicing.' };
    if (score >= 50) return { emoji: '💪', msg: 'You are on the right path!' };
    return { emoji: '🌱', msg: 'Great first try! Every try makes you better.' };
  };

  const scoreMsg = getScoreMessage(avgScore);

  if (!ctx) return <div className="min-h-screen bg-slate-950" />;

  const currentQ = questions[qIndex];
  const backgroundLabel =
    ctx.lifeStage === 'working' ? `Working${ctx.stream ? ` · ${ctx.stream}` : ''}` :
    ctx.lifeStage === 'school' ? 'School student' :
    `${ctx.lifeStage === 'fresher' ? 'Fresher' : 'College student'}${ctx.stream ? ` · ${ctx.stream}` : ''}`;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-black text-white">🎯 Interview Practice</h1>
          <p className="text-slate-400 text-lg">
            Practice with your AI coach. Take your time. There is no rush.
          </p>
        </div>

        {/* ── SETUP ── */}
        {state === 'setup' && (
          <div className="space-y-6">
            {/* Personalised for */}
            <div className="glass-panel rounded-2xl p-5 border border-brand-500/20 bg-brand-500/5 flex items-center gap-4">
              <div className="text-3xl">🧑‍🎓</div>
              <div className="flex-1">
                <p className="text-white font-semibold">Questions made for you{ctx.firstName ? `, ${ctx.firstName}` : ''}</p>
                <p className="text-sm text-slate-400">{backgroundLabel} · English: {ctx.englishLevel}</p>
              </div>
            </div>

            {/* Interview Type */}
            <div className="glass-panel rounded-3xl p-8 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Choose a practice type</h3>
              <p className="text-slate-500 text-sm mb-6">Not sure? Start with <strong className="text-brand-400">First Interview</strong>. It is the easiest! 🌱</p>

              <div className="space-y-3">
                {INTERVIEW_TYPES.map(t => {
                  const info = INTERVIEW_TYPE_INFO[t];
                  const isSelected = interviewType === t;
                  const isRecommended = t === 'Fresher Interview' && (ctx.needsExtraHelp || ctx.lifeStage !== 'working');
                  return (
                    <button
                      key={t}
                      onClick={() => setInterviewType(t)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all ${isSelected
                        ? 'bg-violet-500/20 border-violet-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{info.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold">{info.label}</span>
                            {isRecommended && (
                              <span className="text-[10px] font-bold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full">
                                ✨ Best for you
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-500">{info.difficulty}</span>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{info.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-violet-500' : 'border-slate-600'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-violet-500 rounded-full" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company Type (optional) */}
            {!ctx.needsExtraHelp && (
              <div className="glass-panel rounded-3xl p-8 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Company type <span className="text-slate-600 font-normal">(optional)</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Any Company', 'Startup', 'Big Company', 'Government Job'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCompanyType(c === companyType ? '' : c)}
                      className={`px-4 py-2 rounded-xl border text-sm transition-all ${companyType === c
                        ? 'bg-violet-500/20 border-violet-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                      <Building className="w-3.5 h-3.5 inline mr-1" />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-panel rounded-3xl p-6 border border-green-500/20 bg-green-500/5">
              <p className="text-green-300 text-base">
                💡 This is only practice. Mistakes are okay. You can <strong>skip</strong> any question,
                and every question has a <strong>tip</strong> and a <strong>sentence starter</strong> to help you.
              </p>
            </div>

            <div className="text-center pt-2">
              <p className="text-slate-500 text-sm mb-4">
                {(questionBank[interviewType] || []).length} questions · feedback after each answer
              </p>
              <Button variant="primary" size="lg" onClick={startInterview}>
                Start Practice <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ── IN PROGRESS ── */}
        {state === 'in_progress' && currentQ && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase">
              <span>Question {qIndex + 1} of {questions.length}</span>
              <Badge variant="purple">{INTERVIEW_TYPE_INFO[interviewType]?.label || interviewType}</Badge>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-violet-500 h-full transition-all duration-300"
                style={{ width: `${((qIndex + 1) / questions.length) * 100}%` }} />
            </div>

            {/* AI Interviewer */}
            <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row gap-6 items-start mt-8">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                  <UserCircle className="w-12 h-12 text-slate-500" />
                </div>
                <Badge variant="slate" className="text-[10px]">AI Coach</Badge>
              </div>

              <div className="flex-1 bg-slate-900/50 rounded-2xl p-6 border border-slate-800 relative">
                <div className="absolute -left-3 top-6 w-0 h-0 border-y-8 border-y-transparent border-r-[12px] border-r-slate-800" />
                <div className="flex items-start gap-3">
                  <p className="flex-1 text-xl text-white font-medium leading-relaxed">{currentQ.q}</p>
                  <button
                    onClick={() => speak(currentQ.q)}
                    aria-label="Read question aloud"
                    title="Listen"
                    className="shrink-0 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center"
                  >
                    <Volume2 className="w-5 h-5 text-slate-300" />
                  </button>
                </div>
                {showTip ? (
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-200 text-sm flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{currentQ.tip}</span>
                  </div>
                ) : (
                  <button onClick={() => setShowTip(true)} className="mt-3 text-xs text-amber-300 hover:underline">💡 Show tip</button>
                )}
              </div>
            </div>

            {/* Answer area */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-slate-900/30">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-bold text-slate-300">Your answer</h4>
                <span className="text-xs text-slate-600">{answer.length}/2000</span>
              </div>

              {!answer.trim() && (
                <button
                  onClick={() => setAnswer(currentQ.starter + ' ')}
                  className="mb-3 px-3 py-2 rounded-xl text-sm bg-slate-800 border border-slate-700 text-slate-200 hover:border-violet-500 transition-colors text-left"
                >
                  ✍️ Use starter: <span className="text-violet-300">&quot;{currentQ.starter}&quot;</span>
                </button>
              )}

              <textarea
                className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-base text-slate-200 resize-none focus:border-violet-500 outline-none transition-colors"
                placeholder="Write your answer here. Short and simple is okay. Mistakes are okay."
                value={answer}
                onChange={(e) => setAnswer(e.target.value.slice(0, 2000))}
                disabled={isProcessing}
              />
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={skipQuestion}
                  disabled={isProcessing}
                  className="text-sm text-slate-400 hover:text-slate-200 font-semibold px-3 py-2"
                >
                  Skip this question
                </button>
                <Button
                  variant="primary"
                  onClick={submitAnswer}
                  disabled={!answer.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...</>
                  ) : (
                    <>Submit <ChevronRight className="w-4 h-4 ml-1" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── DEBRIEF ── */}
        {state === 'debrief' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {hasFallback && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                <WifiOff className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Simple feedback</strong> — the AI coach was not available for some questions, so we used basic checks.</p>
              </div>
            )}

            {/* Celebration */}
            <div className="glass-panel rounded-3xl p-10 border border-slate-800 text-center">
              <div className="text-5xl mb-4">{scoreMsg.emoji}</div>
              <Badge variant="purple" className="mb-4">Practice done 🎉</Badge>
              <h2 className="text-3xl font-black text-white mb-2">Well done{ctx.firstName ? `, ${ctx.firstName}` : ''}!</h2>
              <p className="text-slate-400 text-lg mb-8">{scoreMsg.msg}</p>

              {results.length > 0 && (
                <div className="flex justify-center mb-8">
                  <div className="w-40 h-40 relative flex items-center justify-center rounded-full bg-slate-900 border-8 border-slate-800">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="72" fill="none" stroke="#1e293b" strokeWidth="10" />
                      <circle cx="80" cy="80" r="72" fill="none"
                        stroke={avgScore >= 70 ? '#10b981' : avgScore >= 50 ? '#3b82f6' : '#8b5cf6'}
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 72}
                        strokeDashoffset={(1 - avgScore / 100) * 2 * Math.PI * 72}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="text-center">
                      <div className="text-4xl font-black text-white">{avgScore}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Your score</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="outline" onClick={() => setState('setup')}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Try another type
                </Button>
                <Button variant="primary" onClick={startInterview}>
                  <Star className="w-4 h-4 mr-2" /> Try again
                </Button>
              </div>
            </div>

            {/* Question breakdown */}
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white px-2">Your answers</h3>
                {results.map((res, i) => (
                  <div key={i} className="glass-panel rounded-2xl p-6 border border-slate-800">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 font-bold flex items-center justify-center text-sm shrink-0">
                          Q{i + 1}
                        </div>
                        <h4 className="text-white font-medium">{res.question}</h4>
                      </div>
                      <Badge variant={res.score >= 70 ? 'emerald' : res.score >= 50 ? 'blue' : 'purple'} className="ml-3 shrink-0">
                        {res.score}/100
                      </Badge>
                    </div>

                    <div className="pl-11 space-y-3">
                      {res.strengths.length > 0 && (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-sm">
                          <span className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Good things
                          </span>
                          <ul className="text-emerald-200 space-y-1">
                            {res.strengths.map((s, j) => <li key={j}>• {s}</li>)}
                          </ul>
                        </div>
                      )}
                      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 text-sm">
                        <span className="font-bold text-purple-400 block mb-1">🌱 Try next time</span>
                        <p className="text-purple-200">{res.feedback}</p>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm">
                        <span className="font-bold text-blue-400 block mb-1">💡 A better way to say it</span>
                        <p className="text-blue-200">{res.improved_answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
