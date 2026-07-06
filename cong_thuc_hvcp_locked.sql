-- Thêm cột locked vào bảng cong_thuc_hvcp
ALTER TABLE cong_thuc_hvcp
  ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false;
