-- ============================================================
-- external_ingredients: Nguyên liệu ngoài (không phải hàng HVCP)
-- Rollback: xem rollback_cost_feature.sql
-- ============================================================
CREATE TABLE IF NOT EXISTS external_ingredients (
  id            uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text    NOT NULL,
  quantity_per_pack numeric NOT NULL,
  price_per_pack    numeric NOT NULL,
  -- cost_per_unit tính CHÍNH XÁC từ giá / quy cách (không làm tròn)
  cost_per_unit numeric GENERATED ALWAYS AS (price_per_pack / NULLIF(quantity_per_pack, 0)) STORED,
  unit          text    NOT NULL DEFAULT 'g',
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE external_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ext_ing"
  ON external_ingredients FOR SELECT USING (true);

CREATE POLICY "Admin all ext_ing"
  ON external_ingredients
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================
-- 48 nguyên liệu ngoài từ file Excel
-- cost_per_unit tự động = price_per_pack / quantity_per_pack (generated)
-- ============================================================
INSERT INTO external_ingredients (name, quantity_per_pack, price_per_pack, unit) VALUES
  ('Sầu Riêng Tươi',               1000, 100000, 'g'),
  ('Chanh thơm',                    1000,  90000, 'g'),
  ('Cà chua bi',                    1000,  80000, 'g'),
  ('Xoài Tươi',                     1000,  50000, 'g'),
  ('Tép Bưởi Tươi',                 1000,  40000, 'g'),
  ('Cam vàng',                      1000,  50000, 'g'),
  ('Dưa hấu',                       1000,  15000, 'g'),
  ('Yakult',                         700,  45000, 'ml'),
  ('Sả Tươi',                       1000,  35000, 'g'),
  ('Nước lọc',                      1000,   1000, 'ml'),
  ('Chanh vàng',                    1000,  65000, 'g'),
  ('Nước cốt tắc',                  1000,  90000, 'ml'),
  ('Nước nóng',                     1000,   1000, 'ml'),
  ('Soda',                           320,  20000, 'ml'),
  ('Táo Tươi',                      1000,  50000, 'g'),
  ('Nước Ép Táo',                   1000,  90000, 'ml'),
  ('Cốt cafe',                         1,    255, 'ml'),
  ('Cozy Dâu',                        16,  36000, 'gói'),
  ('Nước cam',                         1,     10, 'ml'),
  ('Đường',                            1,     35, 'g'),
  ('Bạc hà',                         100,   8000, 'g'),
  ('Chanh vàng (lát)',                  1,    800, 'lát'),
  ('Cam vàng (lát)',                    1,   1000, 'lát'),
  ('Dâu tây',                       1000,  95000, 'g'),
  ('Chanh leo',                     1000,  70000, 'g'),
  ('Sữa chua không đường',             1,   7000, 'hộp'),
  ('Húng quế',                       100,   7000, 'g'),
  ('Trái tắc',                         1,   1350, 'cái'),
  ('Kem dừa',                       1000, 120000, 'ml'),
  ('Trân châu đường đen',             300,  28900, 'g'),
  ('Mãng cầu',                      1000,  70000, 'g'),
  ('Bơ tươi',                       1000,  65000, 'g'),
  ('Kem trứng',                      300,  26000, 'g'),
  ('Muối',                          1000,  12000, 'g'),
  ('Kem muối',                       350,  35000, 'g'),
  ('Cốt trà sữa shan tuyết',        1000,  27000, 'ml'),
  ('Mứt lá dứa',                    1000, 130000, 'g'),
  ('Gừng tươi',                     1000,  30000, 'g'),
  ('Phô mai con bò cười',              8,  37000, 'cái'),
  ('Sữa béo',                        480,  24900, 'ml'),
  ('OLong Nitro Tea',                800,  25680, 'ml'),
  ('Shan Tuyết Nitro Tea',           850,  16155, 'ml'),
  ('Kem xịt',                        400,  33276, 'ml'),
  ('Bánh Oreo vị nguyên bản',          1,   1500, 'cái'),
  ('Bánh cốm',                         1,   8000, 'cái'),
  ('Cốt sả',                          50,    760, 'ml'),
  ('Kombucha Soda',                16000, 309500, 'ml'),
  ('Đá viên',                      10000,  25000, 'g')
ON CONFLICT DO NOTHING;
