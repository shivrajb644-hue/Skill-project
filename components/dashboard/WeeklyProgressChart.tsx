'use client';
import React, { useEffect, useState } from 'react';

export function WeeklyProgressChart({ data }: { data: { day: string; minutes: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const height = 150;
  const maxMinutes = Math.max(...data.map(d => d.minutes), 60); // min max 60

  return (
    <div className="w-full flex items-end justify-between h-[150px] gap-2 pt-4">
      {data.map((d, i) => {
        const fillHeight = (d.minutes / maxMinutes) * height;
        const currentHeight = mounted ? fillHeight : 0;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-2">
            <div className="w-full bg-slate-800/50 rounded-t-sm relative flex-1 flex items-end">
              <div 
                className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-sm transition-all duration-1000 ease-out"
                style={{ height: `${currentHeight}px` }}
              />
            </div>
            <span className="text-[10px] font-medium text-slate-500 uppercase">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}
