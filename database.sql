-- 1) Enums for safer, validated values
create type user_status as enum ('student', 'staff', 'outsider');

create type gender as enum (
  'male',
  'female',
  'non_binary',
  'other',
  'prefer_not_to_say'
);

-- 2) User profile table
create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),

  -- Link to Supabase auth user
  auth_user_id uuid not null
    references auth.users (id) on delete cascade,

  first_name text not null,
  last_name  text not null,


  email text not null,

  phone_number text, -- we’ll validate format in the API layer

  gender gender,

  university_username text not null,

  status user_status not null default 'student',

  -- Average rating, not per-rating history
  rating numeric(2,1) not null default 0.0
    check (rating >= 0 and rating <= 5),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Uniqueness constraints for identification
  constraint unique_email unique (email),
  constraint unique_university_username unique (university_username)
);

-- 3) Auto-update 'updated_at' on changes
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_timestamp
before update on public.user_profiles
for each row
execute procedure public.set_current_timestamp_updated_at();




alter table public.user_profiles enable row level security;

-- Users can see their own profile
create policy "Users can view their own profile"
on public.user_profiles
for select
using ( auth.uid() = auth_user_id );

-- Users can update their own profile
create policy "Users can update their own profile"
on public.user_profiles
for update
using ( auth.uid() = auth_user_id )
with check ( auth.uid() = auth_user_id );
