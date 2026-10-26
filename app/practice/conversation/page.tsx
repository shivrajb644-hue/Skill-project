'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Bot, User, Send, StopCircle, ArrowLeft, Loader2, WifiOff } from 'lucide-react';
import { localSession } from '../../../lib/storage/localStorage';

// ─── Scenarios: Easy ones first, then progressively harder ───
const SCENARIOS = [
  // 🟢 Beginner (everyday life, no job experience needed)
  {
    id: 'sb1',
    title: 'Simple Introduction — Meet a New Friend',
    role: 'New Friend',
    desc: 'Practice introducing yourself to someone new at college. Keep it simple and friendly!',
    difficulty: '🟢 Easy',
    openingLine: 'Hi! I don\'t think we\'ve met before. I\'m Priya! What\'s your name and which branch are you from?',
  },
  {
    id: 'sb2',
    title: 'Asking for Help — College Situation',
    role: 'Senior Student',
    desc: 'You are new to the campus and you are lost. Ask a senior student for directions and advice.',
    difficulty: '🟢 Easy',
    openingLine: 'Hey! You look a bit lost. Can I help you with anything? I\'m in my third year here.',
  },
  {
    id: 'sb3',
    title: 'Phone Enquiry — Asking About Internship',
    role: 'Company Receptionist',
    desc: 'Call a company to ask about their internship program. Practice speaking politely on the phone.',
    difficulty: '🟡 Medium',
    openingLine: 'Good morning! Thank you for calling ApexTech. How may I help you today?',
  },
  {
    id: 'sb4',
    title: 'College Fest — Volunteer Coordination',
    role: 'Event Coordinator',
    desc: 'You volunteered for a college event. Discuss your role and responsibilities with the coordinator.',
    difficulty: '🟡 Medium',
    openingLine: 'Hi! Great to have you on our team. Can you tell me a bit about yourself and what role you\'d like to take on for the fest?',
  },
  // 🟠 Intermediate (professional, some confidence required)
  {
    id: 's1',
    title: 'Job Fair — Meet a Recruiter',
    role: 'Recruiter',
    desc: 'You are at a job fair. Introduce yourself confidently and make a good first impression.',
    difficulty: '🟠 Intermediate',
    openingLine: 'Hi there! Welcome to our booth. I\'m Sarah from HR. Tell me a bit about yourself — what brings you here today?',
  },
  {
    id: 's2',
    title: 'Manager Feedback Session',
    role: 'Manager',
    desc: 'Receive constructive feedback from your manager and respond professionally.',
    difficulty: '🟠 Intermediate',
    openingLine: 'I\'d like to discuss your performance on the recent project. Overall it was good, but I have some suggestions. Are you open to hearing some feedback?',
  },
  // 🔴 Advanced (for confident speakers)
  {
    id: 's3',
    title: 'Salary Negotiation',
    role: 'HR Manager',
    desc: 'Negotiate a salary increase professionally and assertively.',
    difficulty: '🔴 Advanced',
    openingLine: 'Thanks for coming in. I understand you wanted to discuss your compensation. What\'s on your mind?',
  },
  {
    id: 's4',
    title: 'Team Conflict Resolution',
    role: 'Colleague',
    desc: 'Address a disagreement with a team member constructively and find a solution.',
    difficulty: '🔴 Advanced',
    openingLine: 'I think we need to talk about how we\'ve been working together. I feel like we\'ve had some misunderstandings lately.',
  },
];

const API_TIMEOUT_MS = 25000;

interface Message {
  role: 'ai' | 'user' | 'coach';
  text: string;
  timestamp: number;
}

