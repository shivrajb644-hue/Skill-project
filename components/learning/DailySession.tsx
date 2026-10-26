'use client';

import React, { useState } from 'react';
import { Lesson, Activity, AssessmentItem } from '../../lib/types/curriculum';
import { aiService } from '../../lib/services/ai/aiService';
import { learningEngine } from '../../lib/engines/learningEngine';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Youtube, 
  FileText, 
  Eye, 
  MessageSquare,
  Award,
  RefreshCw
} from 'lucide-react';

interface DailySessionProps {
  studentId: string;
  lesson: Lesson;
  activities: Activity[];
  assessmentItems: AssessmentItem[];
  onSessionCompleted: (scorePercentage: number, nextStep: 'advance' | 'revise' | 'practice_more') => void;
}

type SessionStep = 'content' | 'guided' | 'independent' | 'quiz' | 'summary';

export const DailySession: React.FC<DailySessionProps> = ({
  studentId,
  lesson,
  activities,
  assessmentItems,
  onSessionCompleted
}) => {
  const [currentStep, setCurrentStep] = useState<SessionStep>('content');
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [independentResponse, setIndependentResponse] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [evaluatingAi, setEvaluatingAi] = useState(false);

  // Quiz state
  const [quizResponses, setQuizResponses] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [nextStepData, setNextStepData] = useState<any>(null);

  const guidedActivity = activities.find(a => a.type === 'guided_practice') || activities[0];
  const independentActivity = activities.find(a => a.type === 'independent_practice') || activities[1] || activities[0];

  const handleEvaluatePractice = async () => {
    if (!independentResponse.trim()) return;
    setEvaluatingAi(true);
    const result = await aiService.evaluateStudentPractice({
      student_response: independentResponse,
      rubric: independentActivity?.rubric_criteria || ['Clear executive tone'],
      sample_answer: independentActivity?.sample_answer
    });
    setAiFeedback(result);
    setEvaluatingAi(false);
  };

  const handleSelectQuizOption = (itemId: string, optionIndex: number) => {
    setQuizResponses(prev => ({
      ...prev,
      [itemId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    assessmentItems.forEach(item => {
      if (quizResponses[item.id] === item.correct_option_index) {
        correct += 1;
      }
    });

    const scorePct = assessmentItems.length > 0
      ? Math.round((correct / assessmentItems.length) * 100)
      : 100;

    setQuizScore(scorePct);
    const rec = learningEngine.calculateNextStepRecommendation(scorePct);
    setNextStepData(rec);
    setCurrentStep('summary');
  };

  const handleFinish = () => {
    const finalScore = quizScore !== null ? quizScore : 85;
    const nextStep = nextStepData?.recommendation || 'advance';
    onSessionCompleted(finalScore, nextStep);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-8 max-w-4xl mx-auto shadow-2xl">
      
      {/* Session Progress Stepper Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <Badge variant="purple" className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Daily Learning Experience
          </Badge>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{lesson.title}</h1>
        </div>

        {/* Step pills */}
        <div className="hidden sm:flex items-center gap-2">
          {(['content', 'guided', 'independent', 'quiz', 'summary'] as SessionStep[]).map((step, idx) => (
            <span
              key={step}
              className={`px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider ${
                currentStep === step
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              Step {idx + 1}
            </span>
          ))}
        </div>
      </div>

      {/* STEP 1: CONTENT & VIDEO RESOURCE */}
      {currentStep === 'content' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-1">
            <div className="text-xs font-bold text-brand-400 uppercase tracking-wider">Learning Objective</div>
            <p className="text-sm font-medium text-white">{lesson.objective}</p>
          </div>

          {/* Explanation Text */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {lesson.explanation_markdown}
          </div>

          {/* Video Embedded Resource */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Youtube className="w-4 h-4 text-rose-500" />
                Featured Video & Materials
              </h3>
              {lesson.resources.map(res => (
                <div key={res.id} className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-400" />
                      {res.title}
                    </span>
                    <Badge variant="slate">{res.type.toUpperCase()}</Badge>
                  </div>

                  {res.type === 'youtube' && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <iframe
                        src={res.url}
                        title={res.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {res.type === 'pdf' && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:underline"
                    >
                      <span>Download Resource Attachment ({res.title})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button variant="primary" size="lg" onClick={() => setCurrentStep('guided')}>
              <span>Proceed to Guided Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: GUIDED PRACTICE */}
      {currentStep === 'guided' && guidedActivity && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
            <Badge variant="purple">Guided Practice</Badge>
            <h3 className="text-lg font-bold text-white mt-1">{guidedActivity.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{guidedActivity.instruction}</p>
          </div>

          {/* Sample Answer Toggle */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-brand-400" />
                Expert Sample Answer & Strategy
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowSampleAnswer(!showSampleAnswer)}>
                {showSampleAnswer ? 'Hide Sample Answer' : 'View Sample Answer'}
              </Button>
            </div>

            {showSampleAnswer && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed animate-in fade-in">
                {guidedActivity.sample_answer}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <Button variant="ghost" size="md" onClick={() => setCurrentStep('content')}>
              Back to Explanation
            </Button>
            <Button variant="primary" size="lg" onClick={() => setCurrentStep('independent')}>
              <span>Continue to Independent Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: INDEPENDENT PRACTICE & AI FEEDBACK */}
      {currentStep === 'independent' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-1">
            <Badge variant="blue">Independent Practice</Badge>
            <h3 className="text-lg font-bold text-white mt-1">{independentActivity?.title || 'Independent Challenge'}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{independentActivity?.instruction}</p>
          </div>

          {/* Interactive Response Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Your Response & Practice Execution</label>
            <textarea
              rows={5}
              value={independentResponse}
              onChange={e => setIndependentResponse(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Type or paste your spoken pitch / response here..."
            />
          </div>

          <div className="flex justify-start">
            <Button
              variant="outline"
              size="md"
              disabled={!independentResponse.trim() || evaluatingAi}
              onClick={handleEvaluatePractice}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{evaluatingAi ? 'Evaluating Response...' : 'Request AI Feedback Evaluation'}</span>
            </Button>
          </div>

          {/* AI Feedback Results Box */}
          {aiFeedback && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-brand-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  AI Practice Evaluation Score: {aiFeedback.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{aiFeedback.feedback_text}</p>
            </div>
          )}

          <div className="pt-4 flex justify-between items-center border-t border-slate-800">
            <Button variant="ghost" size="md" onClick={() => setCurrentStep('guided')}>
              Back
            </Button>
            <Button variant="primary" size="lg" onClick={() => setCurrentStep('quiz')}>
              <span>Proceed to Daily Assessment Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: DAILY QUIZ */}
      {currentStep === 'quiz' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <Badge variant="amber">Daily Mastery Quiz</Badge>
            <h3 className="text-lg font-bold text-white mt-1">Assess Knowledge Retention</h3>
            <p className="text-xs text-slate-300">Answer the assessment questions to prove competency mastery.</p>
          </div>

          <div className="space-y-6">
            {assessmentItems.map((item, qIdx) => (
              <div key={item.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-brand-400">Question {qIdx + 1} ({item.sub_skill_tag})</div>
                <h4 className="font-bold text-white text-base">{item.question}</h4>

                <div className="space-y-2">
                  {item.options?.map((opt, oIdx) => {
                    const selected = quizResponses[item.id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectQuizOption(item.id, oIdx)}
                        className={`w-full p-3 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between border ${
                          selected
                            ? 'bg-brand-500/20 border-brand-500/50 text-white font-bold'
                            : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              disabled={Object.keys(quizResponses).length < assessmentItems.length}
              onClick={handleSubmitQuiz}
            >
              <span>Submit & View Results</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: SUMMARY & NEXT STEP RECOMMENDATION */}
      {currentStep === 'summary' && (
        <div className="space-y-6 text-center animate-in fade-in duration-200 py-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-accent-purple mx-auto flex items-center justify-center shadow-glow mb-2">
            <Award className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-extrabold text-white">Daily Session Completed!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You scored <span className="font-bold text-brand-400 text-lg">{quizScore}%</span> on today's daily competency assessment.
          </p>

          {nextStepData && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-left space-y-3 max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <Badge variant={nextStepData.recommendation === 'advance' ? 'emerald' : 'amber'}>
                  Adaptive Next Step Recommendation
                </Badge>
              </div>
              <h3 className="font-bold text-white text-base">
                {nextStepData.recommendation === 'advance' ? 'Advancement Recommended' : 'Revision Recommended'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{nextStepData.message}</p>
            </div>
          )}

          <div className="pt-4">
            <Button variant="primary" size="lg" onClick={handleFinish}>
              <span>Complete Session & Update Adaptive Plan</span>
              <CheckCircle2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
