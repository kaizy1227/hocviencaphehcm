-- Thêm cột locked vào bảng cong_thuc_chia_se
ALTER TABLE cong_thuc_chia_se
  ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false;
