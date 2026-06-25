-- Chạy trong Supabase SQL Editor
-- Cho phép user đã đăng nhập xem đơn hàng của chính họ

CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
