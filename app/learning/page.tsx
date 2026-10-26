'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DailySession } from '../../components/learning/DailySession';
import { repository } from '../../lib/repositories/LocalIndexedDBRepository';
import { localSession } from '../../lib/storage/localStorage';
import { Lesson, Activity, AssessmentItem } from '../../lib/types/curriculum';

function LearningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get('lessonId') || 'les-eng-vocab-1';
  const planItemId = searchParams.get('planItemId') || '';

  const [studentId, setStudentId] = useState<string>('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [assessmentItems, setAssessmentItems] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = localSession.getActiveStudentId();
    setStudentId(activeId);

    const loadData = async () => {
      const les = await repository.getLessonById(lessonId);
      setLesson(les);

      const act = await repository.getActivities(lessonId);
      setActivities(act);

      const ass = await repository.getAssessmentItems(les?.competency_id);
      setAssessmentItems(ass);

      setLoading(false);
    };

    loadData();
  }, [lessonId]);

  const handleSessionCompleted = async (scorePercentage: number, nextStep: 'advance' | 'revise' | 'practice_more') => {
    if (planItemId) {
      const newStatus = nextStep === 'revise' ? 'revision_recommended' : 'completed';
      await repository.updatePlanItemStatus(planItemId, newStatus, scorePercentage);
    }
    router.push('/dashboard/student');
  };

  if (loading || !lesson) {
    return (
      <div className="text-white flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <div className="text-xs text-slate-400">Loading Daily Learning Experience...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <DailySession
        studentId={studentId}
        lesson={lesson}
        activities={activities}
        assessmentItems={assessmentItems}
        onSessionCompleted={handleSessionCompleted}
      />
    </div>
  );
}

export default function LearningPage() {
  return (
    <Suspense fallback={<div className="text-white flex items-center justify-center py-12">Loading...</div>}>
      <LearningContent />
    </Suspense>
  );
}
