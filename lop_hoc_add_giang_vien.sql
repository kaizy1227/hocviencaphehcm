-- Thêm cột giảng viên vào bảng lop_hoc
ALTER TABLE lop_hoc ADD COLUMN IF NOT EXISTS giang_vien text;
