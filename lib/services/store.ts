import { User, Student, Skill, Competency, Lesson, StudentEnrollment, StudentProgress, UserRole, SkillWithDetails } from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_SKILLS,
  INITIAL_COMPETENCIES,
  INITIAL_LESSONS,
  INITIAL_ENROLLMENTS,
  INITIAL_PROGRESS
} from '../seed-data';

const STORAGE_KEYS = {
  USERS: 'soft_skills_users_v1',
  STUDENTS: 'soft_skills_students_v1',
  SKILLS: 'soft_skills_skills_v1',
  COMPETENCIES: 'soft_skills_competencies_v1',
  LESSONS: 'soft_skills_lessons_v1',
  ENROLLMENTS: 'soft_skills_enrollments_v1',
  PROGRESS: 'soft_skills_progress_v1',
  CURRENT_USER: 'soft_skills_current_user_v1',
};

class DataStore {
  private isClient = typeof window !== 'undefined';

  private getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  constructor() {
    if (this.isClient) {
      this.initSeedData();
    }
  }

  public initSeedData(forceReset = false) {
    if (!this.isClient) return;
    if (forceReset || !localStorage.getItem(STORAGE_KEYS.SKILLS)) {
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
      this.setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
      this.setItem(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
      this.setItem(STORAGE_KEYS.COMPETENCIES, INITIAL_COMPETENCIES);
      this.setItem(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
      this.setItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
      this.setItem(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    }
  }

  // --- AUTH / SESSION ---
  public getCurrentUser(): User | null {
    return this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }

  public getCurrentStudent(): Student | null {
    const user = this.getCurrentUser();
    if (!user) return INITIAL_STUDENTS[0];
    const students = this.getStudents();
    return students.find(s => s.id === user.id) || INITIAL_STUDENTS[0];
  }

  public setCurrentUser(user: User | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  public getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getStudents(): Student[] {
    return this.getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }

  public registerStudent(email: string, fullName: string, targetRole?: string, bio?: string): { user: User; student: Student } {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }

    const userId = `usr-${Date.now()}`;
    const newUser: User = {
      id: userId,
      email: email.trim(),
      role: 'student',
      created_at: new Date().toISOString()
    };

    const newStudent: Student = {
      id: userId,
      full_name: fullName.trim(),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      bio: bio || 'Enthusiastic learner focusing on soft skill mastery.',
      target_role: targetRole || 'Professional',
      learning_goals: ['Executive Communication', 'Strategic Leadership'],
      created_at: new Date().toISOString()
    };

    this.setItem(STORAGE_KEYS.USERS, [...users, newUser]);
    const students = this.getStudents();
    this.setItem(STORAGE_KEYS.STUDENTS, [...students, newStudent]);
    this.setCurrentUser(newUser);

    return { user: newUser, student: newStudent };
  }

  public login(email: string, role: UserRole): User {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      if (email.toLowerCase() === 'admin@platform.com' || role === 'admin') {
        const adminUser: User = {
          id: '99999999-9999-9999-9999-999999999999',
          email: 'admin@platform.com',
          role: 'admin',
          created_at: new Date().toISOString()
        };
        this.setItem(STORAGE_KEYS.USERS, [...users.filter(u => u.id !== adminUser.id), adminUser]);
        this.setCurrentUser(adminUser);
        return adminUser;
      }
      throw new Error('User not found. Please check your email or register a new account.');
    }

    if (user.role !== role) {
      throw new Error(`Account exists but is registered as a ${user.role}, not ${role}.`);
    }

    this.setCurrentUser(user);
    return user;
  }

  public logout(): void {
    if (this.isClient) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // --- SKILLS CRUD ---
  public getSkills(): Skill[] {
    return this.getItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  }

  public getSkillById(id: string): SkillWithDetails | null {
    const skill = this.getSkills().find(s => s.id === id);
    if (!skill) return null;

    const competencies = this.getCompetencies(skill.id);
    const competenciesWithLessons = competencies.map(c => ({
      ...c,
      lessons: this.getLessons(c.id).sort((a, b) => a.order_index - b.order_index)
    })).sort((a, b) => a.order_index - b.order_index);

    const enrollments = this.getEnrollments().filter(e => e.skill_id === id);

    return {
      ...skill,
      competencies: competenciesWithLessons,
      enrolled_count: enrollments.length
    };
  }

  public createSkill(data: Omit<Skill, 'id' | 'created_at'>): Skill {
    const skills = this.getSkills();
    const newSkill: Skill = {
      ...data,
      id: `skill-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.setItem(STORAGE_KEYS.SKILLS, [newSkill, ...skills]);
    return newSkill;
  }

  public updateSkill(id: string, data: Partial<Omit<Skill, 'id' | 'created_at'>>): Skill {
    const skills = this.getSkills();
    const index = skills.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Skill not found');
    const updated = { ...skills[index], ...data };
    skills[index] = updated;
    this.setItem(STORAGE_KEYS.SKILLS, skills);
    return updated;
  }

  public deleteSkill(id: string): void {
    const skills = this.getSkills().filter(s => s.id !== id);
    this.setItem(STORAGE_KEYS.SKILLS, skills);
    const compsToDelete = this.getCompetencies().filter(c => c.skill_id === id).map(c => c.id);
    const competencies = this.getCompetencies().filter(c => c.skill_id !== id);
    this.setItem(STORAGE_KEYS.COMPETENCIES, competencies);
    const lessons = this.getLessons().filter(l => !compsToDelete.includes(l.competency_id));
    this.setItem(STORAGE_KEYS.LESSONS, lessons);
  }

  // --- COMPETENCIES CRUD ---
  public getCompetencies(skillId?: string): Competency[] {
    const competencies = this.getItem<Competency[]>(STORAGE_KEYS.COMPETENCIES, INITIAL_COMPETENCIES);
    return skillId ? competencies.filter(c => c.skill_id === skillId) : competencies;
  }

  public createCompetency(data: Omit<Competency, 'id' | 'created_at'>): Competency {
    const competencies = this.getCompetencies();
    const newComp: Competency = {
      ...data,
      id: `comp-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.setItem(STORAGE_KEYS.COMPETENCIES, [...competencies, newComp]);
    return newComp;
  }

  public updateCompetency(id: string, data: Partial<Omit<Competency, 'id' | 'created_at'>>): Competency {
    const competencies = this.getCompetencies();
    const index = competencies.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Competency not found');
    const updated = { ...competencies[index], ...data };
    competencies[index] = updated;
    this.setItem(STORAGE_KEYS.COMPETENCIES, competencies);
    return updated;
  }

  public deleteCompetency(id: string): void {
    const competencies = this.getCompetencies().filter(c => c.id !== id);
    this.setItem(STORAGE_KEYS.COMPETENCIES, competencies);
    const lessons = this.getLessons().filter(l => l.competency_id !== id);
    this.setItem(STORAGE_KEYS.LESSONS, lessons);
  }

  // --- LESSONS CRUD ---
  public getLessons(competencyId?: string): Lesson[] {
    const lessons = this.getItem<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    return competencyId ? lessons.filter(l => l.competency_id === competencyId) : lessons;
  }

  public createLesson(data: Omit<Lesson, 'id' | 'created_at'>): Lesson {
    const lessons = this.getLessons();
    const newLesson: Lesson = {
      ...data,
      id: `lesson-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.setItem(STORAGE_KEYS.LESSONS, [...lessons, newLesson]);
    return newLesson;
  }

  public updateLesson(id: string, data: Partial<Omit<Lesson, 'id' | 'created_at'>>): Lesson {
    const lessons = this.getLessons();
    const index = lessons.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lesson not found');
    const updated = { ...lessons[index], ...data };
    lessons[index] = updated;
    this.setItem(STORAGE_KEYS.LESSONS, lessons);
    return updated;
  }

  public deleteLesson(id: string): void {
    const lessons = this.getLessons().filter(l => l.id !== id);
    this.setItem(STORAGE_KEYS.LESSONS, lessons);
  }

  // --- ENROLLMENTS & PROGRESS ---
  public getEnrollments(studentId?: string): StudentEnrollment[] {
    const enrollments = this.getItem<StudentEnrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    return studentId ? enrollments.filter(e => e.student_id === studentId) : enrollments;
  }

  public enrollStudent(studentId: string, skillId: string): StudentEnrollment {
    const enrollments = this.getEnrollments();
    const existing = enrollments.find(e => e.student_id === studentId && e.skill_id === skillId);
    if (existing) return existing;

    const newEnrollment: StudentEnrollment = {
      id: `enr-${Date.now()}`,
      student_id: studentId,
      skill_id: skillId,
      status: 'active',
      enrolled_at: new Date().toISOString()
    };

    this.setItem(STORAGE_KEYS.ENROLLMENTS, [...enrollments, newEnrollment]);
    return newEnrollment;
  }

  public getStudentProgress(studentId: string): StudentProgress[] {
    const progressList = this.getItem<StudentProgress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    return progressList.filter(p => p.student_id === studentId);
  }

  public updateProgress(studentId: string, lessonId: string, status: 'not_started' | 'in_progress' | 'completed'): StudentProgress {
    const progressList = this.getItem<StudentProgress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    const existingIndex = progressList.findIndex(p => p.student_id === studentId && p.lesson_id === lessonId);

    let updatedRecord: StudentProgress;

    if (existingIndex >= 0) {
      updatedRecord = {
        ...progressList[existingIndex],
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : undefined
      };
      progressList[existingIndex] = updatedRecord;
    } else {
      updatedRecord = {
        id: `prog-${Date.now()}`,
        student_id: studentId,
        lesson_id: lessonId,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : undefined
      };
      progressList.push(updatedRecord);
    }

    this.setItem(STORAGE_KEYS.PROGRESS, progressList);
    return updatedRecord;
  }
}

export const store = new DataStore();
