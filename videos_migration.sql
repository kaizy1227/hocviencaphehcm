-- Chạy file này trong Supabase SQL Editor
-- Sau đó vào Storage > New bucket > tên "videos" > Public bucket (bật public read)

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text,
  video_url text not null,
  thumbnail_url text,
  active boolean default true,
  sort_order int default 0,
  service_slug text,
  created_at timestamptz default now()
);

-- Bảng service_videos: video riêng cho từng trang dịch vụ
CREATE TABLE IF NOT EXISTS public.service_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  video_url text NOT NULL,
  thumbnail_url text,
  service_slug text NOT NULL,
  active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.service_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read service_videos" ON public.service_videos
  FOR SELECT USING (true);

CREATE POLICY "Admin write service_videos" ON public.service_videos
  FOR ALL USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE INDEX IF NOT EXISTS idx_service_videos_slug ON public.service_videos(service_slug);

alter table public.videos enable row level security;

create policy "Public read videos" on public.videos
  for select using (true);

create policy "Admin write videos" on public.videos
  for all using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
