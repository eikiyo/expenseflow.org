-- Create error_alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS error_alerts (
  id SERIAL PRIMARY KEY,
  error_log_id INTEGER REFERENCES error_logs(id),
  alert_type VARCHAR NOT NULL,
  alert_status VARCHAR NOT NULL DEFAULT 'pending',
  alert_data JSONB,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on error_alerts table
ALTER TABLE error_alerts ENABLE ROW LEVEL SECURITY;

-- Only admins can access error alerts
CREATE POLICY admin_error_alerts ON error_alerts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Update existing policies to handle status changes correctly
DROP POLICY IF EXISTS submit_own_draft_expenses ON expenses;
CREATE POLICY submit_own_draft_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status = 'draft'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND (
      (status = 'draft') OR
      (status = 'submitted' AND OLD.status = 'draft')
    )
  );

DROP POLICY IF EXISTS approve_assigned_expenses ON expenses;
CREATE POLICY approve_assigned_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = approver_id
    AND status = 'submitted'
  )
  WITH CHECK (
    auth.uid() = approver_id
    AND (
      (status = 'submitted') OR
      (status IN ('approved', 'rejected') AND OLD.status = 'submitted')
    )
  ); 