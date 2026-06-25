-- ============================================================
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- 1. Trao Bằng
create table if not exists public.trao_bang (
  id         uuid primary key default gen_random_uuid(),
  lark_id    text unique,
  name       text not null default '',
  date       text default '',
  course     text default '',
  photo_url  text default '',
  created_at timestamptz default now()
);
alter table public.trao_bang enable row level security;
drop policy if exists "Public read trao_bang" on public.trao_bang;
create policy "Public read trao_bang" on public.trao_bang for select using (true);
drop policy if exists "All trao_bang" on public.trao_bang;
create policy "All trao_bang" on public.trao_bang for all using (true) with check (true);

-- 2. Lop Hoc
create table if not exists public.lop_hoc (
  id            uuid primary key default gen_random_uuid(),
  lark_id       text unique,
  date          text default '',
  course        text default '',
  class_name    text default '',
  student_names text default '',
  photos        text[] default '{}',
  created_at    timestamptz default now()
);
alter table public.lop_hoc enable row level security;
drop policy if exists "Public read lop_hoc" on public.lop_hoc;
create policy "Public read lop_hoc" on public.lop_hoc for select using (true);
drop policy if exists "All lop_hoc" on public.lop_hoc;
create policy "All lop_hoc" on public.lop_hoc for all using (true) with check (true);

-- 3. Công Thức 2
create table if not exists public.cong_thuc (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null default '',
  category            text default '',
  photo_url           text default '',
  instructions        text default '',
  total_cost          numeric,
  recipe_text         text default '',
  linked_product_ids  uuid[] default '{}',
  courses             text[] default '{}',
  sort_order          int default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
alter table public.cong_thuc enable row level security;
drop policy if exists "Auth read cong_thuc" on public.cong_thuc;
create policy "Auth read cong_thuc" on public.cong_thuc for select using (auth.uid() is not null);
drop policy if exists "All cong_thuc" on public.cong_thuc;
create policy "All cong_thuc" on public.cong_thuc for all using (true) with check (true);

-- ============================================================
-- Sau khi chạy SQL, tạo 3 Storage buckets trong Supabase:
-- Dashboard > Storage > New bucket:
--   1. trao-bang   (Public: ON)
--   2. lop-hoc     (Public: ON)
--   3. cong-thuc   (Public: ON)
-- ============================================================
