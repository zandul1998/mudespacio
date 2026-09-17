CREATE TABLE IF NOT EXISTS student_payments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'monthly',
  status TEXT NOT NULL DEFAULT 'pending',
  period TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER NOT NULL DEFAULT 0,
  paid_at TEXT NOT NULL DEFAULT '',
  method TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS workshop_expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'other',
  description TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  expense_date TEXT NOT NULL,
  period TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS work_logs (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  work_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  hours REAL NOT NULL DEFAULT 0,
  hourly_rate INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS staff_payments (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'other',
  status TEXT NOT NULL DEFAULT 'pending',
  period TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  paid_at TEXT NOT NULL DEFAULT '',
  method TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
