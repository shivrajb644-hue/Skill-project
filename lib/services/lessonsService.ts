import { createClient } from '../supabase/client';
import { store } from './store';
import { Lesson } from '../types';

export const lessonsService = {
  async getLessons(competencyId?: string): Promise<Lesson[]> {
    const supabase = createClient();
    try {
      let query = supabase.from('lessons').select('*').order('order_index', { ascending: true });
      if (competencyId) query = query.eq('competency_id', competencyId);

      const { data, error } = await query;
      if (error || !data || data.length === 0) return store.getLessons(competencyId);
      return data as Lesson[];
    } catch {
      return store.getLessons(competencyId);
    }
  },

  async createLesson(data: Omit<Lesson, 'id' | 'created_at'>): Promise<Lesson> {
    const supabase = createClient();
    try {
      const { data: created, error } = await supabase
        .from('lessons')
        .insert([data])
        .select()
        .single();

      if (error || !created) return store.createLesson(data);
      return created as Lesson;
    } catch {
      return store.createLesson(data);
    }
  },

  async updateLesson(id: string, data: Partial<Omit<Lesson, 'id' | 'created_at'>>): Promise<Lesson> {
    const supabase = createClient();
    try {
      const { data: updated, error } = await supabase
        .from('lessons')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error || !updated) return store.updateLesson(id, data);
      return updated as Lesson;
    } catch {
      return store.updateLesson(id, data);
    }
  },

  async deleteLesson(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) store.deleteLesson(id);
    } catch {
      store.deleteLesson(id);
    }
  }
};
