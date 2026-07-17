-- ============================================================
-- ROLLBACK: Xóa toàn bộ tính năng tính cost
-- Chạy file này để hoàn tác external_ingredients_create.sql
-- và recipe_ingredient_items_create.sql
-- ============================================================

-- 1. Xóa bảng nối (phải xóa trước vì có FK)
DROP TABLE IF EXISTS recipe_ingredient_items CASCADE;

-- 2. Xóa bảng nguyên liệu ngoài
DROP TABLE IF EXISTS external_ingredients CASCADE;

-- 3. Xóa cột cost_per_unit khỏi products
ALTER TABLE products
  DROP COLUMN IF EXISTS cost_per_unit;
