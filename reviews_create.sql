CREATE TABLE IF NOT EXISTS reviews (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id    TEXT NOT NULL,
  product_table TEXT NOT NULL DEFAULT 'products', -- 'products' hoặc 'dung_cu'
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  reviewer_name TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Ai cũng đọc được
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- Chỉ user đã đăng nhập mới ghi, mỗi user 1 review/sản phẩm
CREATE POLICY "Auth users insert reviews" ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Auth users update own review" ON reviews FOR UPDATE
  USING (auth.uid() = user_id);
