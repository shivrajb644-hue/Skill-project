-- SUPABASE CURRICULUM SEED DATA SCRIPT
-- Compatible with schema.sql architecture: auth.users -> public.profiles -> student_enrollments / student_progress

-- 1. SEED 3 SKILLS
INSERT INTO public.skills (id, title, description, category, level, icon) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Executive Communication & Storytelling', 'Structure compelling narratives, influence senior stakeholders, and command boardrooms with confidence.', 'Communication', 'Advanced', 'MessageSquareText'),
  ('a2000000-0000-0000-0000-000000000002', 'High-Stakes Negotiation & Conflict Resolution', 'Formulate win-win strategies, navigate deadlocks, and resolve high-tension disputes constructively.', 'Strategy', 'Intermediate', 'Handshake'),
  ('a3000000-0000-0000-0000-000000000003', 'Emotional Intelligence & Adaptive Leadership', 'Master self-awareness, active empathy, and psychological safety to empower high-performing teams.', 'Leadership', 'Intermediate', 'BrainCircuit')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  level = EXCLUDED.level,
  icon = EXCLUDED.icon;

-- 2. SEED 9 COMPETENCIES (3 per skill)
INSERT INTO public.competencies (id, skill_id, title, description, order_index) VALUES
  -- Skill 1: Executive Communication
  ('b1100000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Pyramid Principle & Message Framing', 'Structure complex ideas top-down using logical grouping and clear value propositions.', 1),
  ('b1200000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Vocal Gravitas & Executive Presence', 'Leverage tonal cadence, deliberate pacing, and assertive body language.', 2),
  ('b1300000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Handling Hostile Q&A & Pushback', 'De-escalate skeptical questions and steer conversations back to strategic priorities.', 3),
  
  -- Skill 2: High-Stakes Negotiation
  ('b2100000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 'Interest-Based Bargaining (BATNA)', 'Identify underlying interests behind rigid positions to expand the value pie.', 1),
  ('b2200000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'De-escalating High-Tension Deadlocks', 'Use tactical empathy and mirroring to disarm aggression during negotiations.', 2),
  ('b2300000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000002', 'Closing & Sustainable Alignment', 'Draft durable agreements that align incentives and prevent post-deal friction.', 3),

  -- Skill 3: Emotional Intelligence
  ('b3100000-0000-0000-0000-000000000001', 'a3000000-0000-0000-0000-000000000003', 'Active Empathy & Perspective Taking', 'Decode verbal and micro-expressions to understand underlying team motivations.', 1),
  ('b3200000-0000-0000-0000-000000000002', 'a3000000-0000-0000-0000-000000000003', 'Psychological Safety Creation', 'Build environment where team members feel safe taking calculated risks and speaking up.', 2),
  ('b3300000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000003', 'Situational Leadership Adaptation', 'Flex your leadership style based on team member task readiness and emotional maturity.', 3)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index;

-- 3. SEED 27 LESSONS (3 per competency)
INSERT INTO public.lessons (id, competency_id, title, content, duration_minutes, order_index) VALUES
  -- Competency 1.1
  ('c1110000-0000-0000-0000-000000000001', 'b1100000-0000-0000-0000-000000000001', 'The Core Minto Pyramid Structure', 'Learn how Barbara Minto designed the Pyramid Principle at McKinsey to deliver instant clarity in executive briefings.', 12, 1),
  ('c1120000-0000-0000-0000-000000000002', 'b1100000-0000-0000-0000-000000000001', 'Situation-Complication-Resolution (SCR)', 'Master the SCR framework to open presentations with immediate contextual resonance.', 15, 2),
  ('c1130000-0000-0000-0000-000000000003', 'b1100000-0000-0000-0000-000000000001', 'MECE Grouping for Bulletproof Logic', 'Ensure your supporting points are Mutually Exclusive and Collectively Exhaustive.', 20, 3),

  -- Competency 1.2
  ('c1210000-0000-0000-0000-000000000001', 'b1200000-0000-0000-0000-000000000002', 'Pacing & Strategic Pauses', 'Discover how deliberate pauses project authority and increase message retention by 40%.', 10, 1),
  ('c1220000-0000-0000-0000-000000000002', 'b1200000-0000-0000-0000-000000000002', 'Tonal Resonance & Pitch Modulation', 'Eliminate uptones and filler words to communicate grounded conviction.', 14, 2),
  ('c1230000-0000-0000-0000-000000000003', 'b1200000-0000-0000-0000-000000000002', 'Commanding Digital & Physical Rooms', 'Spatial awareness, eye contact calibration, and posture alignment for hybrid boardrooms.', 18, 3),

  -- Competency 1.3
  ('c1310000-0000-0000-0000-000000000001', 'b1300000-0000-0000-0000-000000000003', 'The Acknowledge-Bridge-Deliver Technique', 'Seamlessly transition hostile questions back to your key strategic message.', 15, 1),
  ('c1320000-0000-0000-0000-000000000002', 'b1300000-0000-0000-0000-000000000003', 'Managing Aggressive Interrupters', 'Maintain composure and re-establish room control without appearing defensive.', 12, 2),
  ('c1330000-0000-0000-0000-000000000003', 'b1300000-0000-0000-0000-000000000003', 'Answering "I Don''t Know" Like an Executive', 'Frame missing data transparently while reinforcing your strategic path forward.', 10, 3),

  -- Competency 2.1
  ('c2110000-0000-0000-0000-000000000001', 'b2100000-0000-0000-0000-000000000001', 'Calculating Your True BATNA', 'Determine your Best Alternative To a Negotiated Agreement before stepping into negotiations.', 20, 1),
  ('c2120000-0000-0000-0000-000000000002', 'b2100000-0000-0000-0000-000000000001', 'Uncovering Hidden Positions vs Interests', 'Shift conversations from rigid demands to underlying commercial and emotional drivers.', 18, 2),
  ('c2130000-0000-0000-0000-000000000003', 'b2100000-0000-0000-0000-000000000001', 'ZOPA Expansion Strategies', 'Map the Zone Of Possible Agreement to uncover creative non-monetary trade-offs.', 15, 3),

  -- Competency 2.2
  ('c2210000-0000-0000-0000-000000000001', 'b2200000-0000-0000-0000-000000000002', 'Tactical Empathy & Labeling Emotions', 'Use verbal labeling ("It seems like budget constraints are pressuring your timeline") to defuse tension.', 15, 1),
  ('c2220000-0000-0000-0000-000000000002', 'b2200000-0000-0000-0000-000000000002', 'Mirroring for Information Gathering', 'Repeat key phrases to invite counter-parties to reveal critical leverage points without friction.', 12, 2),
  ('c2230000-0000-0000-0000-000000000003', 'b2200000-0000-0000-0000-000000000002', 'Calibrated Questions ("How am I supposed to do that?")', 'Guide the counterpart to solve your constraints using open-ended calibrated questions.', 16, 3),

  -- Competency 2.3
  ('c2310000-0000-0000-0000-000000000001', 'b2300000-0000-0000-0000-000000000003', 'Implementation Planning During Deal Structuring', 'Ensure operational stakeholders review contract commitments before signing.', 14, 1),
  ('c2320000-0000-0000-0000-000000000002', 'b2300000-0000-0000-0000-000000000003', 'Post-Deal Governance & Escalation Triggers', 'Build clear protocols for managing future scope changes or disputes.', 12, 2),
  ('c2330000-0000-0000-0000-000000000003', 'b2300000-0000-0000-0000-000000000003', 'Securing High-Value Commitments', 'Recognize fake agreement and turn passive consent into active execution.', 18, 3),

  -- Competency 3.1
  ('c3110000-0000-0000-0000-000000000001', 'b3100000-0000-0000-0000-000000000001', 'Self-Regulation & Trigger Auditing', 'Identify personal emotional triggers and develop micro-grounding routines under stress.', 15, 1),
  ('c3120000-0000-0000-0000-000000000002', 'b3100000-0000-0000-0000-000000000001', 'Active Empathy Beyond Surface Words', 'Listen for tone, hesitation, and unstated concerns during 1-on-1 check-ins.', 16, 2),
  ('c3130000-0000-0000-0000-000000000003', 'b3100000-0000-0000-0000-000000000001', 'Empathy Mapping for Organizational Alignment', 'Map cross-functional partner perspectives to reduce friction during strategic rollouts.', 18, 3),

  -- Competency 3.2
  ('c3210000-0000-0000-0000-000000000001', 'b3200000-0000-0000-0000-000000000002', 'Blameless Post-Mortems & Risk Culture', 'Construct team rituals that celebrate rapid failure, learning, and transparent post-mortems.', 20, 1),
  ('c3220000-0000-0000-0000-000000000002', 'b3200000-0000-0000-0000-000000000002', 'Fostering Constructive Dissent', 'Encourage team members to challenge assumptions without fear of personal reprisal.', 14, 2),
  ('c3230000-0000-0000-0000-000000000003', 'b3200000-0000-0000-0000-000000000002', 'Radical Candor in Performance Feedback', 'Balance direct challenge with deep personal care during performance evaluations.', 15, 3),

  -- Competency 3.3
  ('c3310000-0000-0000-0000-000000000001', 'b3300000-0000-0000-0000-000000000003', 'Diagnosing Task Readiness vs Competence', 'Assess whether a direct report needs direction, coaching, supporting, or delegating.', 15, 1),
  ('c3320000-0000-0000-0000-000000000002', 'b3300000-0000-0000-0000-000000000003', 'Coaching vs Directing Modes', 'Know when to ask powerful open-ended questions versus providing explicit directives.', 12, 2),
  ('c3330000-0000-0000-0000-000000000003', 'b3300000-0000-0000-0000-000000000003', 'Leading Through Organizational Ambiguity', 'Keep teams focused and motivated when company goals undergo sudden strategic pivots.', 18, 3)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  duration_minutes = EXCLUDED.duration_minutes,
  order_index = EXCLUDED.order_index;
