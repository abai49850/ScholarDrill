-- Keep the webapp admin user list aligned with Supabase Auth users.

DROP POLICY IF EXISTS "Admins can insert missing profiles" ON public.profiles;
CREATE POLICY "Admins can insert missing profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

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
    u.id AS user_id,
    u.email::text,
    COALESCE(
      NULLIF(p.display_name, ''),
      u.raw_user_meta_data->>'display_name',
      u.raw_user_meta_data->>'full_name',
      split_part(u.email, '@', 1),
      'Unknown user'
    )::text AS display_name,
    COALESCE(p.year_level, 5)::smallint AS year_level,
    COALESCE(p.region, 'NSW')::text AS region,
    COALESCE(p.tier, 'free'::public.membership_tier) AS tier,
    COALESCE(p.is_blocked, false) AS is_blocked,
    EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin') AS is_admin,
    COALESCE(p.created_at, u.created_at) AS created_at,
    COALESCE((SELECT COUNT(*) FROM public.practice_attempts a WHERE a.user_id = u.id), 0)::bigint AS attempts_count,
    (SELECT MAX(a.created_at) FROM public.practice_attempts a WHERE a.user_id = u.id) AS last_active
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  ORDER BY COALESCE(p.created_at, u.created_at) DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
