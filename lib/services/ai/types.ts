export interface SpeechMetrics {
  wpm: number;
  filler_words_count: number;
  pauses_count: number;
}

export interface EvaluationResult {
  overall_score: number;
  scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  evidence: string[];
  improved_response: string;
  next_activity?: string;
}

export interface SpeakingFeedback extends EvaluationResult {
  metrics?: SpeechMetrics;
}

export interface InterviewFeedback extends EvaluationResult {
  framework_analysis?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
}

export interface ConversationFeedback {
  fluency_score: number;
  grammar_score: number;
  vocabulary_score: number;
  corrections: Array<{ original: string; corrected: string; explanation: string }>;
}

export interface ConversationTurn {
  ai_response: string;
  feedback?: ConversationFeedback; // optional — only populated in coaching mode
  suggested_replies: string[];
  is_scenario_complete: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'speaking' | 'writing' | 'scenario' | 'vocabulary' | 'reflection';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_estimate_minutes: number;
  success_criteria: string[];
  prompt?: string;
}

export interface AssessmentScore {
  category: string;
  overall_score: number;
  detailed_scores: Record<string, number>;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  recommended_modules: string[];
  summary: string;
}

export interface LearningPlan {
  current_level: string;
  target_level: string;
  estimated_weeks: number;
  weekly_commitments: Array<{
    activity_type: string;
    duration_minutes: number;
  }>;
  milestones: Array<{
    week: number;
    goal: string;
  }>;
}
