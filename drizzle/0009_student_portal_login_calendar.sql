ALTER TABLE students ADD COLUMN password_hash TEXT NOT NULL DEFAULT '';
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS student_portal_sessions (
  token TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS student_portal_sessions_student_idx ON student_portal_sessions(student_id);
