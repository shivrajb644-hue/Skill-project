import { User, Student, Skill, Competency, Lesson, StudentEnrollment, StudentProgress } from './types';

export const INITIAL_USERS: User[] = [
  { id: '11111111-1111-1111-1111-111111111111', email: 'alex.rivera@example.com', role: 'student', created_at: new Date().toISOString() },
  { id: '22222222-2222-2222-2222-222222222222', email: 'sophia.chen@example.com', role: 'student', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333333', email: 'marcus.vance@example.com', role: 'student', created_at: new Date().toISOString() },
  { id: '44444444-4444-4444-4444-444444444444', email: 'elena.rostova@example.com', role: 'student', created_at: new Date().toISOString() },
  { id: '55555555-5555-5555-5555-555555555555', email: 'david.kim@example.com', role: 'student', created_at: new Date().toISOString() },
  { id: '99999999-9999-9999-9999-999999999999', email: 'admin@platform.com', role: 'admin', created_at: new Date().toISOString() },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    bio: 'Senior Product Manager driving enterprise SaaS strategy and cross-functional teams.',
    target_role: 'VP of Product',
    learning_goals: ['Master executive persuasion', 'Lead cross-functional alignment', 'High-stakes negotiation'],
    created_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    full_name: 'Sophia Chen',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    bio: 'Staff Software Engineer transitioning into Director of Engineering.',
    target_role: 'Director of Engineering',
    learning_goals: ['Improve team empathy', 'High-stakes technical storytelling', 'Psychological safety'],
    created_at: new Date().toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    bio: 'Enterprise Sales Lead closing strategic multi-million dollar deals.',
    target_role: 'Chief Revenue Officer',
    learning_goals: ['BATNA calculation tactics', 'Executive rapport building'],
    created_at: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    bio: 'Head of UX Design creating human-centered products.',
    target_role: 'VP of Product Design',
    learning_goals: ['Design critique advocacy', 'Stakeholder diplomacy'],
    created_at: new Date().toISOString()
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    full_name: 'David Kim',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    bio: 'AI Tech Founder building next-gen autonomous systems.',
    target_role: 'Founder & CEO',
    learning_goals: ['Venture pitch storytelling', 'Crisis management'],
    created_at: new Date().toISOString()
  }
];

