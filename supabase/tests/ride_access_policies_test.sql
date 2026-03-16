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

select plan(22);

insert into auth.users (id, email)
values
  ('70000000-0000-0000-0000-000000000101', 'driver@example.com'),
  ('70000000-0000-0000-0000-000000000102', 'passenger.a@example.com'),
  ('70000000-0000-0000-0000-000000000103', 'passenger.b@example.com'),
  ('70000000-0000-0000-0000-000000000104', 'outsider@example.com');

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
    '71000000-0000-0000-0000-000000000201',
    '70000000-0000-0000-0000-000000000101',
    'Driver',
    'Policy',
    'driver@example.com',
    'driverpolicy'
  ),
  (
    '71000000-0000-0000-0000-000000000202',
    '70000000-0000-0000-0000-000000000102',
    'Passenger',
    'Alpha',
    'passenger.a@example.com',
    'passengera'
  ),
  (
    '71000000-0000-0000-0000-000000000203',
    '70000000-0000-0000-0000-000000000103',
    'Passenger',
    'Beta',
    'passenger.b@example.com',
    'passengerb'
  ),
  (
    '71000000-0000-0000-0000-000000000204',
    '70000000-0000-0000-0000-000000000104',
    'Out',
    'Sider',
    'outsider@example.com',
    'outsider1'
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
values
  (
    '72000000-0000-0000-0000-000000000301',
    '71000000-0000-0000-0000-000000000201',
    'Bath',
    'Bristol',
    '2026-03-16T10:00:00Z',
    3,
    1
  ),
  (
    '72000000-0000-0000-0000-000000000302',
    '71000000-0000-0000-0000-000000000203',
    'Bristol',
    'London',
    '2026-03-16T11:00:00Z',
    2,
    2
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
values
  (
    '73000000-0000-0000-0000-000000000401',
    '72000000-0000-0000-0000-000000000301',
    '71000000-0000-0000-0000-000000000202',
    'Bath Campus',
    'Bristol Centre',
    9.50,
    'confirmed',
    '1234'
  ),
  (
    '73000000-0000-0000-0000-000000000402',
    '72000000-0000-0000-0000-000000000301',
    '71000000-0000-0000-0000-000000000203',
    'Oldfield Park',
    'Bristol Centre',
    8.50,
    'pending',
    '5678'
  );

insert into public.ride_chats (
  id,
  ride_id,
  passenger_id
)
values (
  '74000000-0000-0000-0000-000000000501',
  '72000000-0000-0000-0000-000000000301',
  '71000000-0000-0000-0000-000000000202'
);

insert into public.ride_messages (
  id,
  chat_id,
  sender_id,
  message
)
values (
  '75000000-0000-0000-0000-000000000601',
  '74000000-0000-0000-0000-000000000501',
  '71000000-0000-0000-0000-000000000202',
  'I am ready'
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
  '76000000-0000-0000-0000-000000000701',
  '73000000-0000-0000-0000-000000000401',
  '71000000-0000-0000-0000-000000000202',
  '71000000-0000-0000-0000-000000000201',
  9.50,
  'pay-ride-access'
);

insert into public.incident_reports (
  id,
  ride_id,
  reporter_id,
  description
)
values (
  '77000000-0000-0000-0000-000000000801',
  '72000000-0000-0000-0000-000000000301',
  '71000000-0000-0000-0000-000000000202',
  'Felt unsafe'
);

set local role authenticated;
set local request.jwt.claim.sub = '70000000-0000-0000-0000-000000000101';

select is(
  public.test_exec_row_count($$
    update public.rides
    set destination = 'Cardiff'
    where id = '72000000-0000-0000-0000-000000000301'
  $$)::text,
  '1',
  'driver can update their own ride'
);
select is(
  public.test_exec_row_count($$
    update public.rides
    set destination = 'Manchester'
    where id = '72000000-0000-0000-0000-000000000302'
  $$)::text,
  '0',
  'driver cannot update another users ride'
);
select results_eq(
  $$
    select id
    from public.bookings
    order by id
  $$,
  $$
    values
      ('73000000-0000-0000-0000-000000000401'::uuid),
      ('73000000-0000-0000-0000-000000000402'::uuid)
  $$,
  'driver can view bookings on their ride'
);
select results_eq(
  $$
    select id
    from public.ride_chats
    order by id
  $$,
  $$
    values ('74000000-0000-0000-0000-000000000501'::uuid)
  $$,
  'driver can view ride chats on their ride'
);
select results_eq(
  $$
    select id
    from public.ride_messages
    order by id
  $$,
  $$
    values ('75000000-0000-0000-0000-000000000601'::uuid)
  $$,
  'driver can view ride messages on their ride'
);
select results_eq(
  $$
    select id
    from public.payments
    order by id
  $$,
  $$
    values ('76000000-0000-0000-0000-000000000701'::uuid)
  $$,
  'driver can view payments for their ride'
);
select is(
  (select count(*)::text from public.incident_reports),
  '0',
  'driver cannot view another users incident reports'
);

set local request.jwt.claim.sub = '70000000-0000-0000-0000-000000000102';

select results_eq(
  $$
    select id
    from public.bookings
    order by id
  $$,
  $$
    values ('73000000-0000-0000-0000-000000000401'::uuid)
  $$,
  'passenger A can only view their own booking'
);
select is(
  public.test_exec_row_count($$
    update public.bookings
    set status = 'completed'
    where id = '73000000-0000-0000-0000-000000000401'
  $$)::text,
  '1',
  'passenger A can update their own booking'
);
select results_eq(
  $$
    select id
    from public.ride_chats
    order by id
  $$,
  $$
    values ('74000000-0000-0000-0000-000000000501'::uuid)
  $$,
  'passenger A can view their own ride chat'
);
select results_eq(
  $$
    select id
    from public.ride_messages
    order by id
  $$,
  $$
    values ('75000000-0000-0000-0000-000000000601'::uuid)
  $$,
  'passenger A can view messages in their own ride chat'
);
select results_eq(
  $$
    select id
    from public.payments
    order by id
  $$,
  $$
    values ('76000000-0000-0000-0000-000000000701'::uuid)
  $$,
  'passenger A can view their own payment'
);
select results_eq(
  $$
    select id
    from public.incident_reports
    order by id
  $$,
  $$
    values ('77000000-0000-0000-0000-000000000801'::uuid)
  $$,
  'passenger A can view their own incident report'
);

set local request.jwt.claim.sub = '70000000-0000-0000-0000-000000000103';

select results_eq(
  $$
    select id
    from public.bookings
    order by id
  $$,
  $$
    values ('73000000-0000-0000-0000-000000000402'::uuid)
  $$,
  'passenger B can only view their own booking'
);
select is(
  (select count(*)::text from public.ride_chats),
  '0',
  'passenger B cannot view another passengers ride chat'
);

set local request.jwt.claim.sub = '70000000-0000-0000-0000-000000000104';

select is(
  (select count(*)::text from public.bookings),
  '0',
  'non-participants cannot view bookings'
);
select is(
  (select count(*)::text from public.ride_chats),
  '0',
  'non-participants cannot view ride chats'
);
select is(
  (select count(*)::text from public.ride_messages),
  '0',
  'non-participants cannot view ride messages'
);
select is(
  public.test_capture_sqlstate($$
    insert into public.ride_messages (chat_id, sender_id, message)
    values (
      '74000000-0000-0000-0000-000000000501',
      '71000000-0000-0000-0000-000000000204',
      'let me in'
    )
  $$),
  '42501',
  'non-participants cannot insert ride messages'
);
select is(
  (select count(*)::text from public.payments),
  '0',
  'non-participants cannot view payments'
);
select is(
  (select count(*)::text from public.incident_reports),
  '0',
  'non-participants cannot view incident reports'
);

reset role;
set local role anon;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000000';

select is(
  (select count(*)::text from public.rides),
  '0',
  'anon cannot view rides'
);

select * from finish();
rollback;
