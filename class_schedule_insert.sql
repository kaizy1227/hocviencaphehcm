-- Chạy trong Supabase SQL Editor

create table if not exists class_schedule (
  id          text primary key,          -- lark_id
  date        date not null,
  course      text not null,
  si_so       smallint,
  giang_vien  text,
  synced_at   timestamptz default now()
);

create index if not exists class_schedule_date_idx on class_schedule (date desc);

alter table class_schedule enable row level security;

create policy "Public read"
  on class_schedule for select
  to anon
  using (true);
