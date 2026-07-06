-- Thêm cột category vào bảng videos
-- Chạy trong Supabase SQL Editor
-- Các video hiện có sẽ tự động được gán category = 'series-100-ngay'

ALTER TABLE videos
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'series-100-ngay';
