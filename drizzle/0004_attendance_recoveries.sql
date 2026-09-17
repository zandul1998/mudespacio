CREATE TABLE IF NOT EXISTS class_sessions (
  id TEXT PRIMARY KEY,
  schedule_id TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  status TEXT NOT NULL,
  notice_at TEXT NOT NULL DEFAULT '',
  credit_id TEXT,
  recovery_credit_used_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS attendance_session_student_idx ON attendance_records(session_id, student_id);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS recovery_credits (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  source_attendance_id TEXT,
  used_attendance_id TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  expires_at TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'interested',
  source TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
