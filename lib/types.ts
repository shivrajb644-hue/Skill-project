export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string; // references User.id
  full_name: string;
  avatar_url?: string;
  bio?: string;
  target_role?: string;
  learning_goals?: string[];
  created_at: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  created_at: string;
}

export interface Competency {
  id: string;
  skill_id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  competency_id: string;
  title: string;
  content: string;
  duration_minutes: number;
  order_index: number;
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

export interface SkillWithDetails extends Skill {
  competencies: (Competency & {
    lessons: Lesson[];
  })[];
  enrolled_count?: number;
}
