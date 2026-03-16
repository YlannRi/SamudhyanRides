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

  calendar_link text,
  trusted_contacts jsonb not null default '[]'::jsonb,

  status user_status not null default 'student',

  -- Average rating, not per-rating history
  rating numeric(2,1) not null default 0.0
    check (rating >= 0 and rating <= 5),
  driver_rating numeric(2,1) not null default 0.0
    check (driver_rating >= 0 and driver_rating <= 5),
  rider_rating numeric(2,1) not null default 0.0
    check (rider_rating >= 0 and rider_rating <= 5),

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
to authenticated
using ( (select auth.uid()) = auth_user_id );

-- Users can update their own profile
create policy "Users can update their own profile"
on public.user_profiles
for update
to authenticated
using ( (select auth.uid()) = auth_user_id )
with check ( (select auth.uid()) = auth_user_id );


-- ============================================================
-- CORE RIDE TABLES
-- ============================================================

create table public.rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null
    references public.user_profiles (id) on delete cascade,
  origin text not null,
  destination text not null,
  origin_lat double precision,
  origin_lng double precision,
  destination_lat double precision,
  destination_lng double precision,
  departure_time timestamptz not null,
  seats_total integer not null check (seats_total > 0),
  seats_available integer not null check (seats_available >= 0 and seats_available <= seats_total),
  status text not null default 'open'
    check (status in ('open', 'full', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_rides_driver on public.rides(driver_id);
create index idx_rides_status on public.rides(status);

create trigger set_rides_timestamp
before update on public.rides
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.rides enable row level security;

create policy "Authenticated users can view rides"
on public.rides
for select
to authenticated
using (true);

create policy "Drivers can create their own rides"
on public.rides
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = rides.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create policy "Drivers can update their own rides"
on public.rides
for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = rides.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = rides.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create policy "Drivers can delete their own rides"
on public.rides
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = rides.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null
    references public.rides (id) on delete cascade,
  passenger_id uuid not null
    references public.user_profiles (id) on delete cascade,
  pickup_location text not null,
  dropoff_location text not null,
  pickup_lat double precision,
  pickup_lng double precision,
  dropoff_lat double precision,
  dropoff_lng double precision,
  price numeric(10,2) not null check (price >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  pickup_code text check (pickup_code is null or pickup_code ~ '^[0-9]{4}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_booking_per_ride_passenger unique (ride_id, passenger_id)
);

create index idx_bookings_ride on public.bookings(ride_id);
create index idx_bookings_passenger on public.bookings(passenger_id);

create trigger set_bookings_timestamp
before update on public.bookings
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.bookings enable row level security;

create policy "Ride participants can view bookings"
on public.bookings
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = bookings.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.rides rides
    join public.user_profiles driver on driver.id = rides.driver_id
    where rides.id = bookings.ride_id
      and driver.auth_user_id = (select auth.uid())
  )
);

create policy "Passengers can create their own bookings"
on public.bookings
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = bookings.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
);

create policy "Ride participants can update bookings"
on public.bookings
for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = bookings.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.rides rides
    join public.user_profiles driver on driver.id = rides.driver_id
    where rides.id = bookings.ride_id
      and driver.auth_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = bookings.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.rides rides
    join public.user_profiles driver on driver.id = rides.driver_id
    where rides.id = bookings.ride_id
      and driver.auth_user_id = (select auth.uid())
  )
);

create policy "Ride participants can delete bookings"
on public.bookings
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = bookings.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.rides rides
    join public.user_profiles driver on driver.id = rides.driver_id
    where rides.id = bookings.ride_id
      and driver.auth_user_id = (select auth.uid())
  )
);

create or replace function public.sync_driver_verification_aliases()
returns trigger as $$
begin
  if new.vehicle_registration is not null and new.number_plate is null then
    new.number_plate = new.vehicle_registration;
  elsif new.number_plate is not null and new.vehicle_registration is null then
    new.vehicle_registration = new.number_plate;
  end if;

  if new.vehicle_model is not null and new.car_model is null then
    new.car_model = new.vehicle_model;
  elsif new.car_model is not null and new.vehicle_model is null then
    new.vehicle_model = new.car_model;
  end if;

  if new.vehicle_color is not null and new.vehicle_colour is null then
    new.vehicle_colour = new.vehicle_color;
  elsif new.vehicle_colour is not null and new.vehicle_color is null then
    new.vehicle_color = new.vehicle_colour;
  end if;

  return new;
end;
$$ language plpgsql;

create table public.driver_verification (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null unique
    references public.user_profiles (id) on delete cascade,
  licence_number text not null,
  vehicle_registration text not null,
  number_plate text,
  vehicle_make text,
  vehicle_model text,
  car_model text,
  vehicle_color text,
  vehicle_colour text,
  vehicle_seats integer check (vehicle_seats is null or vehicle_seats > 0),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_driver_verification_verified on public.driver_verification(verified);

create trigger sync_driver_verification_aliases_trigger
before insert or update on public.driver_verification
for each row
execute procedure public.sync_driver_verification_aliases();

create trigger set_driver_verification_timestamp
before update on public.driver_verification
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.driver_verification enable row level security;

create policy "Drivers can view their own verification"
on public.driver_verification
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = driver_verification.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create policy "Drivers can create their own verification"
on public.driver_verification
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = driver_verification.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create policy "Drivers can update their own verification"
on public.driver_verification
for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = driver_verification.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = driver_verification.driver_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null
    references public.rides (id) on delete cascade,
  reviewer_id uuid not null
    references public.user_profiles (id) on delete cascade,
  reviewed_user_id uuid not null
    references public.user_profiles (id) on delete cascade,
  rating numeric(2,1) not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  constraint unique_rating_per_ride_user unique (ride_id, reviewer_id, reviewed_user_id),
  constraint ratings_no_self_review check (reviewer_id <> reviewed_user_id)
);

