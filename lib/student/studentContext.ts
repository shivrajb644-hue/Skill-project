// ───────────────────────────────────────────────
// STUDENT CONTEXT
// Reads the onboarding answers and turns them into simple, ready-to-use
// words (school / college / office, teacher / manager, stream area, etc.)
// so the assessment and interview questions can match the student's life.
// ───────────────────────────────────────────────
import { localSession } from '../storage/localStorage';

export type StreamArea = 'tech' | 'commerce' | 'science' | 'arts' | 'medical' | 'general';
export type LifeStage = 'school' | 'college' | 'fresher' | 'working';

export interface StudentContext {
  firstName: string;
  lifeStage: LifeStage;
  /** "school" | "college" | "office" */
  place: string;
  /** Name of the school / college / company if given, otherwise a generic word */
  placeName: string;
  /** "teacher" | "manager" */
  guide: string;
  /** "class" | "team" */
  group: string;
  /** What the student studies, e.g. "Computer Science" (may be empty) */
  stream: string;
  streamArea: StreamArea;
  educationLevel: string;
  englishLevel: 'beginner' | 'intermediate' | 'advanced';
  /** true = use the easiest words and give more help */
  needsExtraHelp: boolean;
  confidence: number; // 1-5
  primaryFear?: string;
}

function detectStreamArea(stream: string): StreamArea {
  const s = stream.toLowerCase();
  if (!s.trim()) return 'general';
  if (/(computer|cse|\bit\b|software|information tech|bca|mca|ai|data|electronic|ece|eee|electrical|mechanical|civil|engineer|b\.?tech|b\.?e\b|diploma|polytechnic|coding)/.test(s)) return 'tech';
  if (/(commerce|b\.?com|m\.?com|bba|mba|account|finance|business|management|economics|ca\b)/.test(s)) return 'commerce';
  if (/(mbbs|nursing|pharma|medical|bds|health|physio|biotech)/.test(s)) return 'medical';
  if (/(b\.?sc|m\.?sc|science|physics|chemistry|math|biology|zoology|botany)/.test(s)) return 'science';
  if (/(arts|b\.?a\b|m\.?a\b|english|history|political|psychology|sociology|literature|journalism|design|law|hindi)/.test(s)) return 'arts';
  return 'general';
}

export function getStudentContext(): StudentContext {
  const ob = localSession.getOnboarding();
  const auth = localSession.getAuthUser();

  const fullName = (ob?.name && ob.name !== 'User' ? ob.name : auth?.name) || '';
  const firstName = fullName.trim().split(/\s+/)[0] || '';

  const educationLevel = ob?.educationLevel || '';
  const isSchool = educationLevel === 'High School';
  const isWorking = ob?.userType === 'professional' || (ob?.userType === 'graduate' && !ob?.isFresher);
  const lifeStage: LifeStage = isWorking
    ? 'working'
    : isSchool
      ? 'school'
      : ob?.isFresher && ob?.userType !== 'student'
        ? 'fresher'
        : 'college';

  // In onboarding, "role" holds the branch/stream for students and job title for professionals.
  const stream = (ob?.branch || ob?.role || '').trim();
  const englishLevel = ob?.englishLevel || 'beginner';
  const confidence = ob?.speakingConfidence || 2;

  const place = lifeStage === 'working' ? 'office' : lifeStage === 'school' ? 'school' : 'college';
  const rawPlaceName = (lifeStage === 'working' ? ob?.company : ob?.college) || '';

  return {
    firstName,
    lifeStage,
    place,
    placeName: rawPlaceName.trim() || `my ${place}`,
    guide: lifeStage === 'working' ? 'manager' : 'teacher',
    group: lifeStage === 'working' ? 'team' : 'class',
    stream,
    streamArea: detectStreamArea(stream),
    educationLevel,
    englishLevel,
    needsExtraHelp: englishLevel === 'beginner' || confidence <= 2,
    confidence,
    primaryFear: ob?.primaryFear,
  };
}

/** One short line describing the student, used in UI and AI prompts. */
export function describeStudent(ctx: StudentContext): string {
  const who =
    ctx.lifeStage === 'working' ? `working professional${ctx.stream ? ` (${ctx.stream})` : ''}` :
    ctx.lifeStage === 'school' ? 'school student' :
    ctx.lifeStage === 'fresher' ? `fresher${ctx.stream ? ` who studied ${ctx.stream}` : ''}` :
    `college student${ctx.stream ? ` studying ${ctx.stream}` : ''}`;
  return `${who}, ${ctx.englishLevel} English level, speaking confidence ${ctx.confidence}/5`;
}
