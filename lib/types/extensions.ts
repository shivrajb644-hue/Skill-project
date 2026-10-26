// Extended type definitions for platform v2

export interface SkillScoreHistory {
  id: string;
  student_id: string;
  skill_name: string;
  score: number;
  recorded_at: string; // ISO date
}

export interface DailyChallenge {
  id: string;
  student_id: string;
  title: string;
  description: string;
  skill_focus: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  challenge_type: 'speaking' | 'writing' | 'scenario' | 'vocabulary' | 'reflection';
  prompt: string;
  completed: boolean;
  score?: number;
  date: string; // YYYY-MM-DD
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  category: string;
  xp_reward: number;
  condition: string;
}

export interface UserAchievement {
  achievement_id: string;
  student_id: string;
  unlocked_at: string;
}

export interface SpeakingAttempt {
  id: string;
  student_id: string;
  topic: string;
  transcript: string;
  duration_seconds: number;
  word_count: number;
  filler_word_count: number;
  words_per_minute: number;
  scores: {
    fluency: number;
    structure: number;
    vocabulary: number;
    grammar: number;
    confidence: number;
  };
  overall_score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  evidence: string;
  improved_response: string;
  next_activity: string;
  created_at: string;
}

export interface InterviewAnswer {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  improved_answer: string;
  scores: {
    relevance: number;
    structure: number;
    vocabulary: number;
    grammar: number;
    star_usage: number;
  };
}

export interface InterviewSession {
  id: string;
  student_id: string;
  interview_type: 'hr' | 'behavioral' | 'situational' | 'fresher' | 'technical';
  company_type?: 'startup' | 'mnc' | 'government' | 'psu';
  difficulty?: 'entry' | 'mid' | 'senior';
  questions: InterviewAnswer[];
  overall_score: number;
  scores?: {
    communication: number;
    structure: number;
    relevance: number;
    vocabulary: number;
    confidence: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  recommended_practice?: string;
  completed: boolean;
  created_at: string;
}

export interface ConversationMessage {
  role: 'ai' | 'user' | 'coach';
  content: string;
  timestamp: string;
  coach_note?: string;
}

export interface ConversationSession {
  id: string;
  student_id: string;
  scenario: string;
  ai_persona: string;
  mode: 'simulation' | 'coaching';
  messages: ConversationMessage[];
  overall_score?: number;
  scores?: {
    clarity: number;
    professionalism: number;
    empathy: number;
    assertiveness: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  key_moments?: string[];
  completed: boolean;
  created_at: string;
}

export interface GamificationProfile {
  student_id: string;
  xp: number;
  streak: number;
  longest_streak: number;
  total_sessions: number;
  last_practice_date: string | null;
  unlocked_achievement_ids: string[];
  updated_at: string;
}

export interface ResumeAnalysis {
  id: string;
  student_id: string;
  resume_text: string;
  overall_score: number;
  sections: {
    contact_info: { score: number; issues: string[] };
    summary: { score: number; issues: string[] };
    experience: { score: number; issues: string[] };
    education: { score: number; issues: string[] };
    skills: { score: number; issues: string[] };
  };
  strengths: string[];
  weaknesses: string[];
  action_items: string[];
  created_at: string;
}

// 9-Dimension Personal Development Score
export interface PersonalDevelopmentScore {
  student_id: string;
  communication: number;
  speaking: number;
  english: number;
  confidence: number;
  listening: number;
  presentation: number;
  leadership: number;
  emotional_intelligence: number;
  career_readiness: number;
  overall_index: number;
  strengths: string[];
  development_areas: string[];
  priority_areas: string[];
  assessed_at: string;
}

export const SKILL_DIMENSION_LABELS: Record<string, string> = {
  communication: 'Communication',
  speaking: 'Speaking',
  english: 'English',
  confidence: 'Confidence',
  listening: 'Listening',
  presentation: 'Presentation',
  leadership: 'Leadership',
  emotional_intelligence: 'Emotional Intelligence',
  career_readiness: 'Career Readiness',
};

export const SKILL_DIMENSION_ICONS: Record<string, string> = {
  communication: '💬',
  speaking: '🎙️',
  english: '📚',
  confidence: '💪',
  listening: '👂',
  presentation: '📊',
  leadership: '👑',
  emotional_intelligence: '🧠',
  career_readiness: '🚀',
};

export const SKILL_DIMENSION_COLORS: Record<string, string> = {
  communication: '#3b82f6',
  speaking: '#8b5cf6',
  english: '#06b6d4',
  confidence: '#f59e0b',
  listening: '#10b981',
  presentation: '#ec4899',
  leadership: '#f97316',
  emotional_intelligence: '#a78bfa',
  career_readiness: '#34d399',
};
