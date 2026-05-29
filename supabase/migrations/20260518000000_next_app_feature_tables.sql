-- Tables used by the Next.js application modules.

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS state australian_state,
  ADD COLUMN IF NOT EXISTS curriculum_nodes UUID[],
  ADD COLUMN IF NOT EXISTS aus_spelling_checked BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS public.student_ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, key)
);

CREATE TABLE IF NOT EXISTS public.revision_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  taxonomy_id UUID REFERENCES public.curriculum_taxonomy(id) ON DELETE SET NULL,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  priority SMALLINT NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.naplan_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year_level SMALLINT NOT NULL,
  subject TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'TIMED',
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  total_score INTEGER NOT NULL DEFAULT 0,
  raw_score_count INTEGER NOT NULL DEFAULT 0,
  total_question_count INTEGER NOT NULL DEFAULT 0,
  estimated_band TEXT,
  percentile_rank NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.naplan_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.naplan_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
  selected_option_id TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  difficulty_at_time NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.naplan_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_level SMALLINT NOT NULL,
  subject TEXT NOT NULL,
  min_raw_score INTEGER NOT NULL,
  max_raw_score INTEGER NOT NULL,
  estimated_band TEXT NOT NULL,
  percentile_estimate NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.parent_child_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.mastery_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  avg_mastery_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_ai_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.naplan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.naplan_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.naplan_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mastery_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own ai memory" ON public.student_ai_memory
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own revision queue" ON public.revision_queue
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own naplan sessions" ON public.naplan_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own naplan responses" ON public.naplan_responses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.naplan_sessions s
      WHERE s.id = session_id AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.naplan_sessions s
      WHERE s.id = session_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users read naplan benchmarks" ON public.naplan_benchmarks
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Parents and students read own links" ON public.parent_child_links
  FOR SELECT TO authenticated
  USING (auth.uid() = parent_id OR auth.uid() = student_id);

CREATE POLICY "Parents create own links" ON public.parent_child_links
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Users read own mastery snapshots" ON public.mastery_snapshots
  FOR SELECT TO authenticated
  USING (auth.uid() = student_id);
