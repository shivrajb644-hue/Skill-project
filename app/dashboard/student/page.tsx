'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdaptivePlanView } from '../../../components/learning/AdaptivePlanView';
import { repository } from '../../../lib/repositories/LocalIndexedDBRepository';
import { localSession } from '../../../lib/storage/localStorage';
import { Skill } from '../../../lib/types/curriculum';
import { LocalStudentProfile, LearningProfile, LearningPlanItem } from '../../../lib/types/student';
import { DailyChallenge as DailyChallengeType } from '../../../lib/types/extensions';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Target, ArrowRight, Users, MessageSquare, Zap } from 'lucide-react';

import { SkillRadarChart } from '../../../components/dashboard/SkillRadarChart';
import { DevelopmentScoreRing } from '../../../components/dashboard/DevelopmentScoreRing';
import { WeeklyProgressChart } from '../../../components/dashboard/WeeklyProgressChart';
import { DailyChallenge } from '../../../components/dashboard/DailyChallenge';
import { AIRecommendation } from '../../../components/dashboard/AIRecommendation';
import { StreakCard } from '../../../components/dashboard/StreakCard';

// Dummy data for components that don't have DB models yet
const dummyRadarSkills = [
  { name: 'Fluency', value: 65 },
  { name: 'Vocabulary', value: 45 },
  { name: 'Grammar', value: 70 },
  { name: 'Structure', value: 55 },
  { name: 'Confidence', value: 80 },
];

const dummyWeeklyData = [
  { day: 'Mon', minutes: 15 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 45 },
  { day: 'Fri', minutes: 20 },
  { day: 'Sat', minutes: 60 },
  { day: 'Sun', minutes: 40 },
];

const dummyDailyChallenge: DailyChallengeType = {
  id: 'chal-1',
  student_id: 'std-1',
  title: 'Introduce yourself in 4 sentences',
  description: "Speak or write 4 sentences introducing yourself: your name, where you're from, what you study, and one thing you enjoy.",
  skill_focus: 'Speaking Confidence',
  difficulty: 'beginner',
  challenge_type: 'speaking',
  prompt: 'Introduce yourself in 4 simple sentences.',
  completed: false,
  date: new Date().toISOString(),
  created_at: new Date().toISOString()
};

// ─── Personalised Mission based on speaking confidence & fresher status ───
interface Mission {
  emoji: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  badge: string;
}

