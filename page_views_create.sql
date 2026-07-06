-- Bảng lưu lượt xem trang để hiển thị dashboard traffic trong Admin
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  source text not null default 'direct', -- direct | google | facebook | zalo | tiktok | instagram | bing | yahoo | khac
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views (created_at desc);
create index if not exists page_views_source_idx on page_views (source);

alter table page_views enable row level security;

-- Chỉ admin được đọc số liệu (insert dùng service role key ở server, không qua RLS)
create policy "Admin can read page views" on page_views for select
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
