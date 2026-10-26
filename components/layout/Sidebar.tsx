'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, CalendarDays, Map as MapIcon, 
  Mic, Users, MessageSquare, Projector, 
  TrendingUp, Trophy, Compass, Settings, Shield,
  ChevronLeft, Menu, Sparkles
} from 'lucide-react';
import { localSession } from '../../lib/storage/localStorage';
import { repository } from '../../lib/repositories/LocalIndexedDBRepository';
import { LocalStudentProfile } from '../../lib/types/student';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const pathname = usePathname();
  const [student, setStudent] = useState<LocalStudentProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const activeId = localSession.getActiveStudentId();
      if (activeId) {
        const st = await repository.getStudentById(activeId);
        setStudent(st);
      }
      // Check if the current user is an admin
      const authUser = localSession.getAuthUser();
      if (authUser && authUser.email.toLowerCase() === 'admin@platform.com') {
        setIsAdmin(true);
      }
    };
    loadUser();
  }, []);

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/student' },
        { label: 'Daily Challenge', icon: CalendarDays, href: '/challenges' },
        { label: 'My Roadmap', href: '/roadmap', icon: MapIcon },
      ]
    },
    {
      title: 'PRACTICE',
      items: [
        { label: 'Speaking Lab', icon: Mic, href: '/practice/speaking' },
        { label: 'Interview Simulator', icon: Users, href: '/practice/interview' },
        { label: 'Conversation Coach', icon: MessageSquare, href: '/practice/conversation' },
        { label: 'Presentation Lab', icon: Projector, href: '/practice/presentation' },
      ]
    },
    {
      title: 'GROWTH',
      items: [
        { label: 'Progress Analytics', icon: TrendingUp, href: '/analytics' },
        { label: 'Achievements', icon: Trophy, href: '/achievements' },
        { label: 'Career Coach', icon: Compass, href: '/coach' },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Settings', icon: Settings, href: '/settings' },
        ...(isAdmin ? [{ label: 'Trainer / Admin Portal', icon: Shield, href: '/dashboard/admin' }] : []),
      ]
    }
  ];

  const sidebarClass = `fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClass}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 justify-between shrink-0">
          <Link href="/dashboard/student" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-accent-purple shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              Elevate <span className="text-brand-400 font-medium text-xs">AI</span>
            </span>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileOpen(false)}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                        isActive
                          ? 'text-white bg-slate-800/50'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      )}
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-t border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors">
            {student ? (
              <>
                <img
                  src={student.avatar_url}
                  alt={student.full_name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{student.full_name}</p>
                  <p className="text-[10px] text-slate-400 truncate">Lvl 3 • Explorer</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
                  <div className="h-2 w-12 bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
