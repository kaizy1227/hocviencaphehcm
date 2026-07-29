-- Thêm cột logo_url và location vào bảng instructor_shops
ALTER TABLE instructor_shops
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS location text;