function getTodaysMission(confidence: number, isFresher: boolean, englishLevel: string): Mission {
  if (confidence <= 1 || englishLevel === 'beginner') {
    return {
      emoji: '🗣️',
      title: 'Say 5 sentences about yourself',
      description: 'Open Speaking Practice and speak (or type) 5 sentences about yourself, your home, or your studies. No pressure — just get started!',
      href: '/practice/speaking',
      cta: 'Start Speaking Practice',
      badge: '🟢 Very Easy — 5 minutes',
    };
  }
  if (confidence === 2) {
    return {
      emoji: '💬',
      title: 'Have a simple conversation',
      description: 'Start the "Meet a New Friend" conversation scenario. Practice introducing yourself to an AI friend in a safe, no-judgement space.',
      href: '/practice/conversation',
      cta: 'Start Conversation',
      badge: '🟢 Easy — 5–10 minutes',
    };
  }
  if (confidence === 3 && isFresher) {
    return {
      emoji: '🎤',
      title: 'Speaking practice — easy topics',
      description: 'Pick an easy topic (like your hometown or favourite food) and speak for 30 seconds. Your AI coach will give you friendly feedback.',
      href: '/practice/speaking',
      cta: 'Start Speaking',
      badge: '🟡 Medium — 10 minutes',
    };
  }
  if (confidence >= 4 || (!isFresher && confidence >= 3)) {
    return {
      emoji: '🎯',
      title: 'Fresher Interview Practice',
      description: 'Practice 5 beginner interview questions like "Tell me about yourself" and "What are your strengths?" Your AI coach will give feedback after each answer.',
      href: '/practice/interview',
      cta: 'Start Interview Practice',
      badge: '🟡 Medium — 15 minutes',
    };
  }
  return {
    emoji: '🎤',
    title: 'Speaking Practice',
    description: 'Pick a topic and speak for 60 seconds. Get AI feedback on your fluency, vocabulary, and confidence.',
    href: '/practice/speaking',
    cta: 'Start Speaking Practice',
    badge: '🟡 Medium — 10 minutes',
  };
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<LocalStudentProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>('skill-english-speaking');
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [planItems, setPlanItems] = useState<LearningPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState<Mission | null>(null);

  const loadData = async () => {
    setLoading(true);
    const activeId = localSession.getActiveStudentId();
    if (!activeId) {
      setLoading(false);
      return;
    }
    const st = await repository.getStudentById(activeId);
    setStudent(st);

    const skList = await repository.getSkills();
    setSkills(skList);

    if (st) {
      const activeSkill = st.primary_skill_id || (st.selected_skill_ids && st.selected_skill_ids[0]) || 'skill-english-speaking';
      setSelectedSkillId(activeSkill);

      const prof = await repository.getLearningProfile(st.id, activeSkill);
      setProfile(prof);

      const plan = await repository.getLearningPlan(st.id, activeSkill);
      setPlanItems(plan);
    }

    // Compute today's mission from onboarding data
    const onboarding = localSession.getOnboarding();
    const confidence = onboarding?.speakingConfidence ?? 3;
    const isFresher = onboarding?.isFresher ?? (onboarding?.userType === 'student');
    const englishLevel = onboarding?.englishLevel ?? 'intermediate';
    setMission(getTodaysMission(confidence, isFresher, englishLevel));

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartSession = (item: LearningPlanItem) => {
    router.push(`/learning?lessonId=${item.lesson_id}&planItemId=${item.id}`);
  };

  if (loading || !student) {
    return (
      <div className="text-white flex items-center justify-center py-20 min-h-screen bg-slate-950">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <div className="text-xs text-slate-400">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const overallScore = profile ? profile.overall_score : 45;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* Row 1: Student Profile Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden bg-slate-900/40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="flex items-start gap-5 relative z-10">
          <img
            src={student.avatar_url || '/default-avatar.png'}
            alt={student.full_name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-brand-500/50 shrink-0 shadow-glow"
          />
          <div className="space-y-1.5 mt-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black text-white tracking-tight">Welcome back, {student.full_name.split(' ')[0]}! 👋</h1>
              <Badge variant="purple" className="shadow-glow">{student.year || 'Student'} • {student.education_level || 'College'}</Badge>
            </div>
            <p className="text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Goal: <span className="text-white font-bold">{student.goal}</span>
            </p>
          </div>
        </div>

        {/* Single primary CTA + 2 small links */}
        <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto md:min-w-[200px]">
          {mission && (
            <Link href={mission.href} className="w-full">
              <Button variant="primary" size="md" className="w-full justify-center gap-2">
                <Zap className="w-4 h-4" /> {mission.cta}
              </Button>
            </Link>
          )}
          <div className="flex gap-2">
            <Link href="/practice/conversation" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <MessageSquare className="w-3 h-3 mr-1" /> Conversation
              </Button>
            </Link>
            <Link href="/practice/interview" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Users className="w-3 h-3 mr-1" /> Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Today's Mission | Score Ring | Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Mission — personalised */}
        {mission && (
          <Link href={mission.href} className="block">
            <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-brand-500/50 transition-colors cursor-pointer group">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">⭐ Today's Mission</h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{mission.emoji}</div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">{mission.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{mission.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">{mission.badge}</span>
                <ArrowRight className="w-4 h-4 text-brand-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        <div className="glass-panel border border-slate-800 rounded-2xl p-6 flex items-center justify-center">
          <DevelopmentScoreRing score={overallScore} label="Overall Score" />
        </div>

        <StreakCard currentStreak={4} longestStreak={12} history={[true, true, false, true, true, true, true]} />
      </div>

      {/* Row 3: Radar | AI + Daily */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Skill Breakdown</h3>
          <div className="flex-1 min-h-[300px]">
            <SkillRadarChart skills={dummyRadarSkills} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <AIRecommendation
            message={`Every day you practice is a step forward. Today's mission is designed for your current level — start small, feel great! 💪`}
            actionLabel={mission?.cta || "Start today's practice"}
            actionHref={mission?.href || "/practice/speaking"}
          />
          <DailyChallenge challenge={dummyDailyChallenge} />
        </div>
      </div>

      {/* Row 4: Weekly Progress */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Weekly Practice (Minutes)</h3>
        <WeeklyProgressChart data={dummyWeeklyData} />
      </div>

      {/* Row 5: Skill Selection Cards */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Skills</h2>
          <Link href="/analytics" className="text-xs text-brand-400 hover:text-brand-300 font-medium">View Progress</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map(sk => {
            const isSelected = sk.id === selectedSkillId;
            return (
              <button
                key={sk.id}
                onClick={async () => {
                  setSelectedSkillId(sk.id);
                  const prof = await repository.getLearningProfile(student.id, sk.id);
                  setProfile(prof);
                  const plan = await repository.getLearningPlan(student.id, sk.id);
                  setPlanItems(plan);
                }}
                className={`p-5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500/50 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={isSelected ? 'purple' : 'slate'}>{sk.category}</Badge>
                  <span className="text-[10px] text-slate-400 font-semibold px-2 py-1 bg-slate-900 rounded-md">{sk.level}</span>
                </div>
                <h3 className="font-bold text-white text-base line-clamp-1 mb-1">{sk.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{sk.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 6: Personalised Adaptive Roadmap */}
      {planItems.length > 0 ? (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Your Roadmap</h2>
            <Link href="/roadmap" className="text-xs text-brand-400 hover:text-brand-300 font-medium">View Full Plan</Link>
          </div>
          <AdaptivePlanView
            planItems={planItems}
            onStartSession={handleStartSession}
          />
        </div>
      ) : (
        !profile && (
          <div className="glass-panel rounded-3xl p-8 border border-brand-500/20 bg-brand-500/5 text-center space-y-4 mt-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Let's understand your current level 😊</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              A short 5-minute check — <strong>not a test</strong>. There are no wrong answers. We just want to personalise your learning journey!
            </p>
            <Link href={`/assessment?skillId=${selectedSkillId}`}>
              <Button variant="primary" size="lg">
                <span>Start Quick Check-in</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )
      )}

    </div>
  );
}
