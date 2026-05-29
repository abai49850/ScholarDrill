create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_email text;
  resolved_year_level integer;
  resolved_region text;
begin
  resolved_email := coalesce(nullif(new.email, ''), new.id::text || '@unknown.local');
  resolved_year_level := case
    when (new.raw_user_meta_data->>'year_level') ~ '^\d+$'
      then (new.raw_user_meta_data->>'year_level')::integer
    else 5
  end;
  resolved_region := coalesce(
    nullif(new.raw_user_meta_data->>'region', ''),
    nullif(new.raw_user_meta_data->>'state', ''),
    'NSW'
  );

  insert into public.profiles (
    id,
    user_id,
    email,
    display_name,
    year_level,
    state,
    region,
    exam_focus,
    daily_goal,
    tier,
    is_blocked,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.id,
    resolved_email,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      split_part(resolved_email, '@', 1),
      'Student'
    ),
    resolved_year_level,
    resolved_region,
    resolved_region,
    coalesce(nullif(new.raw_user_meta_data->>'exam_focus', ''), 'naplan'),
    10,
    'free'::public.membership_tier,
    false,
    now(),
    now()
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    year_level = coalesce(public.profiles.year_level, excluded.year_level),
    state = coalesce(public.profiles.state, excluded.state),
    region = coalesce(public.profiles.region, excluded.region),
    exam_focus = coalesce(public.profiles.exam_focus, excluded.exam_focus),
    daily_goal = coalesce(public.profiles.daily_goal, excluded.daily_goal),
    tier = coalesce(public.profiles.tier, excluded.tier),
    is_blocked = coalesce(public.profiles.is_blocked, excluded.is_blocked),
    updated_at = now();

  insert into public.user_roles (user_id, role)
  values (new.id, 'student'::public.app_role)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

notify pgrst, 'reload schema';
