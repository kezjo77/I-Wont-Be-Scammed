/*
# Create scam_checks table (single-tenant, no auth)

1. New Tables
- `scam_checks`
  - `id` (uuid, primary key)
  - `input_text` (text, the message the user submitted for checking)
  - `risk_level` (text, one of 'high' | 'suspicious' | 'safe')
  - `title` (text, short result title)
  - `summary` (text, plain-language summary of the result)
  - `advice` (jsonb, array of advice strings)
  - `signals` (jsonb, array of detected warning-sign labels)
  - `created_at` (timestamptz, defaults to now)

2. Security
- Enable RLS on `scam_checks`.
- This is a single-tenant app with no sign-in screen, so the anon-key
  frontend must be able to read and write. Policies allow anon +
  authenticated full CRUD because the data is intentionally shared/public
  (a demo tool with no user accounts).
*/

CREATE TABLE IF NOT EXISTS scam_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text text NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('high', 'suspicious', 'safe')),
  title text NOT NULL,
  summary text NOT NULL,
  advice jsonb NOT NULL DEFAULT '[]'::jsonb,
  signals jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scam_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scam_checks" ON scam_checks;
CREATE POLICY "anon_select_scam_checks" ON scam_checks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scam_checks" ON scam_checks;
CREATE POLICY "anon_insert_scam_checks" ON scam_checks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scam_checks" ON scam_checks;
CREATE POLICY "anon_update_scam_checks" ON scam_checks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scam_checks" ON scam_checks;
CREATE POLICY "anon_delete_scam_checks" ON scam_checks FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS scam_checks_created_at_idx ON scam_checks (created_at DESC);
