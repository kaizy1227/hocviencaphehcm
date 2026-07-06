CREATE TABLE IF NOT EXISTS push_tokens (
  user_id   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  token     TEXT NOT NULL,
  platform  TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own token" ON push_tokens
  FOR ALL USING (auth.uid() = user_id);
