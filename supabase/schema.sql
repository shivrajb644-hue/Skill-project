-- SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES / STUDENTS TABLE
-- Linked directly to Supabase auth.users(id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  target_role TEXT,
  learning_goals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alias view for backward-compatible table access
CREATE OR REPLACE VIEW public.students AS SELECT * FROM public.profiles;

-- 2. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Leadership',
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  icon TEXT DEFAULT 'MessageSquareText',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COMPETENCIES TABLE
CREATE TABLE IF NOT EXISTS public.competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competency_id UUID NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 15,
  order_index INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STUDENT ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, skill_id)
);

-- 6. STUDENT PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, lesson_id)
);

-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, avatar_url, bio, target_role, learning_goals)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id),
    COALESCE(NEW.raw_user_meta_data->>'bio', 'Enthusiastic soft skills learner'),
    COALESCE(NEW.raw_user_meta_data->>'target_role', 'Professional'),
    COALESCE((NEW.raw_user_meta_data->>'learning_goals')::jsonb, '["Executive Presence", "Strategic Negotiation"]'::jsonb)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- DROP EXISTING POLICIES TO AVOID DUPLICATES
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
DROP POLICY IF EXISTS "Public read competencies" ON public.competencies;
DROP POLICY IF EXISTS "Public read lessons" ON public.lessons;
DROP POLICY IF EXISTS "Student read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Student update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Student read own enrollments" ON public.student_enrollments;
DROP POLICY IF EXISTS "Student insert own enrollments" ON public.student_enrollments;
DROP POLICY IF EXISTS "Student read own progress" ON public.student_progress;
DROP POLICY IF EXISTS "Student write own progress" ON public.student_progress;
DROP POLICY IF EXISTS "Admin full skills access" ON public.skills;
DROP POLICY IF EXISTS "Admin full competencies access" ON public.competencies;
DROP POLICY IF EXISTS "Admin full lessons access" ON public.lessons;

-- RLS POLICIES FOR PUBLIC & STUDENTS
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read competencies" ON public.competencies FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON public.lessons FOR SELECT USING (true);

-- Student Data Isolation (auth.uid() = id / student_id)
CREATE POLICY "Student read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Student update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Student read own enrollments" ON public.student_enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Student insert own enrollments" ON public.student_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Student read own progress" ON public.student_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Student write own progress" ON public.student_progress FOR ALL USING (auth.uid() = student_id);

-- ADMIN OVERRIDE POLICIES
CREATE POLICY "Admin view profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full skills access" ON public.skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full competencies access" ON public.competencies FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full lessons access" ON public.lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
