import { Skill, Competency, LearningOutcome, Lesson, Activity, AssessmentItem } from '../types/curriculum';

export const SEED_SKILLS: Skill[] = [
  {
    id: 'skill-english-speaking',
    title: 'English Speaking',
    description: 'Improve spoken English fluency, practical grammar, daily vocabulary, prepositions, and confidence for college and job interviews.',
    category: 'Speaking',
    level: 'Beginner',
    icon: 'MessageSquareText',
    created_at: new Date().toISOString()
  },
  {
    id: 'skill-communication',
    title: 'Communication & Expression',
    description: 'Express your ideas clearly, actively listen, participate in college discussions, and build interpersonal confidence.',
    category: 'Communication',
    level: 'Beginner',
    icon: 'Sparkles',
    created_at: new Date().toISOString()
  },
  {
    id: 'skill-interview',
    title: 'Job Interview Skills',
    description: 'Master self-introductions, answer common HR & technical interview questions with structure (STAR method), and impress recruiters.',
    category: 'Speaking',
    level: 'Intermediate',
    icon: 'Briefcase',
    created_at: new Date().toISOString()
  },
  {
    id: 'skill-public-speaking',
    title: 'Public Speaking',
    description: 'Deliver confident college presentations, overcome stage fear, structure speeches, and engage your audience.',
    category: 'Speaking',
    level: 'Intermediate',
    icon: 'Mic',
    created_at: new Date().toISOString()
  }
];

export const SEED_COMPETENCIES: Competency[] = [
  // English Speaking Competencies
  { id: 'comp-eng-grammar', skill_id: 'skill-english-speaking', title: 'Practical Grammar & Tenses', description: 'Master daily tenses, articles, and prepositions used in college and conversations.', order_index: 1, created_at: new Date().toISOString() },
  { id: 'comp-eng-vocab', skill_id: 'skill-english-speaking', title: 'Everyday & College Vocabulary', description: 'Learn useful English words and expressions to replace repetitive basic terms.', order_index: 2, created_at: new Date().toISOString() },
  { id: 'comp-eng-fluency', skill_id: 'skill-english-speaking', title: 'Spoken Fluency & Hesitation Control', description: 'Reduce long pauses, filler words, and form sentences smoothly without overthinking.', order_index: 3, created_at: new Date().toISOString() },
  { id: 'comp-eng-comprehension', skill_id: 'skill-english-speaking', title: 'Reading & Listening Comprehension', description: 'Understand spoken and written English passages accurately in academic context.', order_index: 4, created_at: new Date().toISOString() },

  // Communication Competencies
  { id: 'comp-comm-clarity', skill_id: 'skill-communication', title: 'Speaking Clarity & Tone', description: 'Articulate thoughts concisely and maintain an engaging, respectful tone.', order_index: 1, created_at: new Date().toISOString() },
  { id: 'comp-comm-listening', skill_id: 'skill-communication', title: 'Active Listening & Response', description: 'Listen attentively without interrupting and respond appropriately to questions.', order_index: 2, created_at: new Date().toISOString() },

  // Interview Skills Competencies
  { id: 'comp-interview-intro', skill_id: 'skill-interview', title: 'Self-Introduction & Elevator Pitch', description: 'Craft a 60-second confident self-introduction covering background, skills, and goals.', order_index: 1, created_at: new Date().toISOString() },
  { id: 'comp-interview-star', skill_id: 'skill-interview', title: 'Structured Answer Delivery (STAR)', description: 'Answer behavioral interview questions using Situation, Task, Action, Result framework.', order_index: 2, created_at: new Date().toISOString() },

  // Public Speaking Competencies
  { id: 'comp-ps-confidence', skill_id: 'skill-public-speaking', title: 'Overcoming Stage Nervousness', description: 'Manage pre-presentation anxiety and project confident body posture.', order_index: 1, created_at: new Date().toISOString() }
];

