
-- Membership tier enum
DO $$ BEGIN
  CREATE TYPE public.membership_tier AS ENUM ('free', 'pro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tier public.membership_tier NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS is_free_sample boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_questions_free_sample
  ON public.questions (year_level) WHERE is_free_sample = true;

-- Admins can update any profile (tier / block)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can read all user_roles
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
CREATE POLICY "Admins can read all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin-only: list users with auth email
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  display_name text,
  year_level smallint,
  region text,
  tier public.membership_tier,
  is_blocked boolean,
  is_admin boolean,
  created_at timestamptz,
  attempts_count bigint,
  last_active timestamptz
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  SELECT
    p.user_id,
    u.email::text,
    p.display_name,
    p.year_level,
    p.region,
    p.tier,
    p.is_blocked,
    EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = p.user_id AND r.role = 'admin') AS is_admin,
    p.created_at,
    COALESCE((SELECT COUNT(*) FROM public.practice_attempts a WHERE a.user_id = p.user_id), 0)::bigint AS attempts_count,
    (SELECT MAX(a.created_at) FROM public.practice_attempts a WHERE a.user_id = p.user_id) AS last_active
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.user_id
  ORDER BY p.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;

-- Admin-only: grant/revoke admin role
CREATE OR REPLACE FUNCTION public.admin_set_admin(_user_id uuid, _make_admin boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _make_admin THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin')
      ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_admin(uuid, boolean) TO authenticated;
