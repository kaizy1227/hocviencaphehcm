-- Bảng đánh giá giảng viên
CREATE TABLE IF NOT EXISTS instructor_reviews (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instructor_name text NOT NULL,
  rating          smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text     text,
  display_name    text NOT NULL DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, instructor_name)
);

ALTER TABLE instructor_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reviews"
  ON instructor_reviews FOR SELECT USING (true);

CREATE POLICY "Auth users insert review"
  ON instructor_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Auth users update own review"
  ON instructor_reviews FOR UPDATE
  USING (auth.uid() = user_id);
