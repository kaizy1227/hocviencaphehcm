-- Tạo bảng instructor_shops cho trang Giảng Viên
CREATE TABLE IF NOT EXISTS instructor_shops (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_key text NOT NULL CHECK (instructor_key IN ('liem', 'an')),
  name          text NOT NULL,
  map_url       text NOT NULL,
  display_order int  NOT NULL DEFAULT 0,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

-- Public read (không cần đăng nhập để xem)
ALTER TABLE instructor_shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read instructor_shops"
  ON instructor_shops FOR SELECT USING (true);
CREATE POLICY "Admin full instructor_shops"
  ON instructor_shops FOR ALL
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- Drop bảng đánh giá cũ (nếu không còn dùng)
-- DROP TABLE IF EXISTS instructor_reviews;
