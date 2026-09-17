ALTER TABLE schedules ADD COLUMN capacity INTEGER NOT NULL DEFAULT 8;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS closure_days (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS recovery_bookings (
  id TEXT PRIMARY KEY,
  credit_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS recovery_booking_credit_active_idx ON recovery_bookings(credit_id) WHERE status!='cancelled';
