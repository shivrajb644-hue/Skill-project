import { createClient } from '../supabase/client';
import { store } from './store';
import { User, Student, UserRole } from '../types';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const supabase = createClient();
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return store.getCurrentUser();

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        role: profile?.role || 'student',
        created_at: user.created_at
      };
    } catch {
      return store.getCurrentUser();
    }
  },

  async getCurrentStudent(): Promise<Student | null> {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return store.getCurrentStudent();

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return store.getCurrentStudent();

      return {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        target_role: profile.target_role,
        learning_goals: typeof profile.learning_goals === 'string' ? JSON.parse(profile.learning_goals) : profile.learning_goals,
        created_at: profile.created_at
      };
    } catch {
      return store.getCurrentStudent();
    }
  },

  async getAllStudents(): Promise<Student[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (error || !data || data.length === 0) return store.getStudents();

      return data.map(profile => ({
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        target_role: profile.target_role,
        learning_goals: typeof profile.learning_goals === 'string' ? JSON.parse(profile.learning_goals) : profile.learning_goals,
        created_at: profile.created_at
      }));
    } catch {
      return store.getStudents();
    }
  },

  async registerStudent(email: string, password?: string, fullName?: string, targetRole?: string, bio?: string): Promise<{ user: User; student: Student }> {
    const supabase = createClient();
    const pwd = password || 'Password123!';
    const name = fullName || email.split('@')[0];

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pwd,
        options: {
          data: {
            full_name: name,
            role: 'student',
            target_role: targetRole || 'Senior Professional',
            bio: bio || 'Soft skills enthusiast',
            learning_goals: ['Executive Communication', 'Strategic Leadership']
          }
        }
      });

      if (error) {
        // Fallback to local store if Supabase network fails or credentials are placeholder
        return store.registerStudent(email, name, targetRole, bio);
      }

      const registeredUser: User = {
        id: data.user?.id || `usr-${Date.now()}`,
        email: email.trim(),
        role: 'student',
        created_at: new Date().toISOString()
      };

      const registeredStudent: Student = {
        id: registeredUser.id,
        full_name: name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        bio: bio || 'Soft skills enthusiast',
        target_role: targetRole || 'Senior Professional',
        learning_goals: ['Executive Communication', 'Strategic Leadership'],
        created_at: new Date().toISOString()
      };

      return { user: registeredUser, student: registeredStudent };
    } catch {
      return store.registerStudent(email, name, targetRole, bio);
    }
  },

  async login(email: string, password?: string, role: UserRole = 'student'): Promise<User> {
    const supabase = createClient();
    const pwd = password || 'Password123!';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pwd
      });

      if (error || !data.user) {
        return store.login(email, role);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      return {
        id: data.user.id,
        email: data.user.email || email,
        role: (profile?.role as UserRole) || role,
        created_at: data.user.created_at
      };
    } catch {
      return store.login(email, role);
    }
  },

  async logout(): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    store.logout();
  }
};
