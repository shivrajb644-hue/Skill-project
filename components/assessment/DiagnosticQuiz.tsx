'use client';

import React, { useState } from 'react';
import { AssessmentItem } from '../../lib/types/curriculum';
import { UserAssessmentResponse, assessmentEngine } from '../../lib/engines/assessmentEngine';
import { LearningProfile } from '../../lib/types/student';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle2, ArrowRight, Sparkles, Info, Clock, ShieldCheck } from 'lucide-react';

interface DiagnosticQuizProps {
  studentId: string;
  skillId: string;
  skillTitle: string;
  items: AssessmentItem[];
  onCompleted: (profile: LearningProfile) => void;
}

export const DiagnosticQuiz: React.FC<DiagnosticQuizProps> = ({
  studentId,
  skillId,
  skillTitle,
  items,
  onCompleted
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const currentItem = items[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    setResponses(prev => ({
      ...prev,
      [currentItem.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit diagnostic
      const respArray: UserAssessmentResponse[] = Object.keys(responses).map(id => ({
        assessment_id: id,
        selected_option_index: responses[id]
      }));

      const profile = assessmentEngine.evaluateDiagnostic(studentId, skillId, items, respArray);
      onCompleted(profile);
    }
  };

  if (!currentItem) {
    return (
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-white">Diagnostic Ready</h3>
        <p className="text-xs text-slate-300">Click below to generate your initial learning roadmap.</p>
        <Button variant="primary" size="lg" onClick={() => onCompleted(assessmentEngine.evaluateDiagnostic(studentId, skillId, items, []))}>
          Generate Learning Profile
        </Button>
      </div>
    );
  }

  const isSelected = responses[currentItem.id] !== undefined;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 max-w-3xl mx-auto">
      
      {/* Reassuring Onboarding Banner */}
      <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Let's understand your current level in {skillTitle}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> 5-7 mins</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No penalties</span>
          </div>
        </div>
        <p className="text-xs text-slate-300">
          There are no marks or grades. Your answers help us identify your strengths and personalize your daily learning roadmap.
        </p>
      </div>

      {/* Header progress bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge variant="purple" className="flex items-center gap-1 mb-1">
            Question {currentIndex + 1} of {items.length}
          </Badge>
          <div className="text-xs text-slate-400 font-medium">Area: {currentItem.sub_skill_tag}</div>
        </div>
        <div className="text-xs font-bold text-brand-400">
          {Math.round(((currentIndex + 1) / items.length) * 100)}% Complete
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Question prompt */}
      <div className="space-y-4 pt-2">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug whitespace-pre-wrap">
          {currentItem.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentItem.options?.map((option, idx) => {
            const selected = responses[currentItem.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between border ${
                  selected
                    ? 'bg-brand-500/20 border-brand-500/50 text-white shadow-glow'
                    : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    selected ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
                {selected && <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!isSelected}
          onClick={handleNext}
        >
          <span>{currentIndex === items.length - 1 ? 'Generate Personalized Plan' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
};
