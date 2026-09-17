CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'teacher',
  status TEXT NOT NULL DEFAULT 'active',
  pay_mode TEXT NOT NULL DEFAULT 'percentage',
  hourly_rate INTEGER,
  monthly_amount INTEGER,
  percentage INTEGER,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  family_group TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS student_schedules (
  student_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (student_id, schedule_id)
);
--> statement-breakpoint
ALTER TABLE schedules ADD COLUMN teacher_id TEXT;
