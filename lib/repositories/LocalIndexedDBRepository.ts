import { dbEngine } from '../storage/indexedDB';
import { ICurriculumRepository } from './ICurriculumRepository';
import { IStudentProgressRepository } from './IStudentProgressRepository';
import { Skill, Competency, LearningOutcome, Lesson, Activity, AssessmentItem } from '../types/curriculum';
import { LocalStudentProfile, LearningProfile, LearningPlanItem, PracticeAttempt } from '../types/student';

export class LocalIndexedDBRepository implements ICurriculumRepository, IStudentProgressRepository {
  
  // --- SKILLS ---
  async getSkills(): Promise<Skill[]> {
    return dbEngine.getAll<Skill>('skills');
  }

  async getSkillById(id: string): Promise<Skill | null> {
    return dbEngine.getById<Skill>('skills', id);
  }

  async createSkill(data: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
    const newSkill: Skill = {
      ...data,
      id: `skill-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    return dbEngine.put<Skill>('skills', newSkill);
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    const existing = await this.getSkillById(id);
    if (!existing) throw new Error('Skill not found');
    const updated = { ...existing, ...data };
    return dbEngine.put<Skill>('skills', updated);
  }

  async deleteSkill(id: string): Promise<void> {
    return dbEngine.delete('skills', id);
  }

  // --- COMPETENCIES ---
  async getCompetencies(skillId?: string): Promise<Competency[]> {
    const all = await dbEngine.getAll<Competency>('competencies');
    return skillId ? all.filter(c => c.skill_id === skillId) : all;
  }

  async createCompetency(data: Omit<Competency, 'id' | 'created_at'>): Promise<Competency> {
    const newComp: Competency = {
      ...data,
      id: `comp-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    return dbEngine.put<Competency>('competencies', newComp);
  }

  async updateCompetency(id: string, data: Partial<Competency>): Promise<Competency> {
    const all = await this.getCompetencies();
    const existing = all.find(c => c.id === id);
    if (!existing) throw new Error('Competency not found');
    const updated = { ...existing, ...data };
    return dbEngine.put<Competency>('competencies', updated);
  }

  async deleteCompetency(id: string): Promise<void> {
    return dbEngine.delete('competencies', id);
  }

  // --- OUTCOMES ---
  async getOutcomes(competencyId?: string): Promise<LearningOutcome[]> {
    const all = await dbEngine.getAll<LearningOutcome>('outcomes');
    return competencyId ? all.filter(o => o.competency_id === competencyId) : all;
  }

  async createOutcome(data: Omit<LearningOutcome, 'id' | 'created_at'>): Promise<LearningOutcome> {
    const newOutcome: LearningOutcome = {
      ...data,
      id: `out-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    return dbEngine.put<LearningOutcome>('outcomes', newOutcome);
  }

  // --- LESSONS ---
  async getLessons(competencyId?: string): Promise<Lesson[]> {
    const all = await dbEngine.getAll<Lesson>('lessons');
    return competencyId ? all.filter(l => l.competency_id === competencyId) : all;
  }

  async getLessonById(id: string): Promise<Lesson | null> {
    return dbEngine.getById<Lesson>('lessons', id);
  }

  async createLesson(data: Omit<Lesson, 'id' | 'created_at'>): Promise<Lesson> {
    const newLesson: Lesson = {
      ...data,
      id: `les-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    return dbEngine.put<Lesson>('lessons', newLesson);
  }

  async updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson> {
    const existing = await this.getLessonById(id);
    if (!existing) throw new Error('Lesson not found');
    const updated = { ...existing, ...data };
    return dbEngine.put<Lesson>('lessons', updated);
  }

  async deleteLesson(id: string): Promise<void> {
    return dbEngine.delete('lessons', id);
  }

  // --- ACTIVITIES ---
  async getActivities(lessonId?: string): Promise<Activity[]> {
    const all = await dbEngine.getAll<Activity>('activities');
    return lessonId ? all.filter(a => a.lesson_id === lessonId) : all;
  }

  async createActivity(data: Omit<Activity, 'id'>): Promise<Activity> {
    const newActivity: Activity = {
      ...data,
      id: `act-${Date.now()}`
    };
    return dbEngine.put<Activity>('activities', newActivity);
  }

  // --- ASSESSMENTS ---
  async getAssessmentItems(competencyId?: string): Promise<AssessmentItem[]> {
    const all = await dbEngine.getAll<AssessmentItem>('assessments');
    return competencyId ? all.filter(a => a.competency_id === competencyId) : all;
  }

  async createAssessmentItem(data: Omit<AssessmentItem, 'id'>): Promise<AssessmentItem> {
    const newItem: AssessmentItem = {
      ...data,
      id: `diag-${Date.now()}`
    };
    return dbEngine.put<AssessmentItem>('assessments', newItem);
  }

  // --- STUDENT PROFILES ---
  async getStudents(): Promise<LocalStudentProfile[]> {
    return dbEngine.getAll<LocalStudentProfile>('students');
  }

  async getStudentById(id: string): Promise<LocalStudentProfile | null> {
    return dbEngine.getById<LocalStudentProfile>('students', id);
  }

  async createStudent(data: Omit<LocalStudentProfile, 'id' | 'created_at'>): Promise<LocalStudentProfile> {
    const newStudent: LocalStudentProfile = {
      ...data,
      id: `student-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    return dbEngine.put<LocalStudentProfile>('students', newStudent);
  }

  async updateStudent(id: string, data: Partial<LocalStudentProfile>): Promise<LocalStudentProfile> {
    const existing = await this.getStudentById(id);
    if (!existing) throw new Error('Student not found');
    const updated = { ...existing, ...data };
    return dbEngine.put<LocalStudentProfile>('students', updated);
  }

  // --- LEARNING PROFILES ---
  async getLearningProfile(studentId: string, skillId: string): Promise<LearningProfile | null> {
    const all = await dbEngine.getAll<LearningProfile>('profiles');
    return all.find(p => p.student_id === studentId && p.skill_id === skillId) || null;
  }

  async saveLearningProfile(profile: LearningProfile): Promise<LearningProfile> {
    return dbEngine.put<LearningProfile>('profiles', profile);
  }

  // --- LEARNING PLANS ---
  async getLearningPlan(studentId: string, skillId: string): Promise<LearningPlanItem[]> {
    const all = await dbEngine.getAll<LearningPlanItem>('plans');
    return all
      .filter(p => p.student_id === studentId && p.skill_id === skillId)
      .sort((a, b) => a.scheduled_order - b.scheduled_order);
  }

  async saveLearningPlan(studentId: string, skillId: string, items: LearningPlanItem[]): Promise<LearningPlanItem[]> {
    for (const item of items) {
      await dbEngine.put<LearningPlanItem>('plans', item);
    }
    return items;
  }

  async updatePlanItemStatus(itemId: string, status: LearningPlanItem['status'], score?: number): Promise<void> {
    const item = await dbEngine.getById<LearningPlanItem>('plans', itemId);
    if (item) {
      item.status = status;
      if (score !== undefined) item.score = score;
      await dbEngine.put<LearningPlanItem>('plans', item);
    }
  }

  // --- PRACTICE ATTEMPTS ---
  async savePracticeAttempt(data: Omit<PracticeAttempt, 'id' | 'created_at'>): Promise<PracticeAttempt> {
    const attempt: PracticeAttempt = {
      ...data,
      id: `att-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    return dbEngine.put<PracticeAttempt>('attempts', attempt);
  }

  async getPracticeAttempts(studentId: string, lessonId?: string): Promise<PracticeAttempt[]> {
    const all = await dbEngine.getAll<PracticeAttempt>('attempts');
    return all.filter(a => a.student_id === studentId && (!lessonId || a.lesson_id === lessonId));
  }
}

export const repository = new LocalIndexedDBRepository();
