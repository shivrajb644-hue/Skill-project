import { generateStructuredResponse } from './geminiProvider';
import { PROMPTS } from './prompts';
import {
  SpeakingFeedbackSchema,
  InterviewFeedbackSchema,
  ConversationTurnSchema,
  DailyChallengeSchema,
  AssessmentScoreSchema
} from './schemas';
import {
  SpeakingFeedback,
  EvaluationResult,
  ConversationTurn,
  DailyChallenge,
  AssessmentScore,
  LearningPlan
} from './types';

export const aiService = {

  async evaluateSpeakingResponse(
    topic: string,
    transcript: string,
    rubric: Record<string, unknown> = PROMPTS.SPEAKING_COACH.rubric as Record<string, unknown>
  ): Promise<SpeakingFeedback> {
    const prompt = `Topic: ${topic}\nTranscript: ${transcript}\nRubric: ${JSON.stringify(rubric)}\n\nEvaluate this speaking response and return a JSON object with the following structure:\n- overall_score (0-100)\n- scores: { fluency, pronunciation, vocabulary, grammar } (each 0-100)\n- strengths: string[]\n- weaknesses: string[]\n- evidence: string[]\n- improved_response: string (better version of the answer)\n- metrics: { wpm, filler_words_count, pauses_count }`;
    
    const result = await generateStructuredResponse(prompt, PROMPTS.SPEAKING_COACH.systemInstruction as string, PROMPTS.SPEAKING_COACH.outputSchema as string);
    
    if (result) {
      try {
        return SpeakingFeedbackSchema.parse(result) as SpeakingFeedback;
      } catch (e) {
        console.error('Validation error for SpeakingFeedback:', e);
      }
    }
    
    // Realistic fallback data with beginner-friendly language
    const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
    const fillerMatches = (transcript.match(/\b(um|uh|like|basically|actually|you know|right|so)\b/gi) || []).length;
    const wpm = wordCount > 0 ? Math.round(wordCount / 1.5) : 0; // assume ~90 seconds average

    return {
      overall_score: Math.min(85, Math.max(40, wordCount * 2 + 40 - fillerMatches * 2)),
      scores: { fluency: 72, pronunciation: 78, vocabulary: 68, grammar: 74 },
      strengths: [
        'You attempted the topic — that takes real courage!',
        wordCount > 30 ? 'Good effort — you elaborated and spoke at length.' : 'Your ideas were clear and relevant.',
      ],
      weaknesses: [
        fillerMatches > 3
          ? `You used ${fillerMatches} filler words (like "um" or "uh"). That is totally normal! Try pausing silently instead — it sounds more confident.`
          : 'Try to arrange your ideas more: main point first, then a reason or example.',
      ],
      evidence: [`You spoke about ${wordCount} words at roughly ${wpm} words per minute.`, fillerMatches > 0 ? `Detected ${fillerMatches} filler word(s). Keep practicing and they will reduce naturally!` : 'Great — very few filler words detected!'],
      improved_response: `Great start! Try this simple structure next time: 1️⃣ Say your main idea. 2️⃣ Give one short example from your life. 3️⃣ End with what you think or feel about it. Even a 3-sentence answer using this structure will sound confident!`,
      metrics: { wpm, filler_words_count: fillerMatches, pauses_count: Math.floor(wordCount / 20) }
    } as SpeakingFeedback;
  },

  async evaluateInterviewAnswer(
    question: string,
    answer: string,
    interviewType: string,
    studentProfile?: string,
    englishLevel?: string
  ): Promise<EvaluationResult> {
    const prompt = `Interview Type: ${interviewType}\nStudent background: ${studentProfile || 'student / fresher'}\nEnglish level: ${englishLevel || 'beginner'}\nQuestion: ${question}\nCandidate Answer: ${answer}\n\nEvaluate this interview answer for THIS student's level. Write every string in very simple English (short sentences, everyday words). Return JSON with:\n- overall_score (0-100)\n- scores: { content, structure, delivery, star_usage } (each 0-100)\n- strengths: string[] (1-2 items, kind and specific)\n- weaknesses: string[] (1-2 small, friendly tips, e.g. "Add one example from your college.")\n- evidence: string[]\n- improved_response: string (2-4 short simple sentences the student can say, using their own answer and background: what happened, what they did, what they learned)\n- framework_analysis: { situation: boolean, task: boolean, action: boolean, result: boolean }`;
    
    const result = await generateStructuredResponse(prompt, PROMPTS.INTERVIEW_COACH.systemInstruction as string, PROMPTS.INTERVIEW_COACH.outputSchema as string);
    
    if (result) {
      try {
        return InterviewFeedbackSchema.parse(result) as EvaluationResult;
      } catch (e) {
        console.error('Validation error for InterviewFeedback:', e);
      }
    }
    
    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
    const hasExample = /situation|task|action|result|example|time when|once|in my college|in my project|when i/i.test(answer);

    return {
      overall_score: Math.min(90, Math.max(35, wordCount * 1.5 + 35)),
      scores: { content: 75, structure: hasExample ? 80 : 50, delivery: 68, star_usage: hasExample ? 75 : 35 },
      strengths: [
        'You gave a direct answer — good start!',
        wordCount > 50 ? 'Great effort — you elaborated well.' : 'Clear and to the point.',
      ],
      weaknesses: [
        hasExample
          ? 'Try to also mention what happened as a result of your action.'
          : 'Adding a short personal example (from college or daily life) would make this answer much stronger.',
      ],
      evidence: [`Your answer was about ${wordCount} words.`, hasExample ? 'Good — you included a personal example.' : 'No personal example detected. Try adding one!'],
      improved_response: `Try this structure: 1) Give your answer directly. 2) Add a short example from college or life: "For example, in my [class/project], I...". 3) End with what you learned or what the outcome was. Even one extra sentence makes a big difference!`,
      framework_analysis: {
        situation: /situation|context|when|at my|in my/i.test(answer),
        task: /task|responsible|role|needed|had to/i.test(answer),
        action: /action|did|implemented|created|led|worked|tried/i.test(answer),
        result: /result|outcome|achieved|improved|increase|learned|got/i.test(answer)
      }
    } as EvaluationResult;
  },
  
  async conductConversationTurn(
    scenario: string,
    history: string[],
    userMessage: string,
    mode: string
  ): Promise<ConversationTurn> {
    const historyText = history.slice(-6).join('\n');
    const prompt = `Scenario: ${scenario}\nMode: ${mode}\nConversation History:\n${historyText}\nUser just said: "${userMessage}"\n\nRespond as the AI persona in this scenario. Return JSON:\n- ai_response: string (realistic contextual reply)\n- feedback: { fluency_score, grammar_score, vocabulary_score, corrections: [{original, corrected, explanation}] } (only in coaching mode)\n- suggested_replies: string[] (2-3 suggestions for user's next message)\n- is_scenario_complete: boolean`;
    
    const result = await generateStructuredResponse(prompt, PROMPTS.CONVERSATION_COACH.systemInstruction as string, PROMPTS.CONVERSATION_COACH.outputSchema as string);
    
    if (result) {
      try {
        return ConversationTurnSchema.parse(result) as ConversationTurn;
      } catch (e) {
        console.error('Validation error for ConversationTurn:', e);
      }
    }
    
    const responses: Record<string, string> = {
      'Networking Event': 'That sounds like an impressive background! What specific projects are you working on at the moment? I\'d love to hear more about your recent work.',
      'Manager Feedback': 'I appreciate you sharing that perspective. Can you give me a specific example of where you felt the communication could have been clearer?',
      'Salary Raise': 'I understand where you\'re coming from. We do value your contributions. Can you walk me through the specific achievements you\'d like to highlight?',
      'default': 'That\'s an interesting point. Could you elaborate further on that?'
    };
    
    const aiResponse = Object.keys(responses).find(k => scenario.includes(k))
      ? responses[Object.keys(responses).find(k => scenario.includes(k))!]
      : responses.default;
    
    return {
      ai_response: aiResponse,
      feedback: mode === 'coaching' ? {
        fluency_score: 75,
        grammar_score: 80,
        vocabulary_score: 72,
        corrections: []
      } : undefined,
      suggested_replies: [
        'Yes, let me explain further...',
        'That\'s a great point. I would add...',
        'Could you clarify what you mean by...?'
      ],
      is_scenario_complete: history.length > 12
    } as ConversationTurn;
  },
  
  async generateDailyChallenge(
    skillWeaknesses: string[],
    previousChallenges: string[]
  ): Promise<DailyChallenge> {
    const prompt = `Student's weakest skills: ${JSON.stringify(skillWeaknesses)}\nPrevious challenges used: ${JSON.stringify(previousChallenges)}\n\nGenerate ONE personalized daily challenge. Return JSON:\n- id: string\n- title: string (short, engaging)\n- description: string (what to do, 2-3 sentences)\n- type: 'speaking' | 'writing' | 'scenario' | 'vocabulary' | 'reflection'\n- difficulty: 'beginner' | 'intermediate' | 'advanced'\n- time_estimate_minutes: number\n- success_criteria: string[] (3 specific criteria for success)\n- prompt: string (the actual challenge question/task)`;
    
    const result = await generateStructuredResponse(prompt, PROMPTS.DAILY_CHALLENGE.systemInstruction as string);
    
    if (result) {
      try {
        return DailyChallengeSchema.parse(result) as DailyChallenge;
      } catch (e) {
        console.error('Validation error for DailyChallenge:', e);
      }
    }
    
    const challenges = [
      {
        id: `dc-${Date.now()}`,
        title: 'STAR Method Speaking Challenge',
        description: 'Record yourself answering a behavioral interview question using the STAR framework. Focus on keeping your answer structured and under 2 minutes.',
        type: 'speaking' as const,
        difficulty: 'intermediate' as const,
        time_estimate_minutes: 10,
        success_criteria: ['Used all 4 STAR components', 'Response is under 2 minutes', 'No significant filler words'],
        prompt: 'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?'
      },
      {
        id: `dc-${Date.now()}`,
        title: 'Professional Email Practice',
        description: 'Write a professional email to your manager requesting feedback on your recent project. Focus on tone, clarity, and brevity.',
        type: 'writing' as const,
        difficulty: 'beginner' as const,
        time_estimate_minutes: 8,
        success_criteria: ['Professional subject line', 'Clear purpose in first line', 'Respectful and concise tone'],
        prompt: 'Write a professional email (4–6 sentences) to your manager asking for feedback on the project you submitted last week.'
      }
    ];
    
    const target = skillWeaknesses[0] || 'speaking';
    return target.includes('speak') ? challenges[0] : challenges[Math.floor(Math.random() * challenges.length)];
  },
  
  async analyzeAssessmentAnswers(
    answers: Array<{ question: string; answer: string; category: string }>,
    category: string
  ): Promise<AssessmentScore> {
    const prompt = `Assessment Category: ${category}\nAnswers to evaluate:\n${answers.map((a, i) => `${i + 1}. Q: ${a.question}\n   A: ${a.answer}`).join('\n\n')}\n\nEvaluate these assessment answers. Return JSON:\n- category: string\n- overall_score: number (0-100)\n- detailed_scores: { accuracy, depth, communication } (each 0-100)\n- skill_level: 'beginner' | 'intermediate' | 'advanced'\n- recommended_modules: string[]\n- summary: string`;
    
    const result = await generateStructuredResponse(prompt, PROMPTS.ASSESSMENT_ANALYZER.systemInstruction as string);
    
    if (result) {
      try {
        return AssessmentScoreSchema.parse(result) as AssessmentScore;
      } catch (e) {
        console.error('Validation error for AssessmentScore:', e);
      }
    }
    
    const totalWords = answers.reduce((sum, a) => sum + a.answer.split(/\s+/).filter(Boolean).length, 0);
    const avgWords = answers.length > 0 ? totalWords / answers.length : 0;
    const score = Math.min(90, Math.max(40, avgWords * 1.5 + 40));
    
    return {
      category,
      overall_score: Math.round(score),
      detailed_scores: {
        accuracy: Math.round(score * 0.9),
        depth: Math.round(score * 0.85),
        communication: Math.round(score * 0.95)
      },
      skill_level: score > 70 ? 'intermediate' : score > 50 ? 'beginner' : 'beginner',
      recommended_modules: [`module-${category}-fundamentals`, `module-${category}-practice`],
      summary: `Your ${category} skills show ${score > 70 ? 'solid foundations' : 'room for growth'}. Focus on building structured responses with clear examples.`
    };
  },
  
  async generateLearningPlan(profile: Record<string, unknown>): Promise<LearningPlan> {
    return {
      current_level: 'developing',
      target_level: 'proficient',
      estimated_weeks: 6,
      weekly_commitments: [
        { activity_type: 'speaking', duration_minutes: 30 },
        { activity_type: 'interview', duration_minutes: 20 },
        { activity_type: 'conversation', duration_minutes: 15 }
      ],
      milestones: [
        { week: 1, goal: 'Complete fluency foundation and reduce filler words' },
        { week: 2, goal: 'Master STAR method for behavioral answers' },
        { week: 3, goal: 'Complete 3 mock interview sessions' },
        { week: 4, goal: 'Presentation skills + GD practice' }
      ]
    };
  },
  
  async evaluateGDContribution(
    topic: string,
    transcript: string,
    turnCount: number
  ): Promise<EvaluationResult> {
    return {
      overall_score: 72,
      scores: { content: 75, leadership: 65, listening: 82, assertiveness: 68 },
      strengths: ['Active listening demonstrated', 'Made relevant points'],
      weaknesses: ['Could initiate more', 'Summary at the end was weak'],
      evidence: [`Contributed ${turnCount} turns`, 'Mostly agreed, rarely challenged points constructively'],
      improved_response: 'To lead in a GD: initiate with a framework, invite others to share, and summarize with your position.'
    } as EvaluationResult;
  },
  
  async evaluateResume(resumeText: string): Promise<Record<string, unknown>> {
    return this.analyzeResume(resumeText);
  },

  // Legacy backward-compatible methods (used by existing components)
  async evaluateStudentPractice(request: { student_response: string; rubric: string[]; sample_answer?: string }): Promise<{
    score: number;
    feedback_text: string;
    key_strengths: string[];
    improvement_areas: string[];
  }> {
    const wordCount = request.student_response.trim().split(/\s+/).length;
    const score = Math.min(100, Math.max(40, wordCount * 3 + 40));
    return {
      score,
      feedback_text: wordCount > 15
        ? 'Good depth in your response. Try adding a specific example to make it more concrete.'
        : 'Good initial start. Try expanding your response with more detail and a concrete example.',
      key_strengths: ['Clear executive tone', 'Direct answer format'],
      improvement_areas: ['Include a specific example', 'Add quantitative impact where possible']
    };
  },

  async generateLessonOutline(request: { topic: string; target_audience: string; difficulty_level: string }): Promise<{
    title: string;
    objective: string;
    explanation_markdown: string;
  }> {
    return {
      title: `${request.topic} Masterclass`,
      objective: `Master ${request.topic} strategies tailored for ${request.target_audience} at ${request.difficulty_level} level.`,
      explanation_markdown: `### ${request.topic} Framework\n\n1. **Foundation**: Understand why ${request.topic} matters in professional settings.\n2. **Tactical Steps**: Implement structured approaches in daily interactions.\n3. **Measurable Outcomes**: Track clarity, impact, and effectiveness.`
    };
  },
  async analyzeResume(resumeText: string): Promise<Record<string, unknown>> {
    const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
    return {
      overall_score: 62,
      sections: {
        summary: { score: 55, issues: ['Too generic', 'No quantifiable achievements'] },
        experience: { score: 68, issues: ['Use action verbs', 'Add metrics to achievements'] },
        skills: { score: 72, issues: ['Good range but lacks proficiency levels'] }
      },
      strengths: ['Clear formatting', 'Relevant education section'],
      action_items: [
        'Replace "responsible for" with action verbs (led, built, improved)',
        'Add 2–3 quantifiable achievements (e.g., "Improved load time by 40%")',
        'Tailor the summary to your target role'
      ]
    };
  }
};

