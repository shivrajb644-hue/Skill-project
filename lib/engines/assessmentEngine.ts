import { AssessmentItem } from '../types/curriculum';
import { LearningProfile, SubSkillScore } from '../types/student';

export interface UserAssessmentResponse {
  assessment_id: string;
  selected_option_index: number;
  open_text_response?: string;
}

export const assessmentEngine = {
  evaluateDiagnostic(
    studentId: string,
    skillId: string,
    assessmentItems: AssessmentItem[],
    responses: UserAssessmentResponse[]
  ): LearningProfile {
    const subSkillMap: Record<string, { total: number; correct: number }> = {};

    assessmentItems.forEach(item => {
      const tag = item.sub_skill_tag || 'General Ability';
      if (!subSkillMap[tag]) {
        subSkillMap[tag] = { total: 0, correct: 0 };
      }
      subSkillMap[tag].total += 1;

      const userResp = responses.find(r => r.assessment_id === item.id);
      if (userResp && userResp.selected_option_index === item.correct_option_index) {
        subSkillMap[tag].correct += 1;
      }
    });

    const subSkillScores: SubSkillScore[] = Object.keys(subSkillMap).map(tag => {
      const { total, correct } = subSkillMap[tag];
      const pct = total > 0 ? Math.round((correct / total) * 100) : 50;
      
      let status: 'needs_practice' | 'developing' | 'strong' = 'developing';
      if (pct < 50) status = 'needs_practice';
      else if (pct >= 75) status = 'strong';

      return {
        name: tag,
        score_percentage: pct,
        status,
        evidence_count: total
      };
    });

    const overallScore = subSkillScores.length > 0
      ? Math.round(subSkillScores.reduce((acc, s) => acc + s.score_percentage, 0) / subSkillScores.length)
      : 50;

    const strengths = subSkillScores
      .filter(s => s.status === 'strong')
      .map(s => `${s.name} (${s.score_percentage}% - Strong)`);

    const weaknesses = subSkillScores
      .filter(s => s.status === 'needs_practice')
      .map(s => `${s.name} (${s.score_percentage}% - Needs Practice)`);

    const developingAreas = subSkillScores
      .filter(s => s.status === 'developing')
      .map(s => `${s.name} (${s.score_percentage}% - Developing)`);

    return {
      student_id: studentId,
      skill_id: skillId,
      overall_score: overallScore,
      sub_skill_scores: subSkillScores,
      strengths: strengths.length > 0 ? strengths : (developingAreas.length > 0 ? developingAreas : ['Active Engagement']),
      weaknesses: weaknesses.length > 0 ? weaknesses : (developingAreas.length > 0 ? developingAreas : ['Advanced Expression Precision']),
      last_assessed_at: new Date().toISOString()
    };
  }
};
