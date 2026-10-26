// Gamification Engine — XP, Levels, Streaks, Achievements

export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'skill' | 'practice' | 'special';
  xpReward: number;
  condition: {
    type: 'assessment_count' | 'streak_days' | 'skill_score' | 'practice_count' | 'improvement' | 'session_count';
    threshold: number;
    skill?: string;
  };
}

export interface GamificationState {
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  longestStreak: number;
  totalSessions: number;
  unlockedAchievementIds: string[];
  lastPracticeDate: string | null;
  xpToNextLevel: number;
  xpInCurrentLevel: number;
  levelProgress: number; // 0-100
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Starter', minXP: 0, maxXP: 200, color: '#64748b' },
  { level: 2, name: 'Explorer', minXP: 200, maxXP: 500, color: '#3b82f6' },
  { level: 3, name: 'Developing', minXP: 500, maxXP: 1000, color: '#8b5cf6' },
  { level: 4, name: 'Communicator', minXP: 1000, maxXP: 1800, color: '#06b6d4' },
  { level: 5, name: 'Proficient', minXP: 1800, maxXP: 3000, color: '#10b981' },
  { level: 6, name: 'Advanced Speaker', minXP: 3000, maxXP: 5000, color: '#f59e0b' },
  { level: 7, name: 'Expert Communicator', minXP: 5000, maxXP: 8000, color: '#ef4444' },
  { level: 8, name: 'Master', minXP: 8000, maxXP: 999999, color: '#f97316' },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Complete your first assessment',
    icon: '🎯',
    category: 'milestone',
    xpReward: 50,
    condition: { type: 'assessment_count', threshold: 1 },
  },
  {
    id: 'voice-debut',
    name: 'Voice Debut',
    description: 'Complete your first speaking practice',
    icon: '🎙️',
    category: 'practice',
    xpReward: 75,
    condition: { type: 'practice_count', threshold: 1, skill: 'speaking' },
  },
  {
    id: 'interview-rookie',
    name: 'Interview Rookie',
    description: 'Complete your first mock interview',
    icon: '💼',
    category: 'practice',
    xpReward: 100,
    condition: { type: 'practice_count', threshold: 1, skill: 'interview' },
  },
  {
    id: 'consistent-learner',
    name: 'Consistent Learner',
    description: 'Maintain a 7-day practice streak',
    icon: '🔥',
    category: 'streak',
    xpReward: 150,
    condition: { type: 'streak_days', threshold: 7 },
  },
  {
    id: 'fortnight-fire',
    name: 'Fortnight Fire',
    description: 'Maintain a 14-day practice streak',
    icon: '⚡',
    category: 'streak',
    xpReward: 300,
    condition: { type: 'streak_days', threshold: 14 },
  },
  {
    id: 'month-mastery',
    name: 'Month Mastery',
    description: 'Maintain a 30-day practice streak',
    icon: '🏆',
    category: 'streak',
    xpReward: 600,
    condition: { type: 'streak_days', threshold: 30 },
  },
  {
    id: 'confidence-builder',
    name: 'Confidence Builder',
    description: 'Reach a speaking score of 70 or above',
    icon: '💪',
    category: 'skill',
    xpReward: 200,
    condition: { type: 'skill_score', threshold: 70, skill: 'speaking' },
  },
  {
    id: 'interview-ready',
    name: 'Interview Ready',
    description: 'Complete 3 mock interview sessions',
    icon: '🎯',
    category: 'practice',
    xpReward: 200,
    condition: { type: 'practice_count', threshold: 3, skill: 'interview' },
  },
  {
    id: 'conversation-master',
    name: 'Conversation Master',
    description: 'Complete 5 conversation coaching sessions',
    icon: '💬',
    category: 'practice',
    xpReward: 175,
    condition: { type: 'practice_count', threshold: 5, skill: 'conversation' },
  },
  {
    id: 'fast-riser',
    name: 'Fast Riser',
    description: 'Improve any skill score by 20+ points',
    icon: '📈',
    category: 'milestone',
    xpReward: 250,
    condition: { type: 'improvement', threshold: 20 },
  },
  {
    id: 'vocabulary-builder',
    name: 'Word Wizard',
    description: 'Complete 10 English practice sessions',
    icon: '📚',
    category: 'practice',
    xpReward: 150,
    condition: { type: 'practice_count', threshold: 10, skill: 'english' },
  },
  {
    id: 'presentation-pro',
    name: 'Presentation Pro',
    description: 'Reach a presentation skill score of 75',
    icon: '🎤',
    category: 'skill',
    xpReward: 200,
    condition: { type: 'skill_score', threshold: 75, skill: 'presentation' },
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Complete 100 total practice sessions',
    icon: '💯',
    category: 'milestone',
    xpReward: 500,
    condition: { type: 'session_count', threshold: 100 },
  },
  {
    id: 'leadership-learner',
    name: 'Leadership Learner',
    description: 'Complete 5 leadership & EI modules',
    icon: '👑',
    category: 'practice',
    xpReward: 200,
    condition: { type: 'practice_count', threshold: 5, skill: 'leadership' },
  },
  {
    id: 'career-catalyst',
    name: 'Career Catalyst',
    description: 'Complete the career readiness assessment',
    icon: '🚀',
    category: 'milestone',
    xpReward: 150,
    condition: { type: 'assessment_count', threshold: 2 },
  },
];

