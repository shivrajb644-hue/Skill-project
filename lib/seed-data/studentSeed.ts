import { LocalStudentProfile, LearningProfile } from '../types/student';

export const SEED_DEMO_STUDENTS: LocalStudentProfile[] = [
  {
    id: 'demo-student-shivraj',
    full_name: 'Shivraj Test',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShivrajTest',
    education_level: 'Undergraduate',
    year: '3rd Year',
    primary_skill_id: 'skill-english-speaking',
    goal: 'I want to improve my English speaking and grammar for college and job interviews.',
    target_role: '3rd Year Undergraduate (CS)',
    selected_skill_ids: ['skill-english-speaking', 'skill-interview'],
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-student-ananya',
    full_name: 'Ananya Sharma',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnanyaSharma',
    education_level: 'Undergraduate',
    year: '2nd Year',
    primary_skill_id: 'skill-communication',
    goal: 'Gain confidence speaking clearly in group discussions and college presentations.',
    target_role: '2nd Year Commerce Student',
    selected_skill_ids: ['skill-communication', 'skill-english-speaking'],
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-student-rohan',
    full_name: 'Rohan Patel',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RohanPatel',
    education_level: 'Graduate/Working',
    year: 'Graduated',
    primary_skill_id: 'skill-interview',
    goal: 'Prepare a fluent self-introduction and master HR interview questions.',
    target_role: 'Recent IT Graduate',
    selected_skill_ids: ['skill-interview', 'skill-english-speaking'],
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-student-priya',
    full_name: 'Priya Nair',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaNair',
    education_level: 'Diploma',
    year: 'Final Year',
    primary_skill_id: 'skill-public-speaking',
    goal: 'Overcome stage nervousness and structure project presentations.',
    target_role: 'Engineering Diploma Student',
    selected_skill_ids: ['skill-public-speaking', 'skill-communication'],
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-student-karan',
    full_name: 'Karan Verma',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KaranVerma',
    education_level: 'Postgraduate',
    year: '1st Year',
    primary_skill_id: 'skill-english-speaking',
    goal: 'Expand business vocabulary and eliminate hesitation in spoken English.',
    target_role: '1st Year MBA Student',
    selected_skill_ids: ['skill-english-speaking', 'skill-interview'],
    created_at: new Date().toISOString()
  }
];

export const SEED_DEMO_PROFILES: LearningProfile[] = [
  {
    student_id: 'demo-student-shivraj',
    skill_id: 'skill-english-speaking',
    overall_score: 58,
    sub_skill_scores: [
      { name: 'Grammar & Tenses', score_percentage: 75, status: 'strong', evidence_count: 4 },
      { name: 'Vocabulary', score_percentage: 42, status: 'needs_practice', evidence_count: 2 },
      { name: 'Fluency & Speaking', score_percentage: 48, status: 'needs_practice', evidence_count: 2 },
      { name: 'Reading & Comprehension', score_percentage: 67, status: 'developing', evidence_count: 2 }
    ],
    strengths: ['Grammar & Tense Identification (75%)', 'Reading Comprehension (67%)'],
    weaknesses: ['Vocabulary Precision (42% - Needs Practice)', 'Spoken Fluency (48% - Needs Practice)'],
    last_assessed_at: new Date().toISOString()
  }
];
