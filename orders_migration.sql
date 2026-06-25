-- Chạy file này trong Supabase SQL Editor

CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text,
  notes text,
  items jsonb NOT NULL DEFAULT '[]',
  total int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Bất kỳ ai cũng có thể tạo đơn hàng (không cần đăng nhập)
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Chỉ admin xem / sửa / xóa
CREATE POLICY "Admin select orders" ON orders
  FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin update orders" ON orders
  FOR UPDATE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin delete orders" ON orders
  FOR DELETE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
