import { z } from 'zod';

export const SpeechMetricsSchema = z.object({
  wpm: z.number(),
  filler_words_count: z.number(),
  pauses_count: z.number(),
});

export const EvaluationSchema = z.object({
  overall_score: z.number().min(0).max(100),
  scores: z.record(z.string(), z.number()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  evidence: z.array(z.string()),
  improved_response: z.string(),
  next_activity: z.string().optional(),
});

export const SpeakingFeedbackSchema = EvaluationSchema.extend({
  metrics: SpeechMetricsSchema.optional(),
});

export const InterviewFeedbackSchema = EvaluationSchema.extend({
  framework_analysis: z.object({
    situation: z.boolean(),
    task: z.boolean(),
    action: z.boolean(),
    result: z.boolean(),
  }).optional(),
});

export const ConversationFeedbackSchema = z.object({
  fluency_score: z.number(),
  grammar_score: z.number(),
  vocabulary_score: z.number(),
  corrections: z.array(
    z.object({
      original: z.string(),
      corrected: z.string(),
      explanation: z.string(),
    })
  ),
}).optional();

export const ConversationTurnSchema = z.object({
  ai_response: z.string(),
  feedback: ConversationFeedbackSchema,
  suggested_replies: z.array(z.string()),
  is_scenario_complete: z.boolean(),
});

export const DailyChallengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['speaking', 'writing', 'scenario', 'vocabulary', 'reflection']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  time_estimate_minutes: z.number(),
  success_criteria: z.array(z.string()),
  prompt: z.string().optional(),
});

export const AssessmentScoreSchema = z.object({
  category: z.string(),
  overall_score: z.number().min(0).max(100),
  detailed_scores: z.record(z.string(), z.number()),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']),
  recommended_modules: z.array(z.string()),
  summary: z.string(),
});
