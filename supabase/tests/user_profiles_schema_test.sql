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

select plan(17);

insert into auth.users (id, email)
values
  ('00000000-0000-0000-0000-000000000101', 'alpha@example.com'),
  ('00000000-0000-0000-0000-000000000102', 'beta@example.com');

insert into public.user_profiles (
  auth_user_id,
  first_name,
  last_name,
  email,
  university_username
)
values (
  '00000000-0000-0000-0000-000000000101',
  'Alpha',
  'Tester',
  'alpha@example.com',
  'alpha01'
);

select ok(to_regclass('public.user_profiles') is not null, 'user_profiles table exists');
select ok(to_regprocedure('public.set_current_timestamp_updated_at()') is not null, 'updated_at trigger function exists');
select ok((select relrowsecurity from pg_class where oid = 'public.user_profiles'::regclass), 'user_profiles has RLS enabled');

select is(
  (select is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'auth_user_id'),
  'NO',
  'auth_user_id is required'
);
select is(
  (select is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'first_name'),
  'NO',
  'first_name is required'
);
select is(
  (select is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'email'),
  'NO',
  'email is required'
);
select is(
  (select is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'user_profiles' and column_name = 'trusted_contacts'),
  'NO',
  'trusted_contacts is required'
);

select is(
  (select trusted_contacts::text from public.user_profiles where auth_user_id = '00000000-0000-0000-0000-000000000101'),
  '[]',
  'trusted_contacts defaults to an empty array'
);
select is(
  (select status::text from public.user_profiles where auth_user_id = '00000000-0000-0000-0000-000000000101'),
  'student',
  'status defaults to student'
);
select is(
  (select rating::text from public.user_profiles where auth_user_id = '00000000-0000-0000-0000-000000000101'),
  '0.0',
  'rating defaults to 0.0'
);
select is(
  (select is_active::text from public.user_profiles where auth_user_id = '00000000-0000-0000-0000-000000000101'),
  'true',
  'is_active defaults to true'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.user_profiles'::regclass
      and contype = 'f'
      and confrelid = 'auth.users'::regclass
  ),
  'user_profiles references auth.users'
);

select is(
  public.test_capture_sqlstate($$
    insert into public.user_profiles (auth_user_id, first_name, last_name, email, university_username)
    values ('00000000-0000-0000-0000-000000000102', 'Beta', 'Tester', 'alpha@example.com', 'beta01')
  $$),
  '23505',
  'duplicate emails are rejected'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.user_profiles (auth_user_id, first_name, last_name, email, university_username)
    values ('00000000-0000-0000-0000-000000000102', 'Beta', 'Tester', 'beta@example.com', 'alpha01')
  $$),
  '23505',
  'duplicate university usernames are rejected'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.user_profiles (auth_user_id, first_name, last_name, email, university_username, rating)
    values ('00000000-0000-0000-0000-000000000102', 'Beta', 'Tester', 'beta@example.com', 'beta01', 6.0)
  $$),
  '23514',
  'rating check constraint rejects invalid values'
);

select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_profiles'
  ),
  'Users can update their own profile|Users can view their own profile',
  'user_profiles policies are present'
);

select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.user_profiles'::regclass
      and tgname = 'set_timestamp'
      and not tgisinternal
  ),
  'user_profiles update trigger exists'
);

select * from finish();
rollback;
