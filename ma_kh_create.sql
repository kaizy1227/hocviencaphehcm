-- Thêm cột ma_kh vào bảng students
ALTER TABLE students ADD COLUMN IF NOT EXISTS ma_kh TEXT UNIQUE;

-- Tạo sequence để tự động đánh số
CREATE SEQUENCE IF NOT EXISTS ma_kh_seq START 1;

-- Trigger tự set ma_kh khi insert học viên mới
CREATE OR REPLACE FUNCTION set_ma_kh()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ma_kh IS NULL THEN
    NEW.ma_kh := 'HVCP' || LPAD(nextval('ma_kh_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_ma_kh ON students;
CREATE TRIGGER trg_set_ma_kh
  BEFORE INSERT ON students
  FOR EACH ROW EXECUTE FUNCTION set_ma_kh();

-- Backfill học viên hiện có (theo thứ tự created_at)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM students WHERE ma_kh IS NULL ORDER BY created_at LOOP
    UPDATE students
    SET ma_kh = 'HVCP' || LPAD(nextval('ma_kh_seq')::text, 4, '0')
    WHERE id = r.id;
  END LOOP;
END $$;
