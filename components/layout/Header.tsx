'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, BookOpen, Shield, Layers, UserCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { StudentSelector } from '../student/StudentSelector';

export const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/dashboard/student" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-purple shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              ApexSkill <span className="text-brand-400 font-medium text-xs">AI</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400">Personalized Soft-Skills Engine</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard/student"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              pathname.includes('/student')
                ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Learner Portal</span>
          </Link>

          <Link
            href="/dashboard/admin"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              pathname.includes('/admin')
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Trainer / Admin Mode</span>
          </Link>
        </nav>

        {/* Student Profile Switcher */}
        <div className="flex items-center gap-3">
          <StudentSelector />
        </div>

      </div>
    </header>
  );
};
