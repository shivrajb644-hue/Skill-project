import { createClient } from '../supabase/client';
import { store } from './store';
import { StudentProgress } from '../types';

export const progressService = {
  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', studentId);

      if (error || !data) return store.getStudentProgress(studentId);
      return data as StudentProgress[];
    } catch {
      return store.getStudentProgress(studentId);
    }
  },

  async updateProgress(studentId: string, lessonId: string, status: 'not_started' | 'in_progress' | 'completed'): Promise<StudentProgress> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .upsert([
          {
            student_id: studentId,
            lesson_id: lessonId,
            status,
            completed_at: status === 'completed' ? new Date().toISOString() : null
          }
        ], { onConflict: 'student_id,lesson_id' })
        .select()
        .single();

      if (error || !data) return store.updateProgress(studentId, lessonId, status);
      return data as StudentProgress;
    } catch {
      return store.updateProgress(studentId, lessonId, status);
    }
  },

  async calculateSkillProgress(studentId: string, skillId: string): Promise<{ totalLessons: number; completedLessons: number; percentage: number }> {
    const supabase = createClient();
    try {
      const { data: comps } = await supabase
        .from('competencies')
        .select('id')
        .eq('skill_id', skillId);

      if (!comps || comps.length === 0) {
        return store.getStudentProgress(studentId) ? storeCalculate(studentId, skillId) : { totalLessons: 0, completedLessons: 0, percentage: 0 };
      }

      const compIds = comps.map(c => c.id);
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .in('competency_id', compIds);

      if (!lessons || lessons.length === 0) return { totalLessons: 0, completedLessons: 0, percentage: 0 };

      const lessonIds = lessons.map(l => l.id);
      const { data: progress } = await supabase
        .from('student_progress')
        .select('lesson_id, status')
        .eq('student_id', studentId)
        .eq('status', 'completed')
        .in('lesson_id', lessonIds);

      const completedCount = progress?.length || 0;
      const percentage = Math.round((completedCount / lessonIds.length) * 100);

      return {
        totalLessons: lessonIds.length,
        completedLessons: completedCount,
        percentage
      };
    } catch {
      return storeCalculate(studentId, skillId);
    }
  }
};

function storeCalculate(studentId: string, skillId: string) {
  const competencies = store.getCompetencies(skillId);
  const lessonIds: string[] = [];
  competencies.forEach(c => {
    const lessons = store.getLessons(c.id);
    lessons.forEach(l => lessonIds.push(l.id));
  });

  if (lessonIds.length === 0) return { totalLessons: 0, completedLessons: 0, percentage: 0 };

  const progressRecords = store.getStudentProgress(studentId);
  const completedCount = lessonIds.filter(id => {
    const p = progressRecords.find(pr => pr.lesson_id === id);
    return p && p.status === 'completed';
  }).length;

  const percentage = Math.round((completedCount / lessonIds.length) * 100);

  return {
    totalLessons: lessonIds.length,
    completedLessons: completedCount,
    percentage
  };
}
