import React from 'react';
import Link from 'next/link';
import { Skill } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MessageSquareText, Handshake, BrainCircuit, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  isEnrolled?: boolean;
  progressPercentage?: number;
  onEnroll?: (skillId: string) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  isEnrolled = false,
  progressPercentage = 0,
  onEnroll
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Handshake': return <Handshake className="w-6 h-6 text-purple-400" />;
      case 'BrainCircuit': return <BrainCircuit className="w-6 h-6 text-emerald-400" />;
      default: return <MessageSquareText className="w-6 h-6 text-brand-400" />;
    }
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'Advanced': return 'purple';
      case 'Intermediate': return 'blue';
      default: return 'emerald';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-3xl p-6 flex flex-col justify-between border border-slate-800 relative group">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-brand-500/40 transition-colors">
            {getIcon(skill.icon)}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="slate">{skill.category}</Badge>
            <Badge variant={getLevelVariant(skill.level)}>{skill.level}</Badge>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors mb-2 line-clamp-1">
          {skill.title}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
          {skill.description}
        </p>
      </div>

      <div>
        {isEnrolled ? (
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Completion Progress</span>
                <span className="text-brand-400">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <Link href={`/skills/${skill.id}`}>
              <Button variant="primary" size="md" className="w-full justify-between">
                <span>Continue Skill Path</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {onEnroll && (
              <Button variant="outline" size="md" onClick={() => onEnroll(skill.id)} className="flex-1">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Enroll Skill
              </Button>
            )}
            <Link href={`/skills/${skill.id}`} className="flex-1">
              <Button variant="secondary" size="md" className="w-full justify-between">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