function buildFallbackReply(scenario: any, userMessage: string, mode: string): { aiReply: string; coachNote: string | null } {
  const starters = [
    "That's a thoughtful point. Could you expand on that?",
    "I see. How would you handle it if the situation changed?",
    "Interesting perspective. What would your next step be?",
    "Good. Can you give me a specific example?",
    "I appreciate you sharing that. What outcome did you expect?",
  ];
  const aiReply = starters[Math.floor(Math.random() * starters.length)];

  let coachNote: string | null = null;
  if (mode === 'coaching') {
    const hasFillers = /\b(um|uh|like|you know|basically)\b/i.test(userMessage);
    const tooShort = userMessage.trim().split(/\s+/).length < 8;
    if (hasFillers) coachNote = '[Coach] Avoid filler words like "um" or "like" — they reduce perceived confidence.';
    else if (tooShort) coachNote = '[Coach] Try to give more context — elaborate with an example or reason.';
    else coachNote = '[Coach] Good length and directness. Maintain this throughout the conversation.';
  }

  return { aiReply, coachNote };
}

export default function ConversationCoachPage() {
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [mode, setMode] = useState<'simulation' | 'coaching'>('coaching');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // AI is "typing"
  const [isFinished, setIsFinished] = useState(false);
  const [hasFallback, setHasFallback] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startScenario = (scenario: any) => {
    setSelectedScenario(scenario);
    setIsFinished(false);
    setHasFallback(false);
    setTurnCount(0);
    // Use custom openingLine if provided, otherwise generate one
    const openingLine = scenario.openingLine ||
      `Hi! I'm ${scenario.role}. ${scenario.desc} Ready to begin?`;
    setMessages([{
      role: 'ai',
      text: openingLine,
      timestamp: Date.now(),
    }]);
  };


  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim().slice(0, 1000);
    setInput('');
    setIsTyping(true);

    const userMsg: Message = { role: 'user', text: userText, timestamp: Date.now() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Build conversation history for API (last 8 turns only)
    const history = updatedMessages.slice(-8).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), API_TIMEOUT_MS);
    const t0 = Date.now();

    try {
      const res = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: `${selectedScenario.title}: ${selectedScenario.desc}`,
          history,
          userMessage: userText,
          mode,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);
      console.log('[Conversation] API response in', Date.now() - t0, 'ms');

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      const newMessages: Message[] = [];
      if (data.ai_response) {
        newMessages.push({ role: 'ai', text: data.ai_response, timestamp: Date.now() });
      }
      if (mode === 'coaching' && data.feedback) {
        const f = data.feedback;
        const corrections = Array.isArray(f.corrections) && f.corrections.length > 0
          ? ` Correction: "${f.corrections[0]?.original}" → "${f.corrections[0]?.corrected}"`
          : '';
        const note = `[Coach] Fluency: ${f.fluency_score ?? '—'}/100 · Grammar: ${f.grammar_score ?? '—'}/100${corrections}`;
        newMessages.push({ role: 'coach', text: note, timestamp: Date.now() });
      }

      if (data.is_scenario_complete) setIsFinished(true);

      setMessages(prev => [...prev, ...newMessages]);
      setTurnCount(prev => prev + 1);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[Conversation] Fallback triggered:', err.message);
      setHasFallback(true);

      const { aiReply, coachNote } = buildFallbackReply(selectedScenario, userText, mode);
      const fallbackMsgs: Message[] = [{ role: 'ai', text: aiReply, timestamp: Date.now() }];
      if (coachNote) fallbackMsgs.push({ role: 'coach', text: coachNote, timestamp: Date.now() });
      setMessages(prev => [...prev, ...fallbackMsgs]);
      setTurnCount(prev => prev + 1);
    } finally {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isTyping, messages, selectedScenario, mode]);

  // ── SESSION SUMMARY ──
  if (isFinished && selectedScenario) {
    const userMessages = messages.filter(m => m.role === 'user');
    const totalWords = userMessages.reduce((s, m) => s + m.text.split(/\s+/).length, 0);
    const avgWordsPerTurn = userMessages.length > 0 ? Math.round(totalWords / userMessages.length) : 0;

    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center">
        <div className="glass-panel rounded-3xl p-10 border border-slate-800 text-center max-w-2xl w-full space-y-6">
          <Badge variant="purple" className="mb-2">Session Complete</Badge>
          <h2 className="text-3xl font-black text-white">Conversation Summary</h2>

          {hasFallback && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm text-left">
              <WifiOff className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Some responses used estimated coaching. Add a valid Gemini API key for real AI feedback.</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="text-2xl font-black text-violet-400">{turnCount}</div>
              <div className="text-xs text-slate-400 mt-1">Turns taken</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="text-2xl font-black text-blue-400">{totalWords}</div>
              <div className="text-xs text-slate-400 mt-1">Words spoken</div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">{avgWordsPerTurn}</div>
              <div className="text-xs text-slate-400 mt-1">Avg words/turn</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h4 className="text-emerald-400 font-bold mb-2">What worked</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Engaged throughout the conversation</li>
                <li>• Responded to follow-up questions</li>
              </ul>
            </div>
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h4 className="text-amber-400 font-bold mb-2">To improve</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Provide specific examples</li>
                <li>• Aim for 20–30 words per response</li>
              </ul>
            </div>
          </div>

          <Button variant="primary" onClick={() => { setSelectedScenario(null); setIsFinished(false); }}>
            New Scenario
          </Button>
        </div>
      </div>
    );
  }

  // ── CHAT INTERFACE ──
  if (selectedScenario) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedScenario(null)} className="border-none">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h2 className="text-white font-bold">{selectedScenario.title}</h2>
              <div className="text-xs text-slate-400">Role: {selectedScenario.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {hasFallback && <WifiOff className="w-4 h-4 text-amber-400" />}

            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
              <button onClick={() => setMode('coaching')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${mode === 'coaching' ? 'bg-violet-500 text-white' : 'text-slate-500 hover:text-white'}`}>
                Coaching
              </button>
              <button onClick={() => setMode('simulation')} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${mode === 'simulation' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>
                Simulation
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={() => setIsFinished(true)} className="text-red-400 border-red-500/30 hover:bg-red-500/10">
              <StopCircle className="w-4 h-4 mr-2" /> End Session
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 mt-1 shrink-0">
                  <Bot className="w-4 h-4 text-slate-400" />
                </div>
              )}
              {m.role === 'coach' && (
                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center mr-3 mt-1 border border-violet-500/50 shrink-0">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
              )}

              <div className={`max-w-[72%] rounded-2xl p-4 text-sm leading-relaxed ${m.role === 'user'
                ? 'bg-violet-600 text-white rounded-tr-sm'
                : m.role === 'coach'
                  ? 'bg-violet-500/10 border border-violet-500/30 text-violet-200 rounded-tl-sm italic'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
              }`}>
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center ml-3 mt-1 shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 mt-1 shrink-0">
                <Bot className="w-4 h-4 text-slate-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-slate-400" />
                <span className="text-slate-400 text-xs">AI responding...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors"
              placeholder={isTyping ? 'Waiting for response...' : 'Type your response and press Enter...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={isTyping}
            />
            <Button
              variant="primary"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── SCENARIO SELECT ──
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-black text-white">💬 Conversation Practice</h1>
          <p className="text-slate-400">
            Practice real conversations with an AI partner. Start easy and work your way up!
          </p>
        </div>

        {/* Tip banner for beginners */}
        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-300 text-sm flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <strong>New here?</strong> Start with the <strong>🟢 Easy</strong> scenarios at the top.
            There are no wrong answers — just type what you would naturally say. Your AI partner will keep the conversation going!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map(s => {
            const diffColor =
              (s as any).difficulty?.includes('Easy') ? 'hover:border-green-500/50' :
              (s as any).difficulty?.includes('Medium') ? 'hover:border-yellow-500/50' :
              (s as any).difficulty?.includes('Advanced') ? 'hover:border-red-500/50' :
              'hover:border-violet-500/50';
            return (
              <div
                key={s.id}
                className={`glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col ${diffColor} transition-colors cursor-pointer group`}
                onClick={() => startScenario(s)}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="slate">{s.role}</Badge>
                  {(s as any).difficulty && (
                    <span className="text-xs font-medium text-slate-400">{(s as any).difficulty}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{s.title}</h3>
                <p className="text-sm text-slate-400 flex-1 mb-4">{s.desc}</p>
                <Button variant="outline" className="w-full">Start Conversation →</Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
