import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'blue' | 'brand' | 'purple' | 'emerald' | 'success' | 'amber' | 'rose' | 'slate' | 'destructive';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'blue',
  children,
  className
}) => {
  const variants = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    brand: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    destructive: "bg-red-500/10 text-red-400 border-red-500/30",
    slate: "bg-slate-800 text-slate-300 border-slate-700"
  };

  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm", variants[variant], className)}>
      {children}
    </span>
  );
};
