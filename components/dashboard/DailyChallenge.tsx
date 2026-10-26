import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Play, Sparkles } from 'lucide-react';
import { DailyChallenge as DailyChallengeType } from '../../lib/types/extensions';

export function DailyChallenge({ challenge }: { challenge: DailyChallengeType }) {
  const getHref = () => {
    switch (challenge.challenge_type) {
      case 'speaking': return '/practice/speaking';
      case 'scenario': return '/practice/conversation';
      default: return '/practice/speaking';
    }
  };

  return (
    <div className="glass-panel border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-500/20 blur-2xl rounded-full group-hover:bg-brand-500/30 transition-all duration-500" />
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-brand-400" />
        <h3 className="text-sm font-bold text-white">Daily Challenge</h3>
        <Badge variant="purple" className="ml-auto">{challenge.challenge_type}</Badge>
      </div>
      
      <h4 className="text-lg font-bold text-white mb-2">{challenge.title}</h4>
      <p className="text-xs text-slate-300 mb-4 line-clamp-2">{challenge.description}</p>
      
      <div className="flex items-center gap-2 mb-5">
        <Badge variant="slate" className="text-[10px]">{challenge.skill_focus}</Badge>
        <Badge variant="slate" className="text-[10px] uppercase">{challenge.difficulty}</Badge>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <Link href={getHref()} className="flex-1 mr-3">
          <Button variant="primary" size="sm" className="w-full">
            <Play className="w-3 h-3 mr-1" /> Start Challenge
          </Button>
        </Link>
        <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Skip</button>
      </div>
    </div>
  );
}
