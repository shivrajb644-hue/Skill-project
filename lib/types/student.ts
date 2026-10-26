import { SkillLevel } from './curriculum';

export type EducationLevel = 'School' | 'Diploma' | 'Undergraduate' | 'Postgraduate' | 'Graduate/Working';
export type StudentYear = '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Graduated' | 'N/A';

export interface SubSkillScore {
  name: string; // e.g. "Grammar", "Vocabulary", "Fluency", "Comprehension"
  score_percentage: number;
  status: 'needs_practice' | 'developing' | 'strong';
  evidence_count: number; // Number of questions evaluated
}

export interface LearningProfile {
  student_id: string;
  skill_id: string;
  overall_score: number;
  sub_skill_scores: SubSkillScore[];
  strengths: string[];
  weaknesses: string[];
  last_assessed_at: string;
}

export interface LocalStudentProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  education_level: EducationLevel;
  year: StudentYear;
  primary_skill_id: string;
  goal: string;
  target_role?: string;
  selected_skill_ids: string[];
  created_at: string;
}

export interface LearningPlanItem {
  id: string;
  student_id: string;
  skill_id: string;
  lesson_id: string;
  competency_id: string;
  day_number: number;
  title: string;
  objective: string;
  reason_for_recommendation: string; // e.g. "Focus Area: Strengthen Vocabulary (42%)"
  status: 'pending' | 'in_progress' | 'completed' | 'revision_recommended';
  score?: number;
  scheduled_order: number;
}

export interface PracticeAttempt {
  id: string;
  student_id: string;
  activity_id: string;
  lesson_id: string;
  student_response: string;
  feedback: string;
  self_rating: number; // 1 to 5
  created_at: string;
}

export interface DailySessionData {
  lesson_id: string;
  skill_id: string;
  competency_id: string;
  objective: string;
  explanation: string;
  resources: any[];
  guided_practice?: any;
  independent_practice?: any;
  assessment_items: any[];
}
