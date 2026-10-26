import React from 'react';
import { Student } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { Users, Mail, Target, Calendar } from 'lucide-react';

interface StudentRosterProps {
  students: Student[];
}

export const StudentRoster: React.FC<StudentRosterProps> = ({ students }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Enrolled Students Roster ({students.length})
          </h2>
          <p className="text-xs text-slate-400">Viewing registered student accounts and target leadership goals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => (
          <div key={student.id} className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                  alt={student.full_name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{student.full_name}</h3>
                  <div className="text-xs text-emerald-400 font-medium">{student.target_role || 'Student'}</div>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{student.bio}</p>

              {student.learning_goals && student.learning_goals.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Target className="w-3 h-3 text-amber-400" />
                    Target Goals:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {student.learning_goals.map((g, idx) => (
                      <Badge key={idx} variant="slate" className="text-[10px]">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined: {new Date(student.created_at).toLocaleDateString()}
              </span>
              <span className="text-brand-400 font-mono text-[10px]">ID: {student.id.slice(0, 8)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
