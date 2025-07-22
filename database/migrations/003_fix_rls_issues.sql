-- Create error_logs table first
CREATE TABLE IF NOT EXISTS error_logs (
  id SERIAL PRIMARY KEY,
  function_name VARCHAR NOT NULL,
  error_type VARCHAR NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  context_data JSONB,
  severity VARCHAR NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_agent TEXT,
  ip_address INET,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on error_logs
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can access error logs
CREATE POLICY admin_error_logs ON error_logs
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

-- Create error_alerts table that references error_logs
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

-- Policy for users to view their own expenses
CREATE POLICY view_own_expenses ON expenses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to create draft expenses
CREATE POLICY create_draft_expenses ON expenses
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'draft'
  );

-- Policy for users to update their own draft expenses
CREATE POLICY update_own_draft_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status = 'draft'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'draft'
  );

-- Policy for users to submit their own draft expenses
CREATE POLICY submit_draft_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status = 'draft'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'submitted'
  );

-- Policy for approvers to view assigned expenses
CREATE POLICY view_assigned_expenses ON expenses
  FOR SELECT
  USING (auth.uid() = approver_id);

-- Policy for approvers to approve/reject submitted expenses
CREATE POLICY approve_reject_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = approver_id
    AND status = 'submitted'
  )
  WITH CHECK (
    auth.uid() = approver_id
    AND status IN ('approved', 'rejected')
  ); 