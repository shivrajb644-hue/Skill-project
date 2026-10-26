const ACTIVE_STUDENT_KEY = 'apexskill_active_student_id_v1';
const AUTH_USER_KEY = 'apexskill_auth_user_v1';
const ONBOARDING_KEY = 'apexskill_onboarding_v1';
const GAMIFICATION_KEY = 'apexskill_gamification_v1';
const DEV_SCORE_KEY = 'apexskill_dev_score_v1';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface OnboardingData {
  userType: 'student' | 'graduate' | 'professional';
  name: string;
  email?: string;
  college?: string;
  company?: string;
  year?: string;
  branch?: string;
  role?: string;
  experience?: string;
  educationLevel?: string;
  goals: string[];
  targetTimeline?: string;
  focusSkills: string[];
  englishLevel: 'beginner' | 'intermediate' | 'advanced';
  dailyTime: '15' | '30' | '45' | '60+';
  completedAt?: string;
  // Beginner-friendly personalisation fields (added for confidence-building journey)
  speakingConfidence?: 1 | 2 | 3 | 4 | 5; // 1 = very nervous, 5 = very confident
  primaryFear?: string; // e.g. "I blank out mid-sentence"
  isFresher?: boolean;  // true if college student/fresh graduate with no work experience
  speakingStage?: 'mirror' | 'ai_easy' | 'ai_standard' | 'interview_basic' | 'interview_advanced';
}

export const localSession = {
  getActiveStudentId(): string {
    if (typeof window === 'undefined') return 'demo-student-shivraj';
    return localStorage.getItem(ACTIVE_STUDENT_KEY) || 'demo-student-shivraj';
  },

  setActiveStudentId(studentId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVE_STUDENT_KEY, studentId);
  },

  // Auth
  getAuthUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  setAuthUser(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  clearAuthUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(ACTIVE_STUDENT_KEY);
  },

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(AUTH_USER_KEY);
  },

  // Onboarding
  getOnboarding(): OnboardingData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(ONBOARDING_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  setOnboarding(data: OnboardingData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
  },

  isOnboardingComplete(): boolean {
    if (typeof window === 'undefined') return false;
    const d = this.getOnboarding();
    return !!(d?.completedAt);
  },

  // Gamification
  getGamification(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  setGamification(data: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(data));
  },

  // Personal Development Score
  getDevScore(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(DEV_SCORE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  setDevScore(data: Record<string, unknown>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DEV_SCORE_KEY, JSON.stringify(data));
  },
};
