export * from './curriculum';
export * from './student';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  target_role?: string;
  learning_goals?: string[];
  created_at: string;
}

export interface StudentEnrollment {
  id: string;
  student_id: string;
  skill_id: string;
  status: 'active' | 'completed' | 'paused';
  enrolled_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
}
