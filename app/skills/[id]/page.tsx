'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '../../../lib/services/authService';
import { skillsService } from '../../../lib/services/skillsService';
import { progressService } from '../../../lib/services/progressService';
import { SkillWithDetails, Lesson, StudentProgress, Student } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Layers, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;

  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [skill, setSkill] = useState<SkillWithDetails | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, 'not_started' | 'in_progress' | 'completed'>>({});

  const loadSkillData = async () => {
    const student = await authService.getCurrentStudent();
    if (student) {
      setCurrentStudent(student);
      const studentProgress = await progressService.getStudentProgress(student.id);
      const pMap: Record<string, 'not_started' | 'in_progress' | 'completed'> = {};
      studentProgress.forEach(p => {
        pMap[p.lesson_id] = p.status;
      });
      setProgressMap(pMap);
    }

    const data = await skillsService.getSkillById(skillId);
    if (data) {
      setSkill(data);
      // Select first lesson by default
      if (data.competencies.length > 0 && data.competencies[0].lessons.length > 0) {
        setActiveLesson(data.competencies[0].lessons[0]);
      }
    }
  };

  useEffect(() => {
    loadSkillData();
  }, [skillId]);

  const handleToggleLessonComplete = async (lessonId: string) => {
    if (!currentStudent) return;

    const currentStatus = progressMap[lessonId] || 'not_started';
    const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';

    await progressService.updateProgress(currentStudent.id, lessonId, newStatus);
    
    // Update local state
    setProgressMap(prev => ({
      ...prev,
      [lessonId]: newStatus
    }));
  };

  if (!skill) {
    return (
      <div className="py-20 text-center text-slate-400">
        Skill module not found. <Link href="/dashboard/student" className="text-brand-400 underline">Return to Dashboard</Link>
      </div>
    );
  }

  // Calculate skill percentage
  const totalLessons = skill.competencies.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedCount = Object.keys(progressMap).filter(id => {
    const isLessonInSkill = skill.competencies.some(c => c.lessons.some(l => l.id === id));
    return isLessonInSkill && progressMap[id] === 'completed';
  }).length;

  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-8">
      
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/student">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Badge variant="blue" className="px-3 py-1">
          {completedCount} of {totalLessons} Lessons Mastered ({percentage}%)
        </Badge>
      </div>

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/30 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="slate">{skill.category}</Badge>
              <Badge variant={skill.level === 'Advanced' ? 'purple' : 'blue'}>{skill.level}</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{skill.title}</h1>
            <p className="text-sm text-slate-300 leading-relaxed font-light">{skill.description}</p>
          </div>

          {/* Completion Ring */}
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-brand-400">{percentage}%</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Skill Mastery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout: Competencies & Lessons sidebar + Lesson content viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Competencies & Lesson Accordion (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 px-1">
            <Layers className="w-4 h-4 text-purple-400" />
            Competencies & Lessons ({skill.competencies.length} Modules)
          </h2>

          <div className="space-y-4">
            {skill.competencies.map(comp => (
              <div key={comp.id} className="glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs">
                        #{comp.order_index}
                      </span>
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{comp.description}</p>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                  {comp.lessons.map(lesson => {
                    const isCompleted = progressMap[lesson.id] === 'completed';
                    const isActive = activeLesson?.id === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                          isActive
                            ? 'bg-brand-500/20 border border-brand-500/40 text-white font-semibold'
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLessonComplete(lesson.id);
                            }}
                            className="p-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                            title={isCompleted ? "Mark incomplete" : "Mark completed"}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                          <span className="line-clamp-1">{lesson.title}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes}m
                          </span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Lesson Material Reader (7 cols) */}
        <div className="lg:col-span-7">
          {activeLesson ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl sticky top-28">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <Badge variant="amber" className="mb-2 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activeLesson.duration_minutes} min lesson
                  </Badge>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{activeLesson.title}</h2>
                </div>

                <Button
                  variant={progressMap[activeLesson.id] === 'completed' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleLessonComplete(activeLesson.id)}
                >
                  {progressMap[activeLesson.id] === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              </div>

              {/* Lesson Text Reader */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-4">
                {activeLesson.content}
              </div>

              {/* Phase 2 Interactive Readiness Placeholder */}
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-300 space-y-2">
                <div className="font-semibold flex items-center gap-1.5 text-purple-200">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Phase 2 AI Extensions Ready
                </div>
                <p className="text-[11px] text-purple-300/80 leading-normal">
                  In future phases, this lesson block connects directly to AI Speaking Practice, Interactive Audio Simulations, Real-Time Feedback Analysis, and Daily Adaptive Reframing Exercises.
                </p>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-slate-500 border border-slate-800">
              Select a lesson from the left module list to begin reading.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
