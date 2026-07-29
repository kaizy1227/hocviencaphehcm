-- Thêm cột sỉ số cho bảng lớp học (chạy trong Supabase SQL Editor)
ALTER TABLE lop_hoc ADD COLUMN IF NOT EXISTS si_so text;
