export type SkillCategory = 'Speaking' | 'Communication' | 'Productivity' | 'Leadership';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type MediaContentType = 'text' | 'youtube' | 'link' | 'image' | 'pdf';

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  level: SkillLevel;
  icon: string;
  created_at: string;
}

export interface Competency {
  id: string;
  skill_id: string;
  title: string;
  description: string;
  order_index: number;
  weight_percentage?: number;
  created_at: string;
}

export interface LearningOutcome {
  id: string;
  competency_id: string;
  statement: string; // e.g. "Learner can apply the SCR framework to open presentations"
  description: string;
  mastery_threshold: number; // e.g. 80% score required for mastery
  created_at: string;
}

export interface MediaResource {
  id: string;
  type: MediaContentType;
  title: string;
  url: string; // YouTube embed URL, external resource link, or image URL
  description?: string;
}

export interface Activity {
  id: string;
  lesson_id: string;
  type: 'guided_practice' | 'independent_practice' | 'reflection';
  title: string;
  instruction: string;
  resources: MediaResource[];
  sample_answer?: string;
  rubric_criteria?: string[];
  order_index: number;
}

export interface AssessmentItem {
  id: string;
  competency_id: string;
  lesson_id?: string;
  type: 'multiple_choice' | 'open_prompt' | 'self_reflection';
  question: string;
  options?: string[];
  correct_option_index?: number;
  explanation: string;
  sub_skill_tag: string; // e.g. "Grammar", "Vocabulary", "Fluency", "Listening"
}

export interface Lesson {
  id: string;
  outcome_id: string;
  competency_id: string;
  title: string;
  objective: string;
  explanation_markdown: string;
  resources: MediaResource[];
  duration_minutes: number;
  order_index: number;
  created_at: string;
}

export interface CurriculumHierarchyNode extends Skill {
  competencies: (Competency & {
    outcomes: (LearningOutcome & {
      lessons: (Lesson & {
        activities: Activity[];
        assessment_items: AssessmentItem[];
      })[];
    })[];
  })[];
}
