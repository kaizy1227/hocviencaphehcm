-- ============================================================
-- khach_hang_stats: số liệu khóa học / dịch vụ đã chốt (từ Lark)
-- Bảng 1 dòng (id=1). Cron sáng ghi đè; admin dashboard đọc.
-- Chạy 1 lần trong Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS khach_hang_stats (
  id                  int PRIMARY KEY DEFAULT 1,
  khoa_chot_total     int NOT NULL DEFAULT 0,
  khoa_chot_month     int NOT NULL DEFAULT 0,
  dich_vu_chot_total  int NOT NULL DEFAULT 0,
  dich_vu_chot_month  int NOT NULL DEFAULT 0,
  dich_vu_breakdown   jsonb NOT NULL DEFAULT '{}',
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO khach_hang_stats (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE khach_hang_stats ENABLE ROW LEVEL SECURITY;

-- Admin đọc số liệu
DROP POLICY IF EXISTS "Admin read kh_stats" ON khach_hang_stats;
CREATE POLICY "Admin read kh_stats"
  ON khach_hang_stats FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Ghi: chỉ service_role (cron/API) — service_role bỏ qua RLS nên không cần policy insert/update.
