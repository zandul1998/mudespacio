CREATE TABLE IF NOT EXISTS portal_absence_requests (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  class_date TEXT NOT NULL,
  schedule_hint TEXT NOT NULL DEFAULT '',
  notice_at TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
