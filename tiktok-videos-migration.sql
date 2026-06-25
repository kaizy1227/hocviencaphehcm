-- ============================================================
-- Chạy file này trong Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- Tạo bảng lưu link video TikTok cho trang /video
-- ============================================================

create table if not exists public.tiktok_videos (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  video_id    text default '',
  title       text default '',
  thumbnail   text default '',
  author      text default '',
  sort_order  int default 0,
  active      boolean default true,
  created_at  timestamptz default now()
);

alter table public.tiktok_videos enable row level security;

drop policy if exists "Public read tiktok_videos" on public.tiktok_videos;
create policy "Public read tiktok_videos" on public.tiktok_videos for select using (true);

drop policy if exists "All tiktok_videos" on public.tiktok_videos;
create policy "All tiktok_videos" on public.tiktok_videos for all using (true) with check (true);
