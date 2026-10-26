'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Trophy, Star, Shield, Zap, Target, Mic, BookOpen, Crown } from 'lucide-react';

export default function AchievementsPage() {
  const unlockedBadges = [
    { name: 'First Step', desc: 'Complete your first assessment', xp: 50, date: 'Aug 1', icon: '🎯' },
    { name: 'Consistent Learner', desc: '7-day learning streak', xp: 100, date: 'Aug 8', icon: '🔥' },
    { name: 'Word Wizard', desc: 'Learn 50 new vocabulary words', xp: 100, date: 'Aug 10', icon: '🧙‍♂️' },
    { name: 'Ice Breaker', desc: 'Complete 5 conversation sessions', xp: 150, date: 'Aug 12', icon: '🧊' },
  ];

  const lockedBadges = [
    { name: 'Interview Ready', req: 'Complete 3 mock interviews', xp: 150, icon: '👔' },
    { name: 'Confidence Builder', req: 'Speaking score reaches 70', xp: 200, icon: '🦁' },
    { name: 'Fast Riser', req: 'Improve any skill by 20 points in a week', xp: 250, icon: '🚀' },
    { name: 'Master Presenter', req: 'Score 90+ in Presentation Lab', xp: 300, icon: '🎤' },
    { name: 'Grammar Guru', req: 'Complete 20 grammar exercises flawlessly', xp: 150, icon: '📝' },
    { name: 'Negotiator', req: 'Win 3 scenario-based negotiations', xp: 200, icon: '🤝' },
    { name: '30-Day Legend', req: 'Maintain a 30-day streak', xp: 500, icon: '👑' },
    { name: 'Perfect Pitch', req: 'Deliver an elevator pitch without filler words', xp: 150, icon: '⏱️' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Level Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-10 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 w-32 h-32 shrink-0 rounded-full bg-gradient-to-tr from-brand-600 to-accent-purple p-1 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center border-4 border-slate-900">
              <span className="text-xs text-brand-400 font-bold uppercase tracking-wider mb-1">Level</span>
              <span className="text-5xl font-black text-white">3</span>
            </div>
          </div>
          
          <div className="relative z-10 flex-1 w-full text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Developing Communicator</h1>
              <p className="text-slate-400 text-sm">You are in the top 30% of active learners this week!</p>
            </div>
            
            <div className="space-y-2 max-w-xl">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>XP: 840</span>
                <span>1200 to Level 4</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-brand-500 to-accent-purple w-[70%] rounded-full relative">
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Badges */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Unlocked Achievements</h2>
            <span className="ml-2 text-xs font-bold text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
              {unlockedBadges.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {unlockedBadges.map((badge, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors flex flex-col items-center text-center relative group">
                <div className="absolute top-3 right-3 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">
                  +{badge.xp} XP
                </div>
                <div className="text-5xl mb-4 mt-2 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] group-hover:scale-110 transition-transform">
                  {badge.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{badge.name}</h3>
                <p className="text-[11px] text-slate-400 mb-4">{badge.desc}</p>
                <div className="text-[10px] font-semibold text-slate-500 mt-auto">
                  Unlocked on {badge.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locked Badges */}
        <div className="opacity-80">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl font-bold text-white">Locked</h2>
            <span className="ml-2 text-xs font-bold text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
              {lockedBadges.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lockedBadges.map((badge, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800/50 bg-slate-900/30 flex flex-col items-center text-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                  {badge.xp} XP
                </div>
                <div className="text-5xl mb-4 mt-2">{badge.icon}</div>
                <h3 className="font-bold text-slate-300 text-sm mb-1">{badge.name}</h3>
                <p className="text-[11px] text-slate-500">{badge.req}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// Mock Lock icon since we didn't import it at the top
function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
