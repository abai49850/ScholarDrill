create or replace function public.admin_set_user_profile(
  _user_id uuid,
  _tier public.membership_tier default null,
  _is_blocked boolean default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user auth.users%rowtype;
begin
  if not public.has_role(auth.uid(), 'admin'::public.app_role) then
    raise exception 'forbidden';
  end if;

  select *
  into target_user
  from auth.users
  where id = _user_id;

  if target_user.id is null then
    raise exception 'user_not_found';
  end if;

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
    target_user.id,
    target_user.id,
    target_user.email,
    coalesce(
      nullif(target_user.raw_user_meta_data->>'display_name', ''),
      nullif(target_user.raw_user_meta_data->>'full_name', ''),
      split_part(target_user.email, '@', 1),
      'Student'
    ),
    case
      when (target_user.raw_user_meta_data->>'year_level') ~ '^\d+$'
        then (target_user.raw_user_meta_data->>'year_level')::int
      else 5
    end,
    coalesce(target_user.raw_user_meta_data->>'state', 'NSW'),
    coalesce(target_user.raw_user_meta_data->>'region', target_user.raw_user_meta_data->>'state', 'NSW'),
    coalesce(target_user.raw_user_meta_data->>'exam_focus', 'naplan'),
    10,
    coalesce(_tier, 'free'::public.membership_tier),
    coalesce(_is_blocked, false),
    now(),
    now()
  )
  on conflict (user_id) do update
  set
    email = coalesce(excluded.email, public.profiles.email),
    tier = coalesce(_tier, public.profiles.tier),
    is_blocked = coalesce(_is_blocked, public.profiles.is_blocked),
    updated_at = now();
end;
$$;

grant execute on function public.admin_set_user_profile(uuid, public.membership_tier, boolean) to authenticated;

create or replace function public.admin_delete_user(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.has_role(auth.uid(), 'admin'::public.app_role) then
    raise exception 'forbidden';
  end if;

  if auth.uid() = _user_id then
    raise exception 'cannot_delete_self';
  end if;

  delete from public.user_roles
  where user_id = _user_id;

  delete from public.profiles
  where user_id = _user_id
     or id = _user_id;

  delete from auth.users
  where id = _user_id;
end;
$$;

grant execute on function public.admin_delete_user(uuid) to authenticated;

notify pgrst, 'reload schema';
