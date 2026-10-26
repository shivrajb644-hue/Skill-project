"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { repository } from "../../lib/repositories/LocalIndexedDBRepository";
import { localSession } from "../../lib/storage/localStorage";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [persona, setPersona] = useState("");
  const [background, setBackground] = useState({ institution: "", role: "", experience: "", educationLevel: "" });
  const [goals, setGoals] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [focusSkills, setFocusSkills] = useState<string[]>([]);
  const [startingPoint, setStartingPoint] = useState({
    englishLevel: "",
    dailyTime: "",
    speakingConfidence: 0, // 1-5
    primaryFear: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("onboarding_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.persona) setPersona(parsed.persona);
        if (parsed.background) setBackground(parsed.background);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.timeline) setTimeline(parsed.timeline);
        if (parsed.focusSkills) setFocusSkills(parsed.focusSkills);
        if (parsed.startingPoint) setStartingPoint(parsed.startingPoint);
      } catch {}
    }
  }, []);

  const saveDraft = (currentStep: number) => {
    localStorage.setItem("onboarding_draft", JSON.stringify({
      step: currentStep, persona, background, goals, timeline, focusSkills, startingPoint
    }));
  };

  const nextStep = () => {
    const newStep = step + 1;
    setStep(newStep);
    saveDraft(newStep);
  };

  const prevStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    saveDraft(newStep);
  };

  // Derive isFresher and speakingStage from collected data
  const computeIsFresher = (): boolean => {
    if (persona === 'Fresher') return true;
    if (persona === 'Student') return true;
    if (persona === 'Graduate' && background.experience === '0-2') return true;
    return false;
  };

  const computeSpeakingStage = (confidence: number): 'mirror' | 'ai_easy' | 'ai_standard' | 'interview_basic' | 'interview_advanced' => {
    if (confidence <= 1) return 'mirror';
    if (confidence === 2) return 'ai_easy';
    if (confidence === 3) return 'ai_standard';
    if (confidence === 4) return 'interview_basic';
    return 'interview_advanced';
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const session = JSON.parse(localStorage.getItem("user_session") || "{}");
      const studentId = `student-${Date.now()}`;
      const isFresher = computeIsFresher();
      const speakingStage = computeSpeakingStage(startingPoint.speakingConfidence || 3);

      const newProfile = {
        id: studentId,
        full_name: session.name || "User",
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentId}`,
        education_level: (background.educationLevel || 'Undergraduate') as any,
        year: 'Final Year' as any,
        primary_skill_id: focusSkills[0] ? `skill-${focusSkills[0].toLowerCase().replace(/\s+/g, '-')}` : 'skill-english-speaking',
        goal: goals[0] || 'Improve communication and build confidence for interviews',
        target_role: background.role || undefined,
        selected_skill_ids: focusSkills.map(s => `skill-${s.toLowerCase().replace(/\s+/g, '-')}`),
        created_at: new Date().toISOString(),
      };

      await repository.createStudent(newProfile);
      localSession.setActiveStudentId(studentId);
      localSession.setOnboarding({
        userType: persona === 'Student' || persona === 'Fresher' ? 'student' : persona === 'Graduate' ? 'graduate' : 'professional',
        name: session.name || 'User',
        email: session.email,
        college: background.institution,
        company: background.institution,
        role: background.role,
        experience: background.experience,
        educationLevel: background.educationLevel,
        goals,
        targetTimeline: timeline,
        focusSkills,
        englishLevel: (startingPoint.englishLevel || 'intermediate') as any,
        dailyTime: (startingPoint.dailyTime || '30') as any,
        speakingConfidence: (startingPoint.speakingConfidence || 3) as any,
        primaryFear: startingPoint.primaryFear || undefined,
        isFresher,
        speakingStage,
        completedAt: new Date().toISOString(),
      });

      localStorage.removeItem("onboarding_draft");
      router.push("/assessment");
    } catch (error) {
      console.error("Failed to create profile:", error);
      localStorage.setItem("onboarding_complete", "true");
      router.push("/assessment");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (array: string[], setArray: (val: string[]) => void, item: string, max?: number) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      if (max && array.length >= max) return;
      setArray([...array, item]);
    }
  };

  const confidenceLabels: Record<number, { emoji: string; label: string; color: string }> = {
    1: { emoji: '😰', label: 'Very nervous — I avoid speaking in English', color: 'border-red-500 bg-red-500/10' },
    2: { emoji: '😟', label: 'A bit nervous — I speak but make many mistakes', color: 'border-orange-500 bg-orange-500/10' },
    3: { emoji: '😐', label: 'Okay — I can manage but feel unsure sometimes', color: 'border-yellow-500 bg-yellow-500/10' },
    4: { emoji: '😊', label: 'Fairly comfortable — I speak with some confidence', color: 'border-blue-500 bg-blue-500/10' },
    5: { emoji: '😄', label: 'Very confident — I enjoy speaking in English', color: 'border-green-500 bg-green-500/10' },
  };

  const TOTAL_STEPS = 5;
  const isNextDisabled =
    (step === 1 && !persona) ||
    (step === 3 && goals.length === 0) ||
    (step === 4 && focusSkills.length === 0);

  const isCompleteDisabled =
    !startingPoint.englishLevel ||
    !startingPoint.dailyTime ||
    startingPoint.speakingConfidence === 0 ||
    loading;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-900/10 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/10 blur-[120px] -z-10" />

      {/* Header & Progress */}
      <header className="w-full max-w-4xl mx-auto pt-10 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center font-bold text-white text-sm">S</div>
            <span className="font-bold text-lg tracking-tight">SkillGenie</span>
          </div>
          <div className="text-sm font-medium text-slate-400">Step {step} of {TOTAL_STEPS}</div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-10 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pb-24 flex flex-col justify-center animate-fade-in-up" key={step}>

        {/* ── STEP 1: Who are you? ── */}
        {step === 1 && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">👋</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Tell us a little about yourself!</h1>
              <p className="text-slate-400">We'll personalise your learning journey just for you.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'Fresher',
                  icon: '🌱',
                  title: 'Fresher — Just finished college',
                  desc: 'No work experience yet. Looking for my first job. Want to build confidence and communication.',
                  badge: '⭐ Most common',
                },
                {
                  id: 'Student',
                  icon: '🎓',
                  title: 'College Student',
                  desc: 'Currently studying. Preparing for placements and want to improve spoken English.',
                  badge: '',
                },
                {
                  id: 'Graduate',
                  icon: '🎯',
                  title: 'Graduate with some experience',
                  desc: 'Have worked or done internships. Want to improve interviews and professional communication.',
                  badge: '',
                },
                {
                  id: 'Professional',
                  icon: '💼',
                  title: 'Working Professional',
                  desc: 'Currently employed. Want to improve leadership, presentations and workplace communication.',
                  badge: '',
                },
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setPersona(item.id)}
                  className={`glass-panel p-5 flex items-center gap-5 cursor-pointer transition-all ${
                    persona === item.id ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-3xl bg-slate-800 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      {item.badge && (
                        <span className="text-[10px] font-bold bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{item.desc}</p>
                  </div>
                  <div className="ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: persona === item.id ? '#3b82f6' : '#475569' }}>
                    {persona === item.id && <div className="w-3 h-3 bg-brand-500 rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Background ── */}
        {step === 2 && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">📚</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">About your studies</h1>
              <p className="text-slate-400">This helps us give you relevant examples and practice scenarios.</p>
            </div>

            <div className="glass-panel p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Highest Education Level</label>
                <select
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                  value={background.educationLevel}
                  onChange={(e) => setBackground({...background, educationLevel: e.target.value})}
                >
                  <option value="">Select level...</option>
                  <option value="High School">High School / 12th Pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">Undergraduate (B.Tech / B.Sc / B.Com etc.)</option>
                  <option value="Postgraduate">Postgraduate (M.Tech / MBA etc.)</option>
                  <option value="PhD">PhD / Doctorate</option>
                </select>
              </div>

              {(persona === "Student" || persona === "Fresher" || persona === "Graduate") ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">College / University Name <span className="text-slate-500">(optional)</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. Government Engineering College"
                      value={background.institution}
                      onChange={(e) => setBackground({...background, institution: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Branch / Stream <span className="text-slate-500">(optional)</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. Computer Science, Mechanical, Arts"
                      value={background.role}
                      onChange={(e) => setBackground({...background, role: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Company / Organisation <span className="text-slate-500">(optional)</span></label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. TCS, Infosys, Local firm"
                      value={background.institution}
                      onChange={(e) => setBackground({...background, institution: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Job Title / Role <span className="text-slate-500">(optional)</span></label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="e.g. Software Engineer"
                        value={background.role}
                        onChange={(e) => setBackground({...background, role: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Years of Experience</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
                        value={background.experience}
                        onChange={(e) => setBackground({...background, experience: e.target.value})}
                      >
                        <option value="">Select...</option>
                        <option value="0-2">0–2 years</option>
                        <option value="3-5">3–5 years</option>
                        <option value="6-10">6–10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Goals ── */}
        {step === 3 && (
          <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">🎯</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">What do you want to improve?</h1>
              <p className="text-slate-400">Select everything that matters to you. We'll build your path around these.</p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {[
                '😊 Build confidence in speaking',
                '🗣️ Improve English fluency',
                '💼 Crack campus placements',
                '🎤 Stop feeling nervous in interviews',
                '📝 Learn professional communication',
                '👥 Feel comfortable in group discussions',
                '🗺️ Improve my vocabulary',
                '🎓 Prepare for first job',
                '💬 Stop freezing when speaking',
                '🌟 Feel less shy around strangers',
              ].map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleSelection(goals, setGoals, goal)}
                  className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                    goals.includes(goal)
                      ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                      : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  {goals.includes(goal) && '✓ '}{goal}
                </button>
              ))}
            </div>

            <div className="max-w-md mx-auto glass-panel p-6">
              <label className="block text-sm font-medium text-slate-300 mb-4 text-center">When do you want to feel the difference?</label>
              <div className="grid grid-cols-3 gap-3">
                {['1 month', '3 months', '6 months'].map(time => (
                  <button
                    key={time}
                    onClick={() => setTimeline(time)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all border ${
                      timeline === time
                        ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Focus Areas ── */}
        {step === 4 && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">✨</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose your focus areas</h1>
              <p className="text-slate-400">Pick up to 3 skills to focus on first. You can always add more later.</p>
              <div className="text-brand-400 text-sm font-medium mt-2">Selected: {focusSkills.length}/3</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'english', icon: '📝', title: 'English & Communication', desc: 'Grammar, vocabulary, writing' },
                { id: 'speaking', icon: '🎙️', title: 'Speaking Confidence', desc: 'Stop freezing, speak clearly' },
                { id: 'interview', icon: '🎯', title: 'Interview Preparation', desc: 'Answer questions confidently' },
                { id: 'leadership', icon: '👑', title: 'Leadership', desc: 'Lead discussions, teams' },
                { id: 'eq', icon: '❤️', title: 'Emotional Intelligence', desc: 'Stay calm under pressure' },
                { id: 'presentation', icon: '📊', title: 'Presentations', desc: 'Speak in front of groups' },
                { id: 'career', icon: '💼', title: 'Career Development', desc: 'Resume, networking, goals' },
                { id: 'professional', icon: '🤝', title: 'Professional Skills', desc: 'Email, meetings, etiquette' },
              ].map(skill => (
                <div
                  key={skill.id}
                  onClick={() => toggleSelection(focusSkills, setFocusSkills, skill.title, 3)}
                  className={`glass-panel p-5 flex flex-col items-center text-center cursor-pointer transition-all relative ${
                    focusSkills.includes(skill.title)
                      ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)] -translate-y-1'
                      : 'hover:border-slate-600 hover:bg-slate-800/50'
                  } ${!focusSkills.includes(skill.title) && focusSkills.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-3xl mb-2">{skill.icon}</div>
                  <h4 className="font-bold text-sm text-white mb-1">{skill.title}</h4>
                  <p className="text-[11px] text-slate-400">{skill.desc}</p>
                  {focusSkills.includes(skill.title) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center text-xs text-white">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 5: Starting Point (English + Confidence + Fear + Time) ── */}
        {step === 5 && (
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🌟</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Your starting point</h1>
              <p className="text-slate-400">Don't worry — there are no right or wrong answers. This helps us personalise your journey.</p>
            </div>

            {/* English Level */}
            <div className="glass-panel p-6">
              <h3 className="font-bold text-base mb-4 text-white">How is your English right now?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { level: 'beginner', label: 'Beginner', desc: 'I know some words but struggle to form sentences', emoji: '🌱' },
                  { level: 'intermediate', label: 'Intermediate', desc: 'I can speak but sometimes get stuck or make mistakes', emoji: '🌿' },
                  { level: 'advanced', label: 'Advanced', desc: 'I speak well but want to polish my style', emoji: '🌳' },
                ].map(lvl => (
                  <div
                    key={lvl.level}
                    onClick={() => setStartingPoint({...startingPoint, englishLevel: lvl.level})}
                    className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                      startingPoint.englishLevel === lvl.level
                        ? 'bg-brand-500/20 border-brand-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{lvl.emoji}</div>
                    <div className="font-bold text-sm mb-1">{lvl.label}</div>
                    <div className="text-xs opacity-70">{lvl.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speaking Confidence */}
            <div className="glass-panel p-6">
              <h3 className="font-bold text-base mb-2 text-white">How comfortable are you speaking in English? 😊</h3>
              <p className="text-slate-500 text-xs mb-4">Be honest — this helps us give you easier practice first, so you can build up gradually.</p>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(level => {
                  const info = confidenceLabels[level];
                  const isSelected = startingPoint.speakingConfidence === level;
                  return (
                    <div
                      key={level}
                      onClick={() => setStartingPoint({...startingPoint, speakingConfidence: level as any})}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? info.color : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-2xl">{info.emoji}</span>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{info.label}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-white' : 'border-slate-600'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Fear */}
            <div className="glass-panel p-6">
              <h3 className="font-bold text-base mb-2 text-white">What worries you most about speaking? <span className="text-slate-400 font-normal text-sm">(optional)</span></h3>
              <p className="text-slate-500 text-xs mb-4">We'll help you tackle this first. Many people feel exactly the same way — you're not alone!</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'I blank out mid-sentence and forget what to say',
                  'People will judge me for my mistakes',
                  'I don\'t know enough English words',
                  'I get very nervous talking to new people',
                  'I understand English but can\'t speak it smoothly',
                  'Nothing — I\'m ready to practice! 💪',
                ].map(fear => (
                  <button
                    key={fear}
                    onClick={() => setStartingPoint({
                      ...startingPoint,
                      primaryFear: startingPoint.primaryFear === fear ? '' : fear
                    })}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      startingPoint.primaryFear === fear
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    {startingPoint.primaryFear === fear && '✓ '}{fear}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Time */}
            <div className="glass-panel p-6">
              <h3 className="font-bold text-base mb-4 text-white">How much time can you practice daily?</h3>
              <div className="flex justify-between items-center bg-slate-900 p-2 rounded-2xl border border-slate-700">
                {['15 min', '30 min', '45 min', '60+ min'].map(time => (
                  <button
                    key={time}
                    onClick={() => setStartingPoint({...startingPoint, dailyTime: time})}
                    className={`flex-1 py-3 text-sm font-medium rounded-xl transition-all ${
                      startingPoint.dailyTime === time
                        ? 'bg-slate-800 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-2 text-center">Even 15 minutes a day makes a big difference! 🌟</p>
            </div>
          </div>
        )}

      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 w-full glass-panel border-t-0 border-l-0 border-r-0 rounded-none border-b-slate-800 bg-slate-950/80 p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1 || loading}
            className={`btn-secondary py-2 px-6 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            ← Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={nextStep}
              disabled={isNextDisabled}
              className="btn-primary py-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isCompleteDisabled}
              className="btn-primary py-2 px-8 shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Building your journey...
                </div>
              ) : (
                "Start My Journey 🚀"
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
