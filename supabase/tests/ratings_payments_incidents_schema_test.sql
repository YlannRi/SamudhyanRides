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

select plan(22);

insert into auth.users (id, email)
values
  ('60000000-0000-0000-0000-000000000101', 'driver2@example.com'),
  ('60000000-0000-0000-0000-000000000102', 'passenger2@example.com'),
  ('60000000-0000-0000-0000-000000000103', 'reviewer@example.com');

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
    '61000000-0000-0000-0000-000000000201',
    '60000000-0000-0000-0000-000000000101',
    'Driver',
    'Two',
    'driver2@example.com',
    'driver02'
  ),
  (
    '61000000-0000-0000-0000-000000000202',
    '60000000-0000-0000-0000-000000000102',
    'Passenger',
    'Two',
    'passenger2@example.com',
    'passenger02'
  ),
  (
    '61000000-0000-0000-0000-000000000203',
    '60000000-0000-0000-0000-000000000103',
    'Reviewer',
    'One',
    'reviewer@example.com',
    'reviewer01'
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
  '62000000-0000-0000-0000-000000000301',
  '61000000-0000-0000-0000-000000000201',
  'Bath',
  'London',
  '2026-03-16T12:00:00Z',
  4,
  3
);

insert into public.bookings (
  id,
  ride_id,
  passenger_id,
  pickup_location,
  dropoff_location,
  price,
  status,
  pickup_code
)
values (
  '63000000-0000-0000-0000-000000000401',
  '62000000-0000-0000-0000-000000000301',
  '61000000-0000-0000-0000-000000000202',
  'Bath Campus',
  'London Station',
  15.00,
  'confirmed',
  '1234'
);

insert into public.ratings (
  id,
  ride_id,
  reviewer_id,
  reviewed_user_id,
  rating,
  comment
)
values (
  '64000000-0000-0000-0000-000000000501',
  '62000000-0000-0000-0000-000000000301',
  '61000000-0000-0000-0000-000000000203',
  '61000000-0000-0000-0000-000000000201',
  4.5,
  'Safe ride'
);

insert into public.payments (
  id,
  booking_id,
  passenger_id,
  driver_id,
  amount,
  payment_provider_id
)
values (
  '65000000-0000-0000-0000-000000000601',
  '63000000-0000-0000-0000-000000000401',
  '61000000-0000-0000-0000-000000000202',
  '61000000-0000-0000-0000-000000000201',
  15.00,
  'stripe-123'
);

insert into public.incident_reports (
  id,
  ride_id,
  reporter_id,
  description
)
values (
  '66000000-0000-0000-0000-000000000701',
  '62000000-0000-0000-0000-000000000301',
  '61000000-0000-0000-0000-000000000202',
  'Late pickup'
);

select ok(to_regclass('public.ratings') is not null, 'ratings table exists');
select ok(to_regclass('public.payments') is not null, 'payments table exists');
select ok(to_regclass('public.incident_reports') is not null, 'incident_reports table exists');

select ok((select relrowsecurity from pg_class where oid = 'public.ratings'::regclass), 'ratings has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.payments'::regclass), 'payments has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.incident_reports'::regclass), 'incident_reports has RLS enabled');

select is(
  public.test_capture_sqlstate($$
    insert into public.ratings (ride_id, reviewer_id, reviewed_user_id, rating)
    values (
      '62000000-0000-0000-0000-000000000301',
      '61000000-0000-0000-0000-000000000202',
      '61000000-0000-0000-0000-000000000201',
      0.0
    )
  $$),
  '23514',
  'ratings reject values below 1'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.ratings (ride_id, reviewer_id, reviewed_user_id, rating)
    values (
      '62000000-0000-0000-0000-000000000301',
      '61000000-0000-0000-0000-000000000202',
      '61000000-0000-0000-0000-000000000201',
      5.5
    )
  $$),
  '23514',
  'ratings reject values above 5'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.ratings (ride_id, reviewer_id, reviewed_user_id, rating)
    values (
      '62000000-0000-0000-0000-000000000301',
      '61000000-0000-0000-0000-000000000201',
      '61000000-0000-0000-0000-000000000201',
      4.0
    )
  $$),
  '23514',
  'ratings reject self-reviews'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.ratings (ride_id, reviewer_id, reviewed_user_id, rating)
    values (
      '62000000-0000-0000-0000-000000000301',
      '61000000-0000-0000-0000-000000000203',
      '61000000-0000-0000-0000-000000000201',
      4.0
    )
  $$),
  '23505',
  'ratings enforce one review per reviewer, ride, and user'
);

select is(
  public.test_capture_sqlstate($$
    insert into public.payments (booking_id, passenger_id, driver_id, amount)
    values (
      '63000000-0000-0000-0000-000000000401',
      '61000000-0000-0000-0000-000000000202',
      '61000000-0000-0000-0000-000000000201',
      -1.00
    )
  $$),
  '23514',
  'payments reject negative amounts'
);
select is(
  (select status from public.payments where id = '65000000-0000-0000-0000-000000000601'),
  'pending',
  'payments.status defaults to pending'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.payments (booking_id, passenger_id, driver_id, amount, payment_provider_id)
    values (
      '63000000-0000-0000-0000-000000000401',
      '61000000-0000-0000-0000-000000000202',
      '61000000-0000-0000-0000-000000000201',
      12.00,
      'stripe-123'
    )
  $$),
  '23505',
  'payments enforce unique payment provider ids'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.payments (booking_id, passenger_id, driver_id, amount)
    values (
      '63000000-0000-0000-0000-000000009999',
      '61000000-0000-0000-0000-000000000202',
      '61000000-0000-0000-0000-000000000201',
      12.00
    )
  $$),
  '23503',
  'payments enforce their booking foreign key'
);

select is(
  (select status from public.incident_reports where id = '66000000-0000-0000-0000-000000000701'),
  'open',
  'incident_reports.status defaults to open'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.incident_reports (ride_id, reporter_id, description, status)
    values (
      '62000000-0000-0000-0000-000000000301',
      '61000000-0000-0000-0000-000000000202',
      'Unexpected state',
      'triaged'
    )
  $$),
  '23514',
  'incident_reports reject invalid statuses'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.incident_reports (ride_id, reporter_id, description)
    values (
      '62000000-0000-0000-0000-000000009999',
      '61000000-0000-0000-0000-000000000202',
      'Missing ride'
    )
  $$),
  '23503',
  'incident_reports enforce their ride foreign key'
);

select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ratings'
  ),
  'Authenticated users can view ratings|Users can create ratings they authored',
  'ratings policies are present'
);
select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'payments'
  ),
  'Passengers can create their own payments|Ride participants can view payments',
  'payments policies are present'
);
select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'incident_reports'
  ),
  'Users can create their own incident reports|Users can view their own incident reports',
  'incident_reports policies are present'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'ratings'
      and indexname = 'idx_ratings_reviewed_user'
  ),
  'ratings reviewed_user index exists'
);
select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.payments'::regclass
      and tgname = 'set_payments_timestamp'
      and not tgisinternal
  ),
  'payments updated_at trigger exists'
);

select * from finish();
rollback;
