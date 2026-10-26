import React from 'react';
import { LearningProfile, SubSkillScore } from '../../lib/types/student';
import { Badge } from '../ui/Badge';
import { Target, AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface ProfileChartProps {
  profile: LearningProfile;
}

export const ProfileChart: React.FC<ProfileChartProps> = ({ profile }) => {
  const getScoreColor = (pct: number) => {
    if (pct < 50) return 'from-rose-600 to-rose-400';
    if (pct < 75) return 'from-amber-600 to-amber-400';
    return 'from-emerald-600 to-emerald-400';
  };

  const getStatusBadge = (status: SubSkillScore['status']) => {
    if (status === 'needs_practice') return <Badge variant="rose">Needs Practice</Badge>;
    if (status === 'developing') return <Badge variant="amber">Developing</Badge>;
    return <Badge variant="emerald">Strong</Badge>;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="purple" className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Diagnostic Capability Assessment
            </Badge>
            <span className="text-xs text-slate-400">Based on initial diagnostic responses</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Your Skill Diagnosis</h2>
        </div>

        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
          <div>
            <div className="text-xs text-slate-400 font-semibold">Estimated Diagnostic Score</div>
            <div className="text-3xl font-extrabold text-brand-400">{profile.overall_score}%</div>
          </div>
        </div>
      </div>

      {/* Sub-Skill Capability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.sub_skill_scores.map(item => (
          <div key={item.name} className="space-y-2.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{item.name}</span>
                {getStatusBadge(item.status)}
              </div>
              <span className="font-extrabold text-sm text-slate-200">{item.score_percentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className={`h-full bg-gradient-to-r ${getScoreColor(item.score_percentage)} transition-all duration-700`}
                style={{ width: `${item.score_percentage}%` }}
              />
            </div>

            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-0.5">
              <span>Evaluated from {item.evidence_count} diagnostic task(s)</span>
              <span className="capitalize">{item.status.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reassuring Note */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <span>
          This diagnostic score is an initial estimate. As you complete daily practice sessions, your competency profile will continuously refine based on your actual performance.
        </span>
      </div>

    </div>
  );
};
