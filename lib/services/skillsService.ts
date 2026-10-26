import { createClient } from '../supabase/client';
import { store } from './store';
import { Skill, SkillWithDetails } from '../types';

export const skillsService = {
  async getSkills(): Promise<Skill[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) return store.getSkills();
      return data as Skill[];
    } catch {
      return store.getSkills();
    }
  },

  async getSkillById(id: string): Promise<SkillWithDetails | null> {
    const supabase = createClient();
    try {
      const { data: skill, error } = await supabase
        .from('skills')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !skill) return store.getSkillById(id);

      const { data: competencies } = await supabase
        .from('competencies')
        .select('*, lessons(*)')
        .eq('skill_id', id)
        .order('order_index', { ascending: true });

      const { count } = await supabase
        .from('student_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('skill_id', id);

      const formattedCompetencies = (competencies || []).map(c => ({
        ...c,
        lessons: (c.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index)
      }));

      return {
        ...(skill as Skill),
        competencies: formattedCompetencies,
        enrolled_count: count || 0
      };
    } catch {
      return store.getSkillById(id);
    }
  },

  async createSkill(data: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
    const supabase = createClient();
    try {
      const { data: newSkill, error } = await supabase
        .from('skills')
        .insert([data])
        .select()
        .single();

      if (error || !newSkill) return store.createSkill(data);
      return newSkill as Skill;
    } catch {
      return store.createSkill(data);
    }
  },

  async updateSkill(id: string, data: Partial<Omit<Skill, 'id' | 'created_at'>>): Promise<Skill> {
    const supabase = createClient();
    try {
      const { data: updated, error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error || !updated) return store.updateSkill(id, data);
      return updated as Skill;
    } catch {
      return store.updateSkill(id, data);
    }
  },

  async deleteSkill(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) store.deleteSkill(id);
    } catch {
      store.deleteSkill(id);
    }
  }
};
