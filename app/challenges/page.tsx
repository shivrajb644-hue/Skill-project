'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Mic, Clock, Trophy, PlayCircle, CheckCircle2, XCircle, SkipForward } from 'lucide-react';

export default function ChallengesPage() {
  const challengeHistory = [
    { date: 'Today', title: 'Introduce a Complex Topic', type: 'Speaking', status: 'pending', score: null },
    { date: 'Yesterday', title: 'Salary Negotiation Request', type: 'Scenario', status: 'completed', score: 85 },
    { date: '2 Days Ago', title: 'Active Listening in Meetings', type: 'Scenario', status: 'completed', score: 92 },
    { date: '3 Days Ago', title: 'Provide Constructive Feedback', type: 'Speaking', status: 'skipped', score: null },
    { date: '4 Days Ago', title: '5 New Tech Buzzwords', type: 'Vocabulary', status: 'completed', score: 100 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Daily Challenges</h1>
          <p className="text-sm text-slate-400">Complete short daily exercises to build your streak and earn XP.</p>
        </div>

        {/* Today's Challenge */}
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-brand-500 to-accent-purple overflow-hidden">
          <div className="absolute inset-0 bg-white/10 blur-xl"></div>
          <div className="relative bg-slate-950 rounded-[22px] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="purple" className="flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Speaking
                </Badge>
                <Badge variant="slate">Medium Difficulty</Badge>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 ml-2">
                  <Clock className="w-3.5 h-3.5" />
                  Resets in: 14:32:18
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Introduce a Complex Topic</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Explain the concept of "Machine Learning" to someone without a technical background in under 60 seconds. Focus on clarity, avoiding jargon, and using a relatable analogy.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Reward: 50 XP</span>
                </div>
                <span>•</span>
                <span>Focus: Fluency, Audience Adaptability</span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col w-full md:w-auto gap-3">
              <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <PlayCircle className="w-5 h-5" />
                Start Challenge
              </Button>
              <Button variant="outline" size="md" className="w-full">
                Mark as Complete
              </Button>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="glass-panel rounded-3xl border border-slate-800 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Challenge History</h3>
            <div className="flex gap-2">
              {['All', 'Speaking', 'Scenario', 'Vocabulary'].map((tab, idx) => (
                <button 
                  key={idx} 
                  className={`px-3 py-1 text-xs font-medium rounded-full ${idx === 0 ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {challengeHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                  <div className="w-24 shrink-0 text-xs text-slate-500 font-medium">{item.date}</div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="text-sm font-bold text-white truncate">{item.title}</span>
                    <Badge variant="slate" className="w-max">{item.type}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  {item.score !== null && (
                    <span className="text-sm font-bold text-slate-300">Score: {item.score}</span>
                  )}
                  <div className="w-8 flex justify-end">
                    {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {item.status === 'skipped' && <SkipForward className="w-5 h-5 text-slate-500" />}
                    {item.status === 'pending' && <div className="w-2 h-2 rounded-full bg-brand-500 mr-1.5" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
