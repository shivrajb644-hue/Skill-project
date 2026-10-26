import { createClient } from '../supabase/client';
import { store } from './store';
import { StudentEnrollment, Skill } from '../types';

export const enrollmentsService = {
  async getStudentEnrollments(studentId: string): Promise<(StudentEnrollment & { skill: Skill })[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('student_enrollments')
        .select('*, skill:skills(*)')
        .eq('student_id', studentId);

      if (error || !data || data.length === 0) {
        return store.getEnrollments(studentId).map(e => ({
          ...e,
          skill: store.getSkills().find(s => s.id === e.skill_id)!
        })).filter(e => e.skill);
      }

      return data as (StudentEnrollment & { skill: Skill })[];
    } catch {
      return store.getEnrollments(studentId).map(e => ({
        ...e,
        skill: store.getSkills().find(s => s.id === e.skill_id)!
      })).filter(e => e.skill);
    }
  },

  async enrollStudent(studentId: string, skillId: string): Promise<StudentEnrollment> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('student_enrollments')
        .insert([{ student_id: studentId, skill_id: skillId, status: 'active' }])
        .select()
        .single();

      if (error || !data) return store.enrollStudent(studentId, skillId);
      return data as StudentEnrollment;
    } catch {
      return store.enrollStudent(studentId, skillId);
    }
  }
};
