-- ============================================================
-- Public read cho trang /cong-thuc (máy tính cost công khai)
-- Cho phép KHÁCH CHƯA ĐĂNG NHẬP đọc công thức mẫu HVCP + breakdown.
-- An toàn: chỉ SELECT, không cho ghi. Giá vốn không phải dữ liệu nhạy cảm.
-- Chạy 1 lần trong Supabase SQL Editor.
-- ============================================================

-- Công thức mẫu (17 món có tổng cost)
DROP POLICY IF EXISTS "Public read cong_thuc" ON cong_thuc;
CREATE POLICY "Public read cong_thuc"
  ON cong_thuc FOR SELECT USING (true);

-- Định lượng nguyên liệu từng công thức (breakdown chi tiết)
DROP POLICY IF EXISTS "Public read recipe_ing" ON recipe_ingredient_items;
CREATE POLICY "Public read recipe_ing"
  ON recipe_ingredient_items FOR SELECT USING (true);

-- Lưu ý: products + external_ingredients đã có "Public read" từ trước.
