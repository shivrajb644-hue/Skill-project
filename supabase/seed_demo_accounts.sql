-- DEMO ACCOUNTS SEED SCRIPT FOR SUPABASE AUTH & PROFILES
-- Creates 5 Demo Students and 1 Admin in auth.users
-- The on_auth_user_created trigger in schema.sql automatically populates public.profiles!

-- Helper extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SEED AUTH USERS WITH SECURE HASHED PASSWORDS ('Password123!')
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'alex.rivera@example.com',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Alex Rivera","role":"student","target_role":"VP of Product","bio":"Senior Product Manager driving enterprise SaaS strategy","learning_goals":["Master executive persuasion","Lead cross-functional alignment"]}',
    false,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'sophia.chen@example.com',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sophia Chen","role":"student","target_role":"Director of Engineering","bio":"Staff Software Engineer transitioning into Director of Engineering","learning_goals":["Improve team empathy","High-stakes technical storytelling"]}',
    false,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'marcus.vance@example.com',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Marcus Vance","role":"student","target_role":"Chief Revenue Officer","bio":"Enterprise Sales Lead closing 7-figure strategic partnerships","learning_goals":["Negotiation tactics","Executive rapport building"]}',
    false,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-4444-444444444444',
    'authenticated',
    'authenticated',
    'elena.rostova@example.com',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Elena Rostova","role":"student","target_role":"VP of Design","bio":"Head of UX Design creating human-centric digital experiences","learning_goals":["Design critique advocacy","Stakeholder diplomacy"]}',
    false,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '55555555-5555-5555-5555-555555555555',
    'authenticated',
    'authenticated',
    'david.kim@example.com',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"David Kim","role":"student","target_role":"Founder & CEO","bio":"AI Tech Founder building autonomous agentic platforms","learning_goals":["Venture pitch storytelling","Crisis management"]}',
    false,
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '99999999-9999-9999-9999-999999999999',
    'authenticated',
    'authenticated',
    'admin@platform.com',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"System Administrator","role":"admin","target_role":"Trainer & System Admin","bio":"Curriculum Administrator"}',
    false,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 2. SEED INITIAL ENROLLMENTS FOR DEMO STUDENTS
INSERT INTO public.student_enrollments (student_id, skill_id, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a1000000-0000-0000-0000-000000000001', 'active'),
  ('11111111-1111-1111-1111-111111111111', 'a2000000-0000-0000-0000-000000000002', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'a1000000-0000-0000-0000-000000000001', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'a3000000-0000-0000-0000-000000000003', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'a2000000-0000-0000-0000-000000000002', 'active'),
  ('44444444-4444-4444-4444-444444444444', 'a1000000-0000-0000-0000-000000000001', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'a3000000-0000-0000-0000-000000000003', 'active')
ON CONFLICT (student_id, skill_id) DO NOTHING;

-- 3. SEED INITIAL PROGRESS FOR DEMO STUDENT (Alex Rivera)
INSERT INTO public.student_progress (student_id, lesson_id, status, completed_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c1110000-0000-0000-0000-000000000001', 'completed', NOW() - INTERVAL '2 days'),
  ('11111111-1111-1111-1111-111111111111', 'c1120000-0000-0000-0000-000000000002', 'completed', NOW() - INTERVAL '1 day'),
  ('11111111-1111-1111-1111-111111111111', 'c1130000-0000-0000-0000-000000000003', 'in_progress', NULL)
ON CONFLICT (student_id, lesson_id) DO NOTHING;
