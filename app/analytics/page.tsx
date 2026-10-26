'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, Download, CheckCircle, Flame, Target, 
  Mic, MessageSquare, BookOpen, Users, Brain, Ear, Briefcase, UserCheck, Monitor 
} from 'lucide-react';

export default function AnalyticsPage() {
  const summaryCards = [
    { label: 'Score Improvement', value: '+16 pts', icon: TrendingUp, color: 'text-brand-400' },
    { label: 'Sessions Completed', value: '24', icon: CheckCircle, color: 'text-green-400' },
    { label: 'Day Streak', value: '12', icon: Flame, color: 'text-orange-400' },
    { label: 'Skills Improved', value: '6 of 9', icon: Target, color: 'text-purple-400' },
  ];

  const skillCards = [
    { name: 'Fluency', icon: Mic, start: 45, current: 65 },
    { name: 'Vocabulary', icon: BookOpen, start: 50, current: 58 },
    { name: 'Grammar', icon: MessageSquare, start: 60, current: 72 },
    { name: 'Listening', icon: Ear, start: 55, current: 60 },
    { name: 'Storytelling', icon: Users, start: 30, current: 50 },
    { name: 'Negotiation', icon: Briefcase, start: 40, current: 40 },
    { name: 'Leadership', icon: UserCheck, start: 20, current: 35 },
    { name: 'Presentation', icon: Monitor, start: 65, current: 80 },
    { name: 'Critical Thinking', icon: Brain, start: 70, current: 75 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Progress</h1>
            <p className="text-sm text-slate-400">Track your soft-skills development journey.</p>
          </div>
          <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        {/* Row 1: Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-slate-800/50 ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{card.label}</p>
                <p className="text-lg font-bold text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Skill Progress Cards */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Skill Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCards.map((skill, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-brand-500/10 rounded-lg">
                      <skill.icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <span className="font-bold text-white text-sm">{skill.name}</span>
                  </div>
                  {skill.current > skill.start && (
                    <Badge variant="success">+{skill.current - skill.start}</Badge>
                  )}
                </div>
                
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Current: {skill.current}</span>
                    <span className="text-slate-500">Goal: 100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-brand-500 h-1.5 rounded-full" 
                      style={{ width: `${skill.current}%` }}
                    />
                  </div>
                </div>

                <div className="h-8 flex items-end mt-4">
                  <svg viewBox="0 0 100 20" className="w-full h-full preserve-3d overflow-visible">
                    <polyline 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="2" 
                      points={`0,20 20,15 40,18 60,10 80,5 100,0`} 
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Development Over Time */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-6">Development Over Time</h2>
          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 0 80 Q 15 75 25 70 T 50 50 T 75 30 T 100 20 L 100 100 L 0 100 Z" 
                fill="url(#gradient)" 
                opacity="0.2"
              />
              <path 
                d="M 0 80 Q 15 75 25 70 T 50 50 T 75 30 T 100 20" 
                fill="none" 
                stroke="#8b5cf6" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 border-b border-l border-slate-700 flex flex-col justify-between items-start pointer-events-none text-[10px] text-slate-500">
              <div className="w-full border-b border-slate-800 border-dashed h-1/4" />
              <div className="w-full border-b border-slate-800 border-dashed h-1/4" />
              <div className="w-full border-b border-slate-800 border-dashed h-1/4" />
              <div className="w-full h-1/4" />
            </div>
          </div>
        </div>

        {/* Report Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Personal Development Report</h3>
            <p className="text-sm text-slate-300">Detailed breakdown of your strengths, areas for improvement, and customized recommendations.</p>
          </div>
          <Button variant="primary" className="shrink-0 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

      </div>
    </DashboardLayout>
  );
}
