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

select plan(26);

insert into auth.users (id, email)
values
  ('50000000-0000-0000-0000-000000000101', 'driver@example.com'),
  ('50000000-0000-0000-0000-000000000102', 'passenger@example.com');

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
    '51000000-0000-0000-0000-000000000201',
    '50000000-0000-0000-0000-000000000101',
    'Driver',
    'One',
    'driver@example.com',
    'driver01'
  ),
  (
    '51000000-0000-0000-0000-000000000202',
    '50000000-0000-0000-0000-000000000102',
    'Passenger',
    'One',
    'passenger@example.com',
    'passenger01'
  );

insert into public.rides (
  id,
  driver_id,
  origin,
  destination,
  departure_time,
  seats_total,
  seats_available
)
values (
  '52000000-0000-0000-0000-000000000301',
  '51000000-0000-0000-0000-000000000201',
  'Bath',
  'Bristol',
  '2026-03-16T10:00:00Z',
  3,
  2
);

insert into public.bookings (
  id,
  ride_id,
  passenger_id,
  pickup_location,
  dropoff_location,
  price
)
values (
  '53000000-0000-0000-0000-000000000401',
  '52000000-0000-0000-0000-000000000301',
  '51000000-0000-0000-0000-000000000202',
  'Bath Campus',
  'Bristol Centre',
  8.50
);

insert into public.driver_verification (
  id,
  driver_id,
  licence_number,
  vehicle_registration,
  vehicle_model,
  vehicle_color,
  vehicle_seats
)
values (
  '54000000-0000-0000-0000-000000000501',
  '51000000-0000-0000-0000-000000000201',
  'SMITH8051559A9A9',
  'AB12CDE',
  'Prius',
  'Blue',
  5
);

select ok(to_regclass('public.rides') is not null, 'rides table exists');
select ok(to_regclass('public.bookings') is not null, 'bookings table exists');
select ok(to_regclass('public.driver_verification') is not null, 'driver_verification table exists');

select ok((select relrowsecurity from pg_class where oid = 'public.rides'::regclass), 'rides has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.bookings'::regclass), 'bookings has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.driver_verification'::regclass), 'driver_verification has RLS enabled');

select is(
  (select status from public.rides where id = '52000000-0000-0000-0000-000000000301'),
  'open',
  'rides.status defaults to open'
);
select is(
  (select status from public.bookings where id = '53000000-0000-0000-0000-000000000401'),
  'pending',
  'bookings.status defaults to pending'
);
select is(
  (select verified::text from public.driver_verification where id = '54000000-0000-0000-0000-000000000501'),
  'false',
  'driver_verification.verified defaults to false'
);

select is(
  public.test_capture_sqlstate($$
    insert into public.rides (driver_id, origin, destination, departure_time, seats_total, seats_available)
    values (
      '51000000-0000-0000-0000-000000000201',
      'Bath',
      'London',
      '2026-03-16T12:00:00Z',
      2,
      3
    )
  $$),
  '23514',
  'rides reject seats_available above seats_total'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.rides (driver_id, origin, destination, departure_time, seats_total, seats_available, status)
    values (
      '51000000-0000-0000-0000-000000000201',
      'Bath',
      'London',
      '2026-03-16T12:00:00Z',
      2,
      2,
      'boarding'
    )
  $$),
  '23514',
  'rides reject invalid status values'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.bookings (ride_id, passenger_id, pickup_location, dropoff_location, price)
    values (
      '52000000-0000-0000-0000-000000009999',
      '51000000-0000-0000-0000-000000000202',
      'Bath Campus',
      'Bristol Centre',
      9.00
    )
  $$),
  '23503',
  'bookings enforce their ride foreign key'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.bookings (ride_id, passenger_id, pickup_location, dropoff_location, price)
    values (
      '52000000-0000-0000-0000-000000000301',
      '51000000-0000-0000-0000-000000000202',
      'Bath Campus',
      'Bristol Centre',
      9.00
    )
  $$),
  '23505',
  'bookings reject duplicate ride and passenger pairs'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.bookings (ride_id, passenger_id, pickup_location, dropoff_location, price, pickup_code)
    values (
      '52000000-0000-0000-0000-000000000301',
      '51000000-0000-0000-0000-000000000201',
      'Bath Campus',
      'Bristol Centre',
      9.00,
      '12AB'
    )
  $$),
  '23514',
  'bookings reject non-numeric pickup codes'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.driver_verification (driver_id, licence_number, vehicle_registration)
    values (
      '51000000-0000-0000-0000-000000000201',
      'JONES06205212345',
      'BF59DZR'
    )
  $$),
  '23505',
  'driver_verification enforces one row per driver'
);

select is(
  (select number_plate from public.driver_verification where id = '54000000-0000-0000-0000-000000000501'),
  'AB12CDE',
  'driver_verification syncs number_plate from vehicle_registration'
);
select is(
  (select car_model from public.driver_verification where id = '54000000-0000-0000-0000-000000000501'),
  'Prius',
  'driver_verification syncs car_model from vehicle_model'
);
select is(
  (select vehicle_colour from public.driver_verification where id = '54000000-0000-0000-0000-000000000501'),
  'Blue',
  'driver_verification syncs vehicle_colour from vehicle_color'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'rides'
      and indexname = 'idx_rides_driver'
  ),
  'rides driver index exists'
);
select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'bookings'
      and indexname = 'idx_bookings_ride'
  ),
  'bookings ride index exists'
);
select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.driver_verification'::regclass
      and tgname = 'sync_driver_verification_aliases_trigger'
      and not tgisinternal
  ),
  'driver verification alias sync trigger exists'
);

select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'rides'
  ),
  'Authenticated users can view rides|Drivers can create their own rides|Drivers can delete their own rides|Drivers can update their own rides',
  'rides policies are present'
);
select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bookings'
  ),
  'Passengers can create their own bookings|Ride participants can delete bookings|Ride participants can update bookings|Ride participants can view bookings',
  'bookings policies are present'
);
select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'driver_verification'
  ),
  'Drivers can create their own verification|Drivers can update their own verification|Drivers can view their own verification',
  'driver_verification policies are present'
);

select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.rides'::regclass
      and tgname = 'set_rides_timestamp'
      and not tgisinternal
  ),
  'rides updated_at trigger exists'
);
select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.bookings'::regclass
      and tgname = 'set_bookings_timestamp'
      and not tgisinternal
  ),
  'bookings updated_at trigger exists'
);

select * from finish();
rollback;
