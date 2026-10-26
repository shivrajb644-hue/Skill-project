'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, Lock, PlayCircle, Clock, MapPin } from 'lucide-react';

export default function RoadmapPage() {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  
  const week1Plan = [
    { day: 1, title: 'Self-Introduction Basics', type: 'Speaking', duration: '15m', status: 'completed' },
    { day: 2, title: 'Reducing Filler Words', type: 'Speaking', duration: '20m', status: 'completed' },
    { day: 3, title: 'The STAR Method', type: 'Framework', duration: '25m', status: 'today' },
    { day: 4, title: 'Describing Past Experience', type: 'Scenario', duration: '20m', status: 'locked' },
    { day: 5, title: 'Handling Behavioral Questions', type: 'Interview', duration: '30m', status: 'locked' },
    { day: 6, title: 'Confidence in Voice Tone', type: 'Speaking', duration: '15m', status: 'locked' },
    { day: 7, title: 'Weekly Assessment', type: 'Assessment', duration: '40m', status: 'locked' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <Badge variant="purple" className="mb-2">Based on Assessment Results</Badge>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">30-Day Development Plan</h1>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                Your personalized journey to master executive communication and interview readiness. Stick to the daily plan for optimal results.
              </p>
            </div>
            
            <div className="w-full md:w-72 space-y-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span>Day 12 of 30</span>
                <span className="text-brand-400">40% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 w-[40%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {weeks.map((week, idx) => (
            <button 
              key={idx}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                idx === 0 
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              {week}
            </button>
          ))}
        </div>

        {/* Week Content */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Week 1: Foundation</h2>
            <p className="text-sm text-slate-400">Speaking Confidence & Fluency basics</p>
          </div>

          <div className="space-y-3">
            {week1Plan.map((item, idx) => (
              <div 
                key={idx} 
                className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border transition-all ${
                  item.status === 'today'
                    ? 'bg-brand-500/10 border-brand-500/50 shadow-glow'
                    : item.status === 'completed'
                    ? 'glass-panel border-slate-800 opacity-70'
                    : 'glass-panel border-slate-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Day</span>
                    <span className={`text-xl font-black ${item.status === 'today' ? 'text-brand-400' : 'text-slate-300'}`}>
                      {item.day}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 ml-2 border-l-2 border-slate-800 pl-4">
                    <h3 className={`font-bold ${item.status === 'today' ? 'text-white' : 'text-slate-200'}`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge variant={item.status === 'today' ? 'purple' : 'slate'} className="text-[10px]">
                        {item.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {item.duration}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 flex justify-end shrink-0">
                  {item.status === 'completed' && (
                    <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="hidden sm:inline">Completed</span>
                    </div>
                  )}
                  {item.status === 'locked' && (
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                      <Lock className="w-4 h-4" />
                      <span className="hidden sm:inline text-xs">Locked</span>
                    </div>
                  )}
                  {item.status === 'today' && (
                    <Button variant="primary" size="sm" className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Start Today
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
