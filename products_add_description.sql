-- Thêm cột "Mô tả / Hướng dẫn sử dụng" cho bảng products
alter table products add column if not exists description text;
