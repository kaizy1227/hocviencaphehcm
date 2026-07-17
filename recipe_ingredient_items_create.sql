-- ============================================================
-- recipe_ingredient_items: Định lượng nguyên liệu trong công thức
-- Rollback: xem rollback_cost_feature.sql
-- Phụ thuộc: external_ingredients_create.sql phải chạy trước
-- ============================================================

-- Thêm cost_per_unit vào products (nguyên liệu nội bộ HVCP)
-- OPTIONAL OVERRIDE: mặc định giá/đơn vị tự tính = giá bán / quy cách (parse trong UI).
-- Chỉ điền cột này khi cần ghi đè (vd trà cần đơn giá pha thay vì giá lá thô).
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS cost_per_unit numeric;

-- Bảng nối công thức <-> nguyên liệu (có định lượng + snapshot giá)
CREATE TABLE IF NOT EXISTS recipe_ingredient_items (
  id             uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id      uuid    NOT NULL REFERENCES cong_thuc(id) ON DELETE CASCADE,
  source         text    NOT NULL CHECK (source IN ('internal', 'external')),
  ingredient_id  uuid    NOT NULL,
  name           text    NOT NULL,
  quantity       numeric NOT NULL DEFAULT 1,
  unit           text    NOT NULL DEFAULT 'g',
  cost_per_unit  numeric NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recipe_ingredient_items_recipe_idx
  ON recipe_ingredient_items (recipe_id);

ALTER TABLE recipe_ingredient_items ENABLE ROW LEVEL SECURITY;

-- Học viên đã đăng nhập đọc được (cùng level với cong_thuc)
CREATE POLICY "Auth read recipe_ing"
  ON recipe_ingredient_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin toàn quyền
CREATE POLICY "Admin all recipe_ing"
  ON recipe_ingredient_items
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
