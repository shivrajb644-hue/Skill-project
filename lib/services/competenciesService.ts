import { createClient } from '../supabase/client';
import { store } from './store';
import { Competency } from '../types';

export const competenciesService = {
  async getCompetencies(skillId?: string): Promise<Competency[]> {
    const supabase = createClient();
    try {
      let query = supabase.from('competencies').select('*').order('order_index', { ascending: true });
      if (skillId) query = query.eq('skill_id', skillId);

      const { data, error } = await query;
      if (error || !data || data.length === 0) return store.getCompetencies(skillId);
      return data as Competency[];
    } catch {
      return store.getCompetencies(skillId);
    }
  },

  async createCompetency(data: Omit<Competency, 'id' | 'created_at'>): Promise<Competency> {
    const supabase = createClient();
    try {
      const { data: created, error } = await supabase
        .from('competencies')
        .insert([data])
        .select()
        .single();

      if (error || !created) return store.createCompetency(data);
      return created as Competency;
    } catch {
      return store.createCompetency(data);
    }
  },

  async updateCompetency(id: string, data: Partial<Omit<Competency, 'id' | 'created_at'>>): Promise<Competency> {
    const supabase = createClient();
    try {
      const { data: updated, error } = await supabase
        .from('competencies')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error || !updated) return store.updateCompetency(id, data);
      return updated as Competency;
    } catch {
      return store.updateCompetency(id, data);
    }
  },

  async deleteCompetency(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('competencies')
        .delete()
        .eq('id', id);

      if (error) store.deleteCompetency(id);
    } catch {
      store.deleteCompetency(id);
    }
  }
};
