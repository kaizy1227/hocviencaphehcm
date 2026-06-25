-- Chạy trong Supabase SQL Editor
-- Tạo bảng profiles để lưu thông tin khách hàng đã đăng nhập

CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text,
  phone text,
  address text,
  email text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- User chỉ xem/sửa được profile của chính mình
CREATE POLICY "Users manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
