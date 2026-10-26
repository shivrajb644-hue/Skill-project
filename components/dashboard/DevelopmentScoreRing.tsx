'use client';
import React, { useEffect, useState } from 'react';

export function DevelopmentScoreRing({ score, label }: { score: number; label: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const currentScore = mounted ? score : 0;
  const dashoffset = circumference - (currentScore / 100) * circumference;
  
  let colorClass = "text-emerald-500";
  if (score < 50) colorClass = "text-amber-500";
  else if (score <= 70) colorClass = "text-blue-500";

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={`${colorClass} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white">{currentScore}</span>
        </div>
      </div>
      <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    </div>
  );
}
