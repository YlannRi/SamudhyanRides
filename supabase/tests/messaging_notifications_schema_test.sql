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

select plan(14);

insert into public.ride_chats (id, ride_id, passenger_id)
values (
  '10000000-0000-0000-0000-000000000301',
  '10000000-0000-0000-0000-000000000401',
  '10000000-0000-0000-0000-000000000501'
);

insert into public.ride_messages (id, chat_id, sender_id, message)
values (
  '10000000-0000-0000-0000-000000000302',
  '10000000-0000-0000-0000-000000000301',
  '10000000-0000-0000-0000-000000000501',
  'hello there'
);

insert into public.notifications (id, user_id, title)
values (
  '10000000-0000-0000-0000-000000000303',
  '10000000-0000-0000-0000-000000000601',
  'Chat started'
);

select ok(to_regclass('public.ride_chats') is not null, 'ride_chats table exists');
select ok(to_regclass('public.ride_messages') is not null, 'ride_messages table exists');
select ok(to_regclass('public.notifications') is not null, 'notifications table exists');

select is(
  public.test_capture_sqlstate($$
    insert into public.ride_messages (chat_id, sender_id, message)
    values ('10000000-0000-0000-0000-000000009999', '10000000-0000-0000-0000-000000000501', 'orphaned')
  $$),
  '23503',
  'ride_messages enforce their chat foreign key'
);

select is(
  public.test_capture_sqlstate($$
    insert into public.ride_chats (ride_id, passenger_id)
    values ('10000000-0000-0000-0000-000000000401', '10000000-0000-0000-0000-000000000501')
  $$),
  '23505',
  'ride_chats reject duplicate ride and passenger pairs'
);

select is(
  (select read::text from public.ride_messages where id = '10000000-0000-0000-0000-000000000302'),
  'false',
  'ride_messages.read defaults to false'
);
select is(
  (select type from public.notifications where id = '10000000-0000-0000-0000-000000000303'),
  'chat',
  'notifications.type defaults to chat'
);
select is(
  (select body from public.notifications where id = '10000000-0000-0000-0000-000000000303'),
  '',
  'notifications.body defaults to an empty string'
);
select is(
  (select read::text from public.notifications where id = '10000000-0000-0000-0000-000000000303'),
  'false',
  'notifications.read defaults to false'
);

delete from public.ride_chats
where id = '10000000-0000-0000-0000-000000000301';

select is(
  (select count(*)::text from public.ride_messages where chat_id = '10000000-0000-0000-0000-000000000301'),
  '0',
  'deleting a ride chat cascades to its messages'
);

select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'ride_messages'
      and indexname = 'idx_ride_messages_chat'
  ),
  'ride_messages chat index exists'
);
select ok(
  exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'notifications'
      and indexname = 'idx_notifications_user'
  ),
  'notifications user index exists'
);

select ok((select relrowsecurity from pg_class where oid = 'public.notifications'::regclass), 'notifications has RLS enabled');

select is(
  (
    select string_agg(policyname::text, '|' order by policyname::text)
    from pg_policies
    where schemaname = 'public'
      and tablename = 'notifications'
  ),
  'Users can update their own notifications|Users can view their own notifications',
  'notifications policies are present'
);

select * from finish();
rollback;