export const SEED_OUTCOMES: LearningOutcome[] = [
  { id: 'out-eng-1', competency_id: 'comp-eng-grammar', statement: 'Learner uses past simple and present continuous tenses accurately.', description: 'Zero verb tense errors in daily sentences.', mastery_threshold: 75, created_at: new Date().toISOString() },
  { id: 'out-eng-2', competency_id: 'comp-eng-vocab', statement: 'Learner incorporates 10 new expressive vocabulary words in speaking.', description: 'Active use of varied descriptive vocabulary.', mastery_threshold: 75, created_at: new Date().toISOString() },
  { id: 'out-interview-1', competency_id: 'comp-interview-intro', statement: 'Learner delivers a clear 45-second interview self-introduction.', description: 'Confident self-introduction without hesitating.', mastery_threshold: 80, created_at: new Date().toISOString() }
];

export const SEED_LESSONS: Lesson[] = [
  {
    id: 'les-eng-vocab-1',
    outcome_id: 'out-eng-2',
    competency_id: 'comp-eng-vocab',
    title: 'Building Practical Everyday Vocabulary',
    objective: 'Learn 8 essential English words to describe your college projects, routine, and achievements clearly.',
    explanation_markdown: `### Why Simple, Precise Vocabulary Helps
In college discussions and job interviews, using precise descriptive words helps you explain your thoughts quickly.

#### 5 Useful Words to Use Today:
1. **Reliable** *(Adjective)*: Dependable, trustworthy.
   - *Example*: *"Rahul is a reliable teammate during group assignments."*
2. **Collaborate** *(Verb)*: Work together with others.
   - *Example*: *"I collaborated with two classmates to complete our science project."*
3. **Achieve** *(Verb)*: Successfully finish or reach a goal.
   - *Example*: *"She worked hard to achieve top marks in her final semester."*
4. **Articulate** *(Adjective)*: Expressing ideas clearly in speech.
   - *Example*: *"Her presentation was articulate and easy to follow."*
5. **Initial** *(Adjective)*: Happening at the beginning.
   - *Example*: *"Our initial plan was to meet in the library."*`,
    resources: [
      { id: 'res-yt-vocab', type: 'youtube', title: 'Daily English Vocabulary for College Students', url: 'https://www.youtube.com/embed/L_LUpnjgPso', description: 'Practical vocabulary video lesson.' }
    ],
    duration_minutes: 12,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'les-eng-grammar-1',
    outcome_id: 'out-eng-1',
    competency_id: 'comp-eng-grammar',
    title: 'Mastering Past Tense for Daily Stories & Assignments',
    objective: 'Avoid mixing present and past tenses when describing what you did yesterday or in past projects.',
    explanation_markdown: `### Common Mistakes to Avoid
Many learners say: *"Yesterday I go to college and completed my work."*
Correct phrasing: *"Yesterday I **went** to college and **completed** my work."*

#### Quick Rule:
- When describing a completed past event (yesterday, last week, last year), use the **Past Simple** form of the verb (*went, studied, finished, joined*).`,
    resources: [
      { id: 'res-yt-grammar', type: 'youtube', title: 'Mastering English Tenses Made Easy', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Tense practice guide.' }
    ],
    duration_minutes: 10,
    order_index: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'les-interview-intro-1',
    outcome_id: 'out-interview-1',
    competency_id: 'comp-interview-intro',
    title: 'Crafting Your 30-Second Self-Introduction',
    objective: 'Structure a confident 30-second self-introduction for college viva, campus placements, or interviews.',
    explanation_markdown: `### The 3-Part Self-Intro Formula
1. **Greeting & Identity**: *"Hello, my name is [Name], and I am currently in my 3rd year studying Computer Science at [College]."*
2. **Key Interest / Achievement**: *"I am passionate about web development and recently led a team project on interactive learning platforms."*
3. **Goal**: *"I am looking forward to applying my skills in software engineering and improving my professional communication."*`,
    resources: [
      { id: 'res-yt-intro', type: 'youtube', title: 'How to Introduce Yourself in English', url: 'https://www.youtube.com/embed/YoZBLBRhUOk', description: 'Self intro video guide.' }
    ],
    duration_minutes: 15,
    order_index: 3,
    created_at: new Date().toISOString()
  }
];

export const SEED_ACTIVITIES: Activity[] = [
  {
    id: 'act-eng-vocab-guided',
    lesson_id: 'les-eng-vocab-1',
    type: 'guided_practice',
    title: 'Guided Practice: Replacing Basic Words',
    instruction: 'Upgrade the sentence below using the word "collaborate":\n\n*Basic: "I worked together with my friend on the assignment."*',
    resources: [],
    sample_answer: 'I collaborated with my classmate on the college assignment.',
    rubric_criteria: ['Uses "collaborated" correctly', 'Grammatically correct past tense'],
    order_index: 1
  },
  {
    id: 'act-eng-vocab-indep',
    lesson_id: 'les-eng-vocab-1',
    type: 'independent_practice',
    title: 'Independent Task: Write 2 Sentences About Your College',
    instruction: 'Write 2 sentences about your college routine using at least one new word (reliable, achieve, initial, or articulate).',
    resources: [],
    sample_answer: 'My initial goal in college was to gain confidence in English speaking. I practice daily to achieve this objective.',
    rubric_criteria: ['Correct vocabulary usage', 'Clear sentence structure'],
    order_index: 2
  }
];

// COLLEGE-STUDENT FRIENDLY DIAGNOSTIC QUESTIONS (10-12 Questions for English, 4 Communication, 4 Interview)
export const SEED_DIAGNOSTIC_ASSESSMENTS: AssessmentItem[] = [
  // --- ENGLISH SPEAKING DIAGNOSTIC (10 QUESTIONS) ---
  {
    id: 'diag-eng-q1',
    competency_id: 'comp-eng-grammar',
    type: 'multiple_choice',
    question: 'Select the correct word to complete the sentence:\n"She ___ to college every day by bus."',
    options: ['go', 'goes', 'going', 'gone'],
    correct_option_index: 1,
    explanation: 'Subject "She" (third person singular) takes "goes" in present simple tense.',
    sub_skill_tag: 'Grammar & Tenses'
  },
  {
    id: 'diag-eng-q2',
    competency_id: 'comp-eng-grammar',
    type: 'multiple_choice',
    question: 'Select the correct past tense verb:\n"I ___ my college assignment yesterday evening."',
    options: ['complete', 'completed', 'have complete', 'completing'],
    correct_option_index: 1,
    explanation: 'Completed past actions ("yesterday evening") require past simple tense "completed".',
    sub_skill_tag: 'Grammar & Tenses'
  },
  {
    id: 'diag-eng-q3',
    competency_id: 'comp-eng-grammar',
    type: 'multiple_choice',
    question: 'Select the correct preposition:\n"Rohan is very good ___ mathematics and coding."',
    options: ['in', 'at', 'on', 'for'],
    correct_option_index: 1,
    explanation: 'The correct preposition with "good" for skills/subjects is "at" (good at mathematics).',
    sub_skill_tag: 'Grammar & Prepositions'
  },
  {
    id: 'diag-eng-q4',
    competency_id: 'comp-eng-grammar',
    type: 'multiple_choice',
    question: 'Which sentence is grammatically correct?',
    options: [
      'They has went to the library.',
      'They have gone to the library.',
      'They wented to the library.',
      'They has going to the library.'
    ],
    correct_option_index: 1,
    explanation: '"They have gone" uses correct plural auxiliary verb "have" and past participle "gone".',
    sub_skill_tag: 'Grammar & Sentence Correction'
  },
  {
    id: 'diag-eng-q5',
    competency_id: 'comp-eng-vocab',
    type: 'multiple_choice',
    question: 'What is the closest meaning of the word "reliable"?',
    options: [
      'Honest and dependable',
      'Very fast and quick',
      'Hard to locate',
      'Fragile and weak'
    ],
    correct_option_index: 0,
    explanation: '"Reliable" means someone or something you can rely on / depend on.',
    sub_skill_tag: 'Vocabulary'
  },
  {
    id: 'diag-eng-q6',
    competency_id: 'comp-eng-vocab',
    type: 'multiple_choice',
    question: 'Choose the best word to complete the sentence:\n"Her presentation was so ___ that all the students understood the topic easily."',
    options: ['confusing', 'articulate', 'silent', 'rare'],
    correct_option_index: 1,
    explanation: '"Articulate" means clear and easy to understand in speech.',
    sub_skill_tag: 'Vocabulary'
  },
  {
    id: 'diag-eng-q7',
    competency_id: 'comp-eng-grammar',
    type: 'multiple_choice',
    question: 'Which order creates a correct sentence?\n[1: in the morning] [2: reads the news] [3: Priya]',
    options: [
      'In the morning reads the news Priya.',
      'Priya reads the news in the morning.',
      'Reads the news Priya in the morning.',
      'Priya in the morning reads the news.'
    ],
    correct_option_index: 1,
    explanation: 'Standard English sentence order is Subject (Priya) + Verb (reads) + Object (the news) + Time (in the morning).',
    sub_skill_tag: 'Sentence Structure'
  },
  {
    id: 'diag-eng-q8',
    competency_id: 'comp-eng-comprehension',
    type: 'multiple_choice',
    question: 'Read the short paragraph:\n"College students who practice public speaking regularly report lower anxiety during job interviews. Daily 5-minute practice builds confidence over time."\n\nWhat is the main takeaway?',
    options: [
      'Public speaking makes interviews longer.',
      'Regular brief practice helps reduce anxiety and builds confidence.',
      'Students should avoid job interviews.',
      'Reading books is better than speaking.'
    ],
    correct_option_index: 1,
    explanation: 'The passage highlights that daily practice reduces anxiety and builds speaking confidence.',
    sub_skill_tag: 'Reading & Comprehension'
  },
  {
    id: 'diag-eng-q9',
    competency_id: 'comp-eng-fluency',
    type: 'multiple_choice',
    question: 'When you forget a word while speaking in English, what is the best strategy?',
    options: [
      'Stop speaking immediately and stay silent for 1 minute.',
      'Use a simple alternative phrase or explanation without losing flow.',
      'Apologize repeatedly in your native language.',
      'Speak as fast as possible so no one notices.'
    ],
    correct_option_index: 1,
    explanation: 'Using an alternative phrase preserves fluency and keeps the conversation moving.',
    sub_skill_tag: 'Fluency & Speaking'
  },
  {
    id: 'diag-eng-q10',
    competency_id: 'comp-eng-fluency',
    type: 'multiple_choice',
    question: 'Practical Speaking Task: How would you introduce your college major in 1 clear sentence?',
    options: [
      'Me study Computer Science in college.',
      'I am currently studying Computer Science at my college.',
      'I was study Computer Science daily.',
      'Computer Science studying by me.'
    ],
    correct_option_index: 1,
    explanation: '"I am currently studying [Major] at my college" is grammatically clear and natural.',
    sub_skill_tag: 'Fluency & Speaking'
  },

  // --- COMMUNICATION DIAGNOSTIC QUESTIONS ---
  {
    id: 'diag-comm-q1',
    competency_id: 'comp-comm-clarity',
    type: 'multiple_choice',
    question: 'What is the most effective way to explain a complex college project to a non-technical listener?',
    options: [
      'Use maximum technical jargon to sound smart.',
      'Start with a simple 1-sentence real-world summary, then explain key points.',
      'Speak continuously without pausing for questions.',
      'Refuse to explain unless they study your field.'
    ],
    correct_option_index: 1,
    explanation: 'Starting with a simple real-world summary ensures instant clarity.',
    sub_skill_tag: 'Speaking Clarity'
  },

  // --- INTERVIEW SKILLS DIAGNOSTIC QUESTIONS ---
  {
    id: 'diag-interview-q1',
    competency_id: 'comp-interview-intro',
    type: 'multiple_choice',
    question: 'What should you focus on during a 45-second job interview self-introduction?',
    options: [
      'Your entire childhood history from primary school.',
      'Your name, current degree/year, key project/skill, and interest in the role.',
      'Complaining about difficult college exams.',
      'Memorizing a 5-page speech word for word.'
    ],
    correct_option_index: 1,
    explanation: 'Focusing on your name, degree, main skill, and interest keeps your self-intro concise and relevant.',
    sub_skill_tag: 'Self-Introduction'
  }
];
