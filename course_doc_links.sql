-- Link tài liệu công thức theo khóa (link ẩn, không cần đăng nhập)
-- Chạy trong Supabase SQL Editor
create table if not exists course_doc_links (
  id         uuid primary key default gen_random_uuid(),
  token      text unique not null,
  course     text not null,
  title      text default '',
  active     boolean default true,
  view_count integer default 0,
  created_at timestamptz default now()
);

-- Bật RLS, KHÔNG tạo policy cho anon → chỉ đọc được qua service role (server API).
alter table course_doc_links enable row level security;
