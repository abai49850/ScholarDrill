-- Roles enum + table (separate from profiles for security)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enums for question taxonomy
CREATE TYPE public.question_subject AS ENUM ('maths', 'reading', 'writing', 'conventions', 'reasoning');
CREATE TYPE public.question_exam_type AS ENUM ('naplan', 'selective', 'scholarship', 'general');
CREATE TYPE public.question_status AS ENUM ('draft', 'approved');

-- Main questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id TEXT UNIQUE,
  content TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_id TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  difficulty SMALLINT NOT NULL DEFAULT 3,
  subject public.question_subject NOT NULL,
  exam_type public.question_exam_type NOT NULL DEFAULT 'naplan',
  year_level SMALLINT NOT NULL,
  topic TEXT NOT NULL DEFAULT '',
  subtopic TEXT NOT NULL DEFAULT '',
  skill_tags TEXT[] NOT NULL DEFAULT '{}',
  source_reference TEXT NOT NULL DEFAULT '',
  time_limit_seconds INTEGER NOT NULL DEFAULT 60,
  status public.question_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_questions_subject ON public.questions(subject);
CREATE INDEX idx_questions_year ON public.questions(year_level);
CREATE INDEX idx_questions_exam ON public.questions(exam_type);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read approved questions
CREATE POLICY "Approved questions are public"
  ON public.questions FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Admins can read everything (including drafts)
CREATE POLICY "Admins can read all questions"
  ON public.questions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert questions"
  ON public.questions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update questions"
  ON public.questions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete questions"
  ON public.questions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_questions_touch
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();