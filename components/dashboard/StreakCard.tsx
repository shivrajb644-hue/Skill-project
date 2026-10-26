import React from 'react';
import { Flame } from 'lucide-react';

export function StreakCard({ currentStreak, longestStreak, history }: { currentStreak: number, longestStreak: number, history: boolean[] }) {
  return (
    <div className="glass-panel border border-slate-800 rounded-2xl p-5 flex flex-col justify-between items-center text-center">
      <div className="flex flex-col items-center gap-1 mb-4">
        <div className="relative">
          <Flame className={`w-12 h-12 ${currentStreak > 0 ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'text-slate-700'}`} />
          {currentStreak > 2 && (
             <div className="absolute -inset-2 bg-orange-500/20 blur-xl rounded-full -z-10" />
          )}
        </div>
        <div className="text-4xl font-black text-white">{currentStreak}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Day Streak</div>
      </div>
      
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between gap-1 w-full max-w-[160px] mx-auto">
          {history.map((practiced, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full ${practiced ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-slate-800'}`}
            />
          ))}
        </div>
        <div className="text-[10px] text-slate-500 font-medium">Longest streak: {longestStreak} days</div>
      </div>
    </div>
  );
}
