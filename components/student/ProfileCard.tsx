import React from 'react';
import { Student } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Target, Award, BookOpen, Sparkles } from 'lucide-react';

interface ProfileCardProps {
  student: Student;
  enrolledSkillsCount: number;
  completedLessonsCount: number;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  student,
  enrolledSkillsCount,
  completedLessonsCount
}) => {
  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
              alt={student.full_name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-glow"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{student.full_name}</h1>
              <Badge variant="purple" className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {student.target_role || 'Student'}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-xl line-clamp-2">{student.bio}</p>
            
            {student.learning_goals && student.learning_goals.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Target Focus:
                </span>
                {student.learning_goals.map((goal, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    {goal}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
          <div className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{enrolledSkillsCount}</div>
              <div className="text-[11px] font-medium text-slate-400">Enrolled Skills</div>
            </div>
          </div>

          <div className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedLessonsCount}</div>
              <div className="text-[11px] font-medium text-slate-400">Lessons Mastered</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
