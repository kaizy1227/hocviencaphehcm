-- ============================================================
-- PHÂN QUYỀN NHÂN VIÊN (role = 'staff')
-- Staff được sửa: Nguyên Liệu (products), Dụng Cụ (dung_cu),
--   Công Thức (cong_thuc + recipe_ingredient_items), Nguyên Liệu Ngoài (external_ingredients).
-- KHÔNG đụng tới: học viên, đơn hàng, khóa học, video, traffic... (vẫn admin-only).
-- Policy dạng bổ sung (permissive OR) — không phá policy admin sẵn có.
-- ============================================================

-- products (Nguyên Liệu)
DROP POLICY IF EXISTS "staff_all_products" ON products;
CREATE POLICY "staff_all_products" ON products
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'));

-- dung_cu (Dụng Cụ)
DROP POLICY IF EXISTS "staff_all_dung_cu" ON dung_cu;
CREATE POLICY "staff_all_dung_cu" ON dung_cu
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'));

-- cong_thuc (Công Thức)
DROP POLICY IF EXISTS "staff_all_cong_thuc" ON cong_thuc;
CREATE POLICY "staff_all_cong_thuc" ON cong_thuc
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'));

-- external_ingredients (Nguyên Liệu Ngoài)
DROP POLICY IF EXISTS "staff_all_external_ingredients" ON external_ingredients;
CREATE POLICY "staff_all_external_ingredients" ON external_ingredients
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'));

-- recipe_ingredient_items (định lượng công thức)
DROP POLICY IF EXISTS "staff_all_recipe_ingredient_items" ON recipe_ingredient_items;
CREATE POLICY "staff_all_recipe_ingredient_items" ON recipe_ingredient_items
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'))
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin','staff'));

-- ============================================================
-- CẤP QUYỀN STAFF CHO 1 TÀI KHOẢN
-- ============================================================
-- B1: Tạo tài khoản nhân viên trong Supabase Dashboard:
--     Authentication → Add user → email = {sđt}@hocviencaphehcm.vn (vd 0912345678@hocviencaphehcm.vn)
--     + mật khẩu, tick "Auto Confirm User".
-- B2: Chạy lệnh dưới (thay đúng email) để gán role staff:

-- UPDATE auth.users
-- SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"staff"}'::jsonb
-- WHERE email = '0912345678@hocviencaphehcm.vn';

-- Nhân viên đăng nhập tại /login bằng SĐT + mật khẩu, chỉ thấy nhóm
-- "Công thức & giá vốn" + "Dụng Cụ".

-- Gỡ quyền staff (nếu cần):
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data - 'role'
-- WHERE email = '0912345678@hocviencaphehcm.vn';