export const INITIAL_SKILLS: Skill[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    title: 'Executive Communication & Storytelling',
    description: 'Structure compelling narratives, influence senior stakeholders, and command boardrooms with confidence.',
    category: 'Communication',
    level: 'Advanced',
    icon: 'MessageSquareText',
    created_at: new Date().toISOString()
  },
  {
    id: 'a2000000-0000-0000-0000-000000000002',
    title: 'High-Stakes Negotiation & Conflict Resolution',
    description: 'Formulate win-win strategies, navigate deadlocks, and resolve high-tension disputes constructively.',
    category: 'Strategy',
    level: 'Intermediate',
    icon: 'Handshake',
    created_at: new Date().toISOString()
  },
  {
    id: 'a3000000-0000-0000-0000-000000000003',
    title: 'Emotional Intelligence & Adaptive Leadership',
    description: 'Master self-awareness, active empathy, and psychological safety to empower high-performing teams.',
    category: 'Leadership',
    level: 'Intermediate',
    icon: 'BrainCircuit',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_COMPETENCIES: Competency[] = [
  // Skill 1 Competencies
  {
    id: 'b1100000-0000-0000-0000-000000000001',
    skill_id: 'a1000000-0000-0000-0000-000000000001',
    title: 'Pyramid Principle & Message Framing',
    description: 'Structure complex ideas top-down using logical grouping and clear value propositions.',
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'b1200000-0000-0000-0000-000000000002',
    skill_id: 'a1000000-0000-0000-0000-000000000001',
    title: 'Vocal Gravitas & Executive Presence',
    description: 'Leverage tonal cadence, deliberate pacing, and assertive body language.',
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'b1300000-0000-0000-0000-000000000003',
    skill_id: 'a1000000-0000-0000-0000-000000000001',
    title: 'Handling Hostile Q&A & Pushback',
    description: 'De-escalate skeptical questions and steer conversations back to strategic priorities.',
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // Skill 2 Competencies
  {
    id: 'b2100000-0000-0000-0000-000000000001',
    skill_id: 'a2000000-0000-0000-0000-000000000002',
    title: 'Interest-Based Bargaining (BATNA)',
    description: 'Identify underlying interests behind rigid positions to expand the value pie.',
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'b2200000-0000-0000-0000-000000000002',
    skill_id: 'a2000000-0000-0000-0000-000000000002',
    title: 'De-escalating High-Tension Deadlocks',
    description: 'Use tactical empathy and mirroring to disarm aggression during negotiations.',
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'b2300000-0000-0000-0000-000000000003',
    skill_id: 'a2000000-0000-0000-0000-000000000002',
    title: 'Closing & Sustainable Alignment',
    description: 'Draft durable agreements that align incentives and prevent post-deal friction.',
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // Skill 3 Competencies
  {
    id: 'b3100000-0000-0000-0000-000000000001',
    skill_id: 'a3000000-0000-0000-0000-000000000003',
    title: 'Active Empathy & Perspective Taking',
    description: 'Decode verbal and micro-expressions to understand underlying team motivations.',
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'b3200000-0000-0000-0000-000000000002',
    skill_id: 'a3000000-0000-0000-0000-000000000003',
    title: 'Psychological Safety Creation',
    description: 'Build environment where team members feel safe taking calculated risks and speaking up.',
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'b3300000-0000-0000-0000-000000000003',
    skill_id: 'a3000000-0000-0000-0000-000000000003',
    title: 'Situational Leadership Adaptation',
    description: 'Flex your leadership style based on team member task readiness and emotional maturity.',
    order_index: 3,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  // 3 lessons for Competency 1.1
  {
    id: 'c1110000-0000-0000-0000-000000000001',
    competency_id: 'b1100000-0000-0000-0000-000000000001',
    title: 'The Core Minto Pyramid Structure',
    content: `### Executive Overview
The **Pyramid Principle** states that executive communications should begin with the main conclusion first, followed by supporting logical arguments, and finally detailed supporting data.

#### Key Principles:
1. **Answer First**: State your core thesis or recommendation in the first 30 seconds.
2. **Logical Grouping**: Group supporting arguments logically into categories (e.g. Financial, Operational, Strategic).
3. **MECE Order**: Ensure arguments do not overlap and leave no major gaps.`,
    duration_minutes: 12,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1120000-0000-0000-0000-000000000002',
    competency_id: 'b1100000-0000-0000-0000-000000000001',
    title: 'Situation-Complication-Resolution (SCR)',
    content: `### Framing Executive Narratives
The **SCR Framework** builds narrative tension and provides immediate relevance for senior stakeholders.

- **Situation**: Current state baseline agreed upon by all parties.
- **Complication**: The bottleneck, shift, or threat disrupting the baseline.
- **Resolution**: Your proposed strategic recommendation to solve the complication.`,
    duration_minutes: 15,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1130000-0000-0000-0000-000000000003',
    competency_id: 'b1100000-0000-0000-0000-000000000001',
    title: 'MECE Grouping for Bulletproof Logic',
    content: `### Structuring Rigorous Insights
MECE stands for **Mutually Exclusive, Collectively Exhaustive**.

- **Mutually Exclusive**: Each point in your argument is distinct and avoids redundancy.
- **Collectively Exhaustive**: Together, your points cover 100% of the solution space.`,
    duration_minutes: 20,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 1.2
  {
    id: 'c1210000-0000-0000-0000-000000000001',
    competency_id: 'b1200000-0000-0000-0000-000000000002',
    title: 'Pacing & Strategic Pauses',
    content: `### Mastering Room Command
Fast talkers often signal anxiety or low confidence. Strategic 2-second pauses allow your audience to process high-value statements.`,
    duration_minutes: 10,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1220000-0000-0000-0000-000000000002',
    competency_id: 'b1200000-0000-0000-0000-000000000002',
    title: 'Tonal Resonance & Pitch Modulation',
    content: `### Eliminating Vocal Fillers
Eliminate uptones ("upspeak") which make statements sound like questions. End key recommendations with a downward inflection.`,
    duration_minutes: 14,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1230000-0000-0000-0000-000000000003',
    competency_id: 'b1200000-0000-0000-0000-000000000002',
    title: 'Commanding Hybrid & Virtual Boardrooms',
    content: `### Virtual Executive Presence
Calibrate eye contact directly into the camera lens, adjust lighting, and maintain open, expansive upper-body posture during video briefings.`,
    duration_minutes: 18,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 1.3
  {
    id: 'c1310000-0000-0000-0000-000000000001',
    competency_id: 'b1300000-0000-0000-0000-000000000003',
    title: 'The Acknowledge-Bridge-Deliver Technique',
    content: `### Steering Hostile Pushback
When faced with skeptical questions:
1. **Acknowledge**: Validate the underlying concern ("That is a critical risk to flag...").
2. **Bridge**: Transition smoothly ("What our data also reveals is...").
3. **Deliver**: Provide your core strategic evidence.`,
    duration_minutes: 15,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1320000-0000-0000-0000-000000000002',
    competency_id: 'b1300000-0000-0000-0000-000000000003',
    title: 'Managing Aggressive Interrupters',
    content: `### Maintaining Boardroom Decorum
Politely hold the floor with composure ("Allow me to finish this 30-second context, and then I want to address your point directly").`,
    duration_minutes: 12,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c1330000-0000-0000-0000-000000000003',
    competency_id: 'b1300000-0000-0000-0000-000000000003',
    title: 'Answering "I Don\'t Know" Like an Executive',
    content: `### Authentic Leadership Transparency
Never guess metrics. Own data gaps with conviction: "We have not modeled that specific edge case yet; I will deliver that analysis by 5 PM tomorrow."`,
    duration_minutes: 10,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 2.1
  {
    id: 'c2110000-0000-0000-0000-000000000001',
    competency_id: 'b2100000-0000-0000-0000-000000000001',
    title: 'Calculating Your True BATNA',
    content: `### Preparation in Negotiation
Your **BATNA** (Best Alternative To a Negotiated Agreement) dictates your walk-away power. Always quantify your alternative option before entering the room.`,
    duration_minutes: 20,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2120000-0000-0000-0000-000000000002',
    competency_id: 'b2100000-0000-0000-0000-000000000001',
    title: 'Uncovering Hidden Positions vs Interests',
    content: `### Moving Beyond Fixed Demands
Positions are *what* people say they want. Interests are *why* they want it. Ask probing questions to uncover underlying organizational incentives.`,
    duration_minutes: 18,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2130000-0000-0000-0000-000000000003',
    competency_id: 'b2100000-0000-0000-0000-000000000001',
    title: 'ZOPA Expansion Strategies',
    content: `### Expanding the Zone of Possible Agreement
Trade low-cost high-value items (e.g., payment terms, marketing co-branding, extended support) to resolve price deadlocks.`,
    duration_minutes: 15,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 2.2
  {
    id: 'c2210000-0000-0000-0000-000000000001',
    competency_id: 'b2200000-0000-0000-0000-000000000002',
    title: 'Tactical Empathy & Labeling Emotions',
    content: `### Disarming Negotiation Aggression
Use neutral emotional labels ("It sounds like you feel under immense pressure regarding this timeline") to immediately lower defensive adrenaline.`,
    duration_minutes: 15,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2220000-0000-0000-0000-000000000002',
    competency_id: 'b2200000-0000-0000-0000-000000000002',
    title: 'Mirroring for Information Gathering',
    content: `### Chris Voss Mirroring Technique
Repeat the last 1-3 critical words spoken by the counterpart with an inquiring tone to get them to expand voluntarily.`,
    duration_minutes: 12,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2230000-0000-0000-0000-000000000003',
    competency_id: 'b2200000-0000-0000-0000-000000000002',
    title: 'Calibrated Questions ("How am I supposed to do that?")',
    content: `### Guiding Counterparts to Solve Your Problems
Ask open-ended "How" or "What" questions that place the burden of problem-solving onto the other party without provoking conflict.`,
    duration_minutes: 16,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 2.3
  {
    id: 'c2310000-0000-0000-0000-000000000001',
    competency_id: 'b2300000-0000-0000-0000-000000000003',
    title: 'Implementation Planning During Deal Structuring',
    content: `### Preventing Post-Deal Failure
A contract signed without operational buy-in leads to execution disputes. Include execution leads directly in final terms review.`,
    duration_minutes: 14,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2320000-0000-0000-0000-000000000002',
    competency_id: 'b2300000-0000-0000-0000-000000000003',
    title: 'Post-Deal Governance & Escalation Triggers',
    content: `### Pre-Agreeing on Dispute Protocols
Establish clear 3-step escalation paths for scope modifications before project execution commences.`,
    duration_minutes: 12,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2330000-0000-0000-0000-000000000003',
    competency_id: 'b2300000-0000-0000-0000-000000000003',
    title: 'Securing High-Value Commitments',
    content: `### Confirming Real Buy-in
Distinguish passive "Yes" responses from genuine operational commitments. Test agreements with implementation deadlines.`,
    duration_minutes: 18,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 3.1
  {
    id: 'c3110000-0000-0000-0000-000000000001',
    competency_id: 'b3100000-0000-0000-0000-000000000001',
    title: 'Self-Regulation & Trigger Auditing',
    content: `### Emotional Awareness Under Pressure
Recognize physiological fight-or-flight triggers in meetings and utilize micro-breath grounding before responding.`,
    duration_minutes: 15,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3120000-0000-0000-0000-000000000002',
    competency_id: 'b3100000-0000-0000-0000-000000000001',
    title: 'Active Empathy Beyond Surface Words',
    content: `### Decoding Non-Verbal Cues
Tune in to tonal shifts, pauses, and body language during 1-on-1 team member check-ins.`,
    duration_minutes: 16,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3130000-0000-0000-0000-000000000003',
    competency_id: 'b3100000-0000-0000-0000-000000000001',
    title: 'Empathy Mapping for Organizational Alignment',
    content: `### Understanding Cross-Functional Partners
Build empathy maps (Says, Thinks, Does, Feels) for cross-functional stakeholders before proposing organizational changes.`,
    duration_minutes: 18,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 3.2
  {
    id: 'c3210000-0000-0000-0000-000000000001',
    competency_id: 'b3200000-0000-0000-0000-000000000002',
    title: 'Blameless Post-Mortems & Risk Culture',
    content: `### Creating Failure Tolerant Systems
Focus post-mortems on process flaws rather than personal blame to encourage high innovation velocity.`,
    duration_minutes: 20,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3220000-0000-0000-0000-000000000002',
    competency_id: 'b3200000-0000-0000-0000-000000000002',
    title: 'Fostering Constructive Dissent',
    content: `### Rewarding Independent Critical Thinking
Actively reward team members who challenge executive assumptions during architectural reviews.`,
    duration_minutes: 14,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3230000-0000-0000-0000-000000000003',
    competency_id: 'b3200000-0000-0000-0000-000000000002',
    title: 'Radical Candor in Performance Feedback',
    content: `### Care Personally, Challenge Directly
Deliver clear actionable feedback immediately without delaying until annual reviews.`,
    duration_minutes: 15,
    order_index: 3,
    created_at: new Date().toISOString()
  },

  // 3 lessons for Competency 3.3
  {
    id: 'c3310000-0000-0000-0000-000000000001',
    competency_id: 'b3300000-0000-0000-0000-000000000003',
    title: 'Diagnosing Task Readiness vs Competence',
    content: `### Hersey-Blanchard Situational Model
Match your management involvement (Directing, Coaching, Supporting, Delegating) to the team member's specific task readiness.`,
    duration_minutes: 15,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3320000-0000-0000-0000-000000000002',
    competency_id: 'b3300000-0000-0000-0000-000000000003',
    title: 'Coaching vs Directing Modes',
    content: `### Asking Powerful Socratic Questions
Resist giving immediate answers; guide engineers and managers to discover solutions through strategic inquiry.`,
    duration_minutes: 12,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3330000-0000-0000-0000-000000000003',
    competency_id: 'b3300000-0000-0000-0000-000000000003',
    title: 'Leading Through Organizational Ambiguity',
    content: `### Grounding Teams During Strategic Pivots
Provide vision stability and clear 30-day tactical focus during periods of macro-uncertainty.`,
    duration_minutes: 18,
    order_index: 3,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_ENROLLMENTS: StudentEnrollment[] = [
  { id: 'e1', student_id: '11111111-1111-1111-1111-111111111111', skill_id: 'a1000000-0000-0000-0000-000000000001', status: 'active', enrolled_at: new Date().toISOString() },
  { id: 'e2', student_id: '11111111-1111-1111-1111-111111111111', skill_id: 'a2000000-0000-0000-0000-000000000002', status: 'active', enrolled_at: new Date().toISOString() },
  { id: 'e3', student_id: '22222222-2222-2222-2222-222222222222', skill_id: 'a1000000-0000-0000-0000-000000000001', status: 'active', enrolled_at: new Date().toISOString() },
  { id: 'e4', student_id: '22222222-2222-2222-2222-222222222222', skill_id: 'a3000000-0000-0000-0000-000000000003', status: 'active', enrolled_at: new Date().toISOString() },
  { id: 'e5', student_id: '33333333-3333-3333-3333-333333333333', skill_id: 'a2000000-0000-0000-0000-000000000002', status: 'active', enrolled_at: new Date().toISOString() },
  { id: 'e6', student_id: '44444444-4444-4444-4444-444444444444', skill_id: 'a1000000-0000-0000-0000-000000000001', status: 'active', enrolled_at: new Date().toISOString() },
  { id: 'e7', student_id: '55555555-5555-5555-5555-555555555555', skill_id: 'a3000000-0000-0000-0000-000000000003', status: 'active', enrolled_at: new Date().toISOString() },
];

export const INITIAL_PROGRESS: StudentProgress[] = [
  { id: 'p1', student_id: '11111111-1111-1111-1111-111111111111', lesson_id: 'c1110000-0000-0000-0000-000000000001', status: 'completed', completed_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'p2', student_id: '11111111-1111-1111-1111-111111111111', lesson_id: 'c1120000-0000-0000-0000-000000000002', status: 'completed', completed_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'p3', student_id: '11111111-1111-1111-1111-111111111111', lesson_id: 'c1130000-0000-0000-0000-000000000003', status: 'in_progress' },
];