export const XP_REWARDS = {
  COMPLETE_ASSESSMENT: 100,
  COMPLETE_LESSON: 30,
  COMPLETE_SPEAKING: 50,
  COMPLETE_INTERVIEW: 75,
  COMPLETE_CONVERSATION: 40,
  DAILY_CHALLENGE: 60,
  PERFECT_SCORE: 100, // bonus for score >= 90
  STREAK_BONUS: 20, // per day of streak maintained
};

export function getLevelForXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function calculateGamificationState(
  xp: number,
  streak: number,
  longestStreak: number,
  totalSessions: number,
  unlockedAchievementIds: string[],
  lastPracticeDate: string | null
): GamificationState {
  const level = getLevelForXP(xp);
  const nextLevel = LEVELS.find(l => l.level === level.level + 1);
  const xpInCurrentLevel = xp - level.minXP;
  const xpToNextLevel = nextLevel ? nextLevel.minXP - xp : 0;
  const levelRange = nextLevel ? nextLevel.minXP - level.minXP : 1;
  const levelProgress = nextLevel ? Math.round((xpInCurrentLevel / levelRange) * 100) : 100;

  return {
    xp,
    level: level.level,
    levelName: level.name,
    streak,
    longestStreak,
    totalSessions,
    unlockedAchievementIds,
    lastPracticeDate,
    xpToNextLevel,
    xpInCurrentLevel,
    levelProgress,
  };
}

export function checkNewAchievements(
  state: {
    assessmentCount: number;
    streak: number;
    skillScores: Record<string, number>;
    practiceCounts: Record<string, number>;
    totalSessions: number;
    maxImprovement: number;
  },
  unlockedIds: string[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedIds.includes(achievement.id)) continue;

    const { type, threshold, skill } = achievement.condition;
    let unlocked = false;

    switch (type) {
      case 'assessment_count':
        unlocked = state.assessmentCount >= threshold;
        break;
      case 'streak_days':
        unlocked = state.streak >= threshold;
        break;
      case 'skill_score':
        if (skill && state.skillScores[skill] !== undefined) {
          unlocked = state.skillScores[skill] >= threshold;
        }
        break;
      case 'practice_count':
        if (skill && state.practiceCounts[skill] !== undefined) {
          unlocked = state.practiceCounts[skill] >= threshold;
        } else if (!skill) {
          const total = Object.values(state.practiceCounts).reduce((a, b) => a + b, 0);
          unlocked = total >= threshold;
        }
        break;
      case 'session_count':
        unlocked = state.totalSessions >= threshold;
        break;
      case 'improvement':
        unlocked = state.maxImprovement >= threshold;
        break;
    }

    if (unlocked) newlyUnlocked.push(achievement);
  }

  return newlyUnlocked;
}

export function calculateStreakUpdate(
  lastPracticeDate: string | null,
  currentStreak: number
): { newStreak: number; continued: boolean } {
  if (!lastPracticeDate) return { newStreak: 1, continued: false };

  const last = new Date(lastPracticeDate);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { newStreak: currentStreak, continued: true };
  if (diffDays === 1) return { newStreak: currentStreak + 1, continued: true };
  return { newStreak: 1, continued: false }; // streak broken
}
