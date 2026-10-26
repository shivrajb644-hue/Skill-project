import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRight, Bot } from 'lucide-react';

export function AIRecommendation({ message, actionLabel, actionHref }: { message: string, actionLabel: string, actionHref: string }) {
  return (
    <div className="bg-slate-900/50 border border-brand-500/30 rounded-2xl p-5 relative">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0 border border-brand-500/40 shadow-glow">
          <Bot className="w-5 h-5 text-brand-400" />
        </div>
        <div className="space-y-2 flex-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Coach Suggestion</h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {message}
          </p>
          <div className="pt-2">
            <Link href={actionHref}>
              <Button variant="outline" size="sm" className="w-full text-brand-400 border-brand-500/30 hover:bg-brand-500/10">
                <span>{actionLabel}</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
