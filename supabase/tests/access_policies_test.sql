begin;

create extension if not exists pgtap with schema extensions;

create or replace function public.test_capture_sqlstate(sql text)
returns text
language plpgsql
as $$
begin
  execute sql;
  return null;
exception
  when others then
    return sqlstate;
end;
$$;

create or replace function public.test_exec_row_count(sql text)
returns bigint
language plpgsql
as $$
declare
  affected bigint;
begin
  execute sql;
  get diagnostics affected = row_count;
  return affected;
end;
$$;

select plan(12);

insert into auth.users (id, email)
values
  ('20000000-0000-0000-0000-000000000101', 'user.one@example.com'),
  ('20000000-0000-0000-0000-000000000102', 'user.two@example.com');

insert into public.user_profiles (
  id,
  auth_user_id,
  first_name,
  last_name,
  email,
  university_username
)
values
  (
    '30000000-0000-0000-0000-000000000201',
    '20000000-0000-0000-0000-000000000101',
    'User',
    'One',
    'user.one@example.com',
    'userone'
  ),
  (
    '30000000-0000-0000-0000-000000000202',
    '20000000-0000-0000-0000-000000000102',
    'User',
    'Two',
    'user.two@example.com',
    'usertwo'
  );

insert into public.notifications (id, user_id, title)
values
  (
    '40000000-0000-0000-0000-000000000301',
    '30000000-0000-0000-0000-000000000201',
    'Notification for user one'
  ),
  (
    '40000000-0000-0000-0000-000000000302',
    '30000000-0000-0000-0000-000000000202',
    'Notification for user two'
  );

set local role authenticated;
set local request.jwt.claim.sub = '20000000-0000-0000-0000-000000000101';

select results_eq(
  $$
    select auth_user_id
    from public.user_profiles
    order by auth_user_id
  $$,
  $$
    values ('20000000-0000-0000-0000-000000000101'::uuid)
  $$,
  'user one can only read their own profile'
);

select results_eq(
  $$
    select id
    from public.notifications
    order by id
  $$,
  $$
    values ('40000000-0000-0000-0000-000000000301'::uuid)
  $$,
  'user one can only read their own notifications'
);

select is(
  public.test_exec_row_count($$
    update public.user_profiles
    set first_name = 'User One Updated'
    where auth_user_id = '20000000-0000-0000-0000-000000000101'
  $$)::text,
  '1',
  'user one can update their own profile'
);

select is(
  public.test_exec_row_count($$
    update public.user_profiles
    set first_name = 'Cross User Update'
    where auth_user_id = '20000000-0000-0000-0000-000000000102'
  $$)::text,
  '0',
  'user one cannot update another profile'
);

select is(
  public.test_exec_row_count($$
    update public.notifications
    set read = true
    where id = '40000000-0000-0000-0000-000000000301'
  $$)::text,
  '1',
  'user one can update their own notification'
);

select is(
  public.test_exec_row_count($$
    update public.notifications
    set read = true
    where id = '40000000-0000-0000-0000-000000000302'
  $$)::text,
  '0',
  'user one cannot update another notification'
);

select is(
  public.test_capture_sqlstate($$
    insert into public.user_profiles (auth_user_id, first_name, last_name, email, university_username)
    values ('20000000-0000-0000-0000-000000000101', 'Injected', 'Profile', 'injected@example.com', 'inject1')
  $$),
  '42501',
  'authenticated users cannot insert profiles directly'
);

select is(
  public.test_capture_sqlstate($$
    insert into public.notifications (user_id, title)
    values ('30000000-0000-0000-0000-000000000201', 'Injected notification')
  $$),
  '42501',
  'authenticated users cannot insert notifications directly'
);

set local request.jwt.claim.sub = '20000000-0000-0000-0000-000000000102';

select results_eq(
  $$
    select auth_user_id
    from public.user_profiles
    order by auth_user_id
  $$,
  $$
    values ('20000000-0000-0000-0000-000000000102'::uuid)
  $$,
  'user two can only read their own profile'
);

select results_eq(
  $$
    select id
    from public.notifications
    order by id
  $$,
  $$
    values ('40000000-0000-0000-0000-000000000302'::uuid)
  $$,
  'user two can only read their own notifications'
);

reset role;
set local role anon;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000000';

select is(
  (select count(*)::text from public.user_profiles),
  '0',
  'anon cannot read user profiles'
);

select is(
  (select count(*)::text from public.notifications),
  '0',
  'anon cannot read notifications'
);

select * from finish();
rollback;
