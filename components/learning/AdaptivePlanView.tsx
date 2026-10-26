import React from 'react';
import { LearningPlanItem } from '../../lib/types/student';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Target, CheckCircle2, Clock, Play, AlertCircle, Sparkles } from 'lucide-react';

interface AdaptivePlanViewProps {
  planItems: LearningPlanItem[];
  onStartSession: (item: LearningPlanItem) => void;
}

export const AdaptivePlanView: React.FC<AdaptivePlanViewProps> = ({
  planItems,
  onStartSession
}) => {
  const getStatusBadge = (status: LearningPlanItem['status']) => {
    switch (status) {
      case 'completed': return <Badge variant="emerald">Completed</Badge>;
      case 'in_progress': return <Badge variant="blue">Next Up</Badge>;
      case 'revision_recommended': return <Badge variant="rose">Revision Suggested</Badge>;
      default: return <Badge variant="slate">Upcoming</Badge>;
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Adaptive Recommendation Path
            </Badge>
            <span className="text-xs text-slate-400 font-medium">Prioritized by diagnostic weakness</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Personalized Learning Roadmap</h2>
        </div>

        <Badge variant="blue" className="px-3 py-1">
          {planItems.filter(i => i.status === 'completed').length} of {planItems.length} Modules Mastered
        </Badge>
      </div>

      <div className="space-y-4">
        {planItems.map((item, idx) => (
          <div
            key={item.id}
            className={`glass-panel rounded-2xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              item.status === 'in_progress'
                ? 'border-brand-500/50 bg-slate-900/90 shadow-glow'
                : 'border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-4 flex-1">
              <span className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                item.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : item.status === 'in_progress'
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                Day {item.day_number}
              </span>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-xs text-slate-300 font-medium line-clamp-1">{item.objective}</p>
                <div className="text-[11px] font-medium text-amber-400/90 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {item.reason_for_recommendation}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <Button
                variant={item.status === 'in_progress' ? 'primary' : 'secondary'}
                size="md"
                onClick={() => onStartSession(item)}
              >
                <Play className="w-4 h-4" />
                <span>{item.status === 'completed' ? 'Review Lesson' : 'Start Day ' + item.day_number}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