create index idx_ratings_reviewed_user on public.ratings(reviewed_user_id);
create index idx_ratings_reviewer on public.ratings(reviewer_id);

alter table public.ratings enable row level security;

create policy "Authenticated users can view ratings"
on public.ratings
for select
to authenticated
using (true);

create policy "Users can create ratings they authored"
on public.ratings
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = ratings.reviewer_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null
    references public.bookings (id) on delete cascade,
  passenger_id uuid not null
    references public.user_profiles (id) on delete cascade,
  driver_id uuid not null
    references public.user_profiles (id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'succeeded', 'failed', 'cancelled')),
  payment_provider_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payments_booking on public.payments(booking_id);
create index idx_payments_passenger on public.payments(passenger_id);
create index idx_payments_driver on public.payments(driver_id);

create trigger set_payments_timestamp
before update on public.payments
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.payments enable row level security;

create policy "Ride participants can view payments"
on public.payments
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = payments.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.user_profiles driver
    where driver.id = payments.driver_id
      and driver.auth_user_id = (select auth.uid())
  )
);

create policy "Passengers can create their own payments"
on public.payments
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = payments.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
);

create table public.incident_reports (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null
    references public.rides (id) on delete cascade,
  reporter_id uuid not null
    references public.user_profiles (id) on delete cascade,
  description text not null,
  status text not null default 'open'
    check (status in ('open', 'investigating', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_incident_reports_ride on public.incident_reports(ride_id);
create index idx_incident_reports_reporter on public.incident_reports(reporter_id);

create trigger set_incident_reports_timestamp
before update on public.incident_reports
for each row
execute procedure public.set_current_timestamp_updated_at();

alter table public.incident_reports enable row level security;

create policy "Users can view their own incident reports"
on public.incident_reports
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = incident_reports.reporter_id
      and profiles.auth_user_id = (select auth.uid())
  )
);

create policy "Users can create their own incident reports"
on public.incident_reports
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles profiles
    where profiles.id = incident_reports.reporter_id
      and profiles.auth_user_id = (select auth.uid())
  )
);


-- ============================================================
-- RIDE CHAT TABLES
-- ============================================================

-- One chat room per ride
create table public.ride_chats (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  passenger_id uuid not null references public.user_profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Messages within a chat
create table public.ride_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.ride_chats(id) on delete cascade,
  sender_id uuid not null references public.user_profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create index idx_ride_messages_chat on public.ride_messages(chat_id);
create index idx_ride_chats_ride on public.ride_chats(ride_id);
create unique index idx_ride_chats_ride_passenger on public.ride_chats(ride_id, passenger_id);

alter table public.ride_chats enable row level security;

create policy "Ride participants can view chats"
on public.ride_chats
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = ride_chats.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.rides rides
    join public.user_profiles driver on driver.id = rides.driver_id
    where rides.id = ride_chats.ride_id
      and driver.auth_user_id = (select auth.uid())
  )
);

create policy "Ride participants can create chats"
on public.ride_chats
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles passenger
    where passenger.id = ride_chats.passenger_id
      and passenger.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.rides rides
    join public.user_profiles driver on driver.id = rides.driver_id
    where rides.id = ride_chats.ride_id
      and driver.auth_user_id = (select auth.uid())
  )
);

alter table public.ride_messages enable row level security;

create policy "Ride participants can view messages"
on public.ride_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.ride_chats chats
    join public.rides rides on rides.id = chats.ride_id
    join public.user_profiles driver on driver.id = rides.driver_id
    where chats.id = ride_messages.chat_id
      and driver.auth_user_id = (select auth.uid())
  )
  or exists (
    select 1
    from public.ride_chats chats
    join public.user_profiles passenger on passenger.id = chats.passenger_id
    where chats.id = ride_messages.chat_id
      and passenger.auth_user_id = (select auth.uid())
  )
);

create policy "Ride participants can create messages"
on public.ride_messages
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles sender
    where sender.id = ride_messages.sender_id
      and sender.auth_user_id = (select auth.uid())
  )
  and (
    exists (
      select 1
      from public.ride_chats chats
      join public.rides rides on rides.id = chats.ride_id
      join public.user_profiles driver on driver.id = rides.driver_id
      where chats.id = ride_messages.chat_id
        and driver.auth_user_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.ride_chats chats
      join public.user_profiles passenger on passenger.id = chats.passenger_id
      where chats.id = ride_messages.chat_id
        and passenger.auth_user_id = (select auth.uid())
    )
  )
);


-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
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
