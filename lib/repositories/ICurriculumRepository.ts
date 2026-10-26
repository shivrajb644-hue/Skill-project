import { Skill, Competency, LearningOutcome, Lesson, Activity, AssessmentItem } from '../types/curriculum';

export interface ICurriculumRepository {
  // Skills
  getSkills(): Promise<Skill[]>;
  getSkillById(id: string): Promise<Skill | null>;
  createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill>;
  updateSkill(id: string, skill: Partial<Skill>): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;

  // Competencies
  getCompetencies(skillId?: string): Promise<Competency[]>;
  createCompetency(competency: Omit<Competency, 'id' | 'created_at'>): Promise<Competency>;
  updateCompetency(id: string, competency: Partial<Competency>): Promise<Competency>;
  deleteCompetency(id: string): Promise<void>;

  // Outcomes
  getOutcomes(competencyId?: string): Promise<LearningOutcome[]>;
  createOutcome(outcome: Omit<LearningOutcome, 'id' | 'created_at'>): Promise<LearningOutcome>;

  // Lessons
  getLessons(competencyId?: string): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | null>;
  createLesson(lesson: Omit<Lesson, 'id' | 'created_at'>): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<Lesson>): Promise<Lesson>;
  deleteLesson(id: string): Promise<void>;

  // Activities
  getActivities(lessonId?: string): Promise<Activity[]>;
  createActivity(activity: Omit<Activity, 'id'>): Promise<Activity>;

  // Assessment Items
  getAssessmentItems(competencyId?: string): Promise<AssessmentItem[]>;
  createAssessmentItem(item: Omit<AssessmentItem, 'id'>): Promise<AssessmentItem>;
}
