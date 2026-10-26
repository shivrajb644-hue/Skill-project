import { 
  Skill, Competency, LearningOutcome, Lesson, Activity, AssessmentItem 
} from '../types/curriculum';
import { 
  LocalStudentProfile, LearningProfile, LearningPlanItem, PracticeAttempt 
} from '../types/student';
import { 
  SEED_SKILLS, SEED_COMPETENCIES, SEED_OUTCOMES, SEED_LESSONS, SEED_ACTIVITIES, SEED_DIAGNOSTIC_ASSESSMENTS 
} from '../seed-data/curriculumSeed';
import { 
  SEED_DEMO_STUDENTS, SEED_DEMO_PROFILES 
} from '../seed-data/studentSeed';

const DB_NAME = 'ApexSkill_LocalMVP_DB_v1';
const DB_VERSION = 2; // Bumped for new stores

export class LocalIndexedDBEngine {
  private db: IDBDatabase | null = null;

  public async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (typeof window === 'undefined') {
      throw new Error('IndexedDB requires a browser environment');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Core curriculum stores
        if (!db.objectStoreNames.contains('skills')) db.createObjectStore('skills', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('competencies')) db.createObjectStore('competencies', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('outcomes')) db.createObjectStore('outcomes', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('lessons')) db.createObjectStore('lessons', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('activities')) db.createObjectStore('activities', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('assessments')) db.createObjectStore('assessments', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('students')) db.createObjectStore('students', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('profiles')) db.createObjectStore('profiles', { keyPath: 'student_id' });
        if (!db.objectStoreNames.contains('plans')) db.createObjectStore('plans', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('attempts')) db.createObjectStore('attempts', { keyPath: 'id' });

        // NEW v2 stores
        if (!db.objectStoreNames.contains('speaking_attempts')) db.createObjectStore('speaking_attempts', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('interview_sessions')) db.createObjectStore('interview_sessions', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('conversation_sessions')) db.createObjectStore('conversation_sessions', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('daily_challenges')) db.createObjectStore('daily_challenges', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('gamification')) db.createObjectStore('gamification', { keyPath: 'student_id' });
        if (!db.objectStoreNames.contains('skill_score_history')) db.createObjectStore('skill_score_history', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('dev_scores')) db.createObjectStore('dev_scores', { keyPath: 'student_id' });
        if (!db.objectStoreNames.contains('user_achievements')) db.createObjectStore('user_achievements', { keyPath: 'achievement_id' });
      };

      request.onsuccess = async (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        await this.seedInitialData();
        resolve(this.db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async seedInitialData(): Promise<void> {
    const skills = await this.getAll<Skill>('skills');
    if (skills.length === 0) {
      for (const s of SEED_SKILLS) await this.put('skills', s);
      for (const c of SEED_COMPETENCIES) await this.put('competencies', c);
      for (const o of SEED_OUTCOMES) await this.put('outcomes', o);
      for (const l of SEED_LESSONS) await this.put('lessons', l);
      for (const a of SEED_ACTIVITIES) await this.put('activities', a);
      for (const item of SEED_DIAGNOSTIC_ASSESSMENTS) await this.put('assessments', item);
      for (const st of SEED_DEMO_STUDENTS) await this.put('students', st);
      for (const p of SEED_DEMO_PROFILES) await this.put('profiles', p);
    }
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async getById<T>(storeName: string, key: string): Promise<T | null> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  public async put<T>(storeName: string, value: T): Promise<T> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve(value);
      req.onerror = () => reject(req.error);
    });
  }

  public async delete(storeName: string, key: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

export const dbEngine = new LocalIndexedDBEngine();
