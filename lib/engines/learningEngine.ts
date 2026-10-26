import { Lesson, Competency } from '../types/curriculum';
import { LearningProfile, LearningPlanItem } from '../types/student';

export const learningEngine = {
  generateAdaptivePlan(
    studentId: string,
    skillId: string,
    profile: LearningProfile,
    competencies: Competency[],
    allLessons: Lesson[]
  ): LearningPlanItem[] {
    const weakSubSkills = profile.sub_skill_scores
      .filter(s => s.status === 'needs_practice')
      .map(s => s.name.toLowerCase());

    const prioritizedLessons: { lesson: Lesson; priority: number; reason: string }[] = [];

    allLessons.forEach(lesson => {
      const comp = competencies.find(c => c.id === lesson.competency_id);
      const isWeakTag = weakSubSkills.some(w => 
        lesson.title.toLowerCase().includes(w) || 
        lesson.objective.toLowerCase().includes(w) ||
        comp?.title.toLowerCase().includes(w)
      );

      if (isWeakTag) {
        prioritizedLessons.push({
          lesson,
          priority: 1,
          reason: `Focus Area: Strengthen ${weakSubSkills.join(', ')}`
        });
      } else {
        prioritizedLessons.push({
          lesson,
          priority: 2,
          reason: `Core module in ${comp?.title || 'Skill'}`
        });
      }
    });

    // Sort by priority (weakest first), then by order index
    prioritizedLessons.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.lesson.order_index - b.lesson.order_index;
    });

    return prioritizedLessons.map((item, index) => ({
      id: `plan-${studentId}-${item.lesson.id}`,
      student_id: studentId,
      skill_id: skillId,
      lesson_id: item.lesson.id,
      competency_id: item.lesson.competency_id,
      day_number: index + 1,
      title: item.lesson.title,
      objective: item.lesson.objective,
      reason_for_recommendation: item.reason,
      status: index === 0 ? 'in_progress' : 'pending',
      scheduled_order: index + 1
    }));
  },

  calculateNextStepRecommendation(scorePercentage: number): {
    recommendation: 'advance' | 'revise' | 'practice_more';
    message: string;
  } {
    if (scorePercentage >= 80) {
      return {
        recommendation: 'advance',
        message: 'Great job! You demonstrated strong mastery. Advancing to the next recommended topic.'
      };
    } else if (scorePercentage >= 50) {
      return {
        recommendation: 'practice_more',
        message: 'Good effort! Complete the independent practice activity before advancing.'
      };
    } else {
      return {
        recommendation: 'revise',
        message: 'Needs practice. We recommend reviewing the guided practice lesson material before retaking.'
      };
    }
  }
};
