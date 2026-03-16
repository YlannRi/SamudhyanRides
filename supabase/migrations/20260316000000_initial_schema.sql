-- Mirror of the current application schema for local Supabase testing.
-- Keep this in sync with the repo root database.sql until the schema source
-- is consolidated in one place.

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

  phone_number text,

  gender gender,

  university_username text not null,

  calendar_link text,
  trusted_contacts jsonb not null default '[]'::jsonb,

  status user_status not null default 'student',

  rating numeric(2,1) not null default 0.0
    check (rating >= 0 and rating <= 5),

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint unique_email unique (email),
  constraint unique_university_username unique (university_username)
);

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

create policy "Users can view their own profile"
on public.user_profiles
for select
to authenticated
using ( (select auth.uid()) = auth_user_id );

create policy "Users can update their own profile"
on public.user_profiles
for update
to authenticated
using ( (select auth.uid()) = auth_user_id )
with check ( (select auth.uid()) = auth_user_id );

-- One chat room per ride
create table public.ride_chats (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null,
  passenger_id uuid not null,
  created_at timestamptz not null default now()
);

-- Messages within a chat
create table public.ride_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.ride_chats(id) on delete cascade,
  sender_id uuid not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create index idx_ride_messages_chat on public.ride_messages(chat_id);
create index idx_ride_chats_ride on public.ride_chats(ride_id);
create unique index idx_ride_chats_ride_passenger on public.ride_chats(ride_id, passenger_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null default 'chat',
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now(),
  read boolean not null default false,
  link text
);

create index idx_notifications_user on public.notifications(user_id);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
on public.notifications
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = notifications.user_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create policy "Users can update their own notifications"
on public.notifications
for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = notifications.user_id
      and profiles.auth_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = notifications.user_id
      and profiles.auth_user_id = (select auth.uid())
  )
);
