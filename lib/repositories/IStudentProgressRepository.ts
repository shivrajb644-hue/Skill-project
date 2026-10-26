import { LocalStudentProfile, LearningProfile, LearningPlanItem, PracticeAttempt } from '../types/student';

export interface IStudentProgressRepository {
  // Profiles
  getStudents(): Promise<LocalStudentProfile[]>;
  getStudentById(id: string): Promise<LocalStudentProfile | null>;
  createStudent(student: Omit<LocalStudentProfile, 'id' | 'created_at'>): Promise<LocalStudentProfile>;
  updateStudent(id: string, data: Partial<LocalStudentProfile>): Promise<LocalStudentProfile>;

  // Learning Profiles (Diagnostic & Sub-skill Breakdown)
  getLearningProfile(studentId: string, skillId: string): Promise<LearningProfile | null>;
  saveLearningProfile(profile: LearningProfile): Promise<LearningProfile>;

  // Learning Plans
  getLearningPlan(studentId: string, skillId: string): Promise<LearningPlanItem[]>;
  saveLearningPlan(studentId: string, skillId: string, items: LearningPlanItem[]): Promise<LearningPlanItem[]>;
  updatePlanItemStatus(itemId: string, status: LearningPlanItem['status'], score?: number): Promise<void>;

  // Practice Attempts
  savePracticeAttempt(attempt: Omit<PracticeAttempt, 'id' | 'created_at'>): Promise<PracticeAttempt>;
  getPracticeAttempts(studentId: string, lessonId?: string): Promise<PracticeAttempt[]>;
}
