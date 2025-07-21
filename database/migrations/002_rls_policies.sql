-- Row Level Security Policies for ExpenseFlow
-- This file contains all the RLS policies for secure access to expense data

-- Enable RLS on all expense tables
ALTER TABLE expense_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_accommodation_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE requisition_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_audit_logs ENABLE ROW LEVEL SECURITY;

-- Expense Users Policies
-- Users can view their own profile and their team members (if manager)
CREATE POLICY "Users can view own profile"
ON expense_users FOR SELECT
USING (auth.uid()::text = id::text);

CREATE POLICY "Managers can view team members"
ON expense_users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_users
    WHERE id::text = auth.uid()::text
    AND role IN ('manager', 'finance', 'admin')
  )
);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
ON expense_users FOR UPDATE
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Only admins can insert/delete users
CREATE POLICY "Admins can manage users"
ON expense_users FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM expense_users
    WHERE id::text = auth.uid()::text
    AND role = 'admin'
  )
);

-- User Vehicles Policies
CREATE POLICY "Users can manage own vehicles"
ON user_vehicles FOR ALL
USING (
  user_id::text = auth.uid()::text
);

-- Expense Submissions Policies
-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
ON expense_submissions FOR SELECT
USING (user_id::text = auth.uid()::text);

-- Managers can view team submissions
CREATE POLICY "Managers can view team submissions"
ON expense_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_users emp
    JOIN expense_users mgr ON emp.manager_id = mgr.id
    WHERE emp.id = expense_submissions.user_id
    AND mgr.id::text = auth.uid()::text
    AND mgr.role IN ('manager', 'finance', 'admin')
  )
);

-- Finance and Admin can view all submissions
CREATE POLICY "Finance can view all submissions"
ON expense_submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_users
    WHERE id::text = auth.uid()::text
    AND role IN ('finance', 'admin')
  )
);

-- Users can create and update their own submissions (when in draft)
CREATE POLICY "Users can manage own submissions"
ON expense_submissions FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own draft submissions"
ON expense_submissions FOR UPDATE
USING (
  user_id::text = auth.uid()::text
  AND status = 'draft'
)
WITH CHECK (
  user_id::text = auth.uid()::text
  AND status = 'draft'
);

-- Transportation Expenses Policies
CREATE POLICY "Users can manage own transportation expenses"
ON transportation_expenses FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions
    WHERE id = transportation_expenses.submission_id
    AND user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Managers can view team transportation expenses"
ON transportation_expenses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions es
    JOIN expense_users emp ON es.user_id = emp.id
    JOIN expense_users mgr ON emp.manager_id = mgr.id
    WHERE es.id = transportation_expenses.submission_id
    AND mgr.id::text = auth.uid()::text
    AND mgr.role IN ('manager', 'finance', 'admin')
  )
);

-- Food Accommodation Expenses Policies
CREATE POLICY "Users can manage own food accommodation expenses"
ON food_accommodation_expenses FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions
    WHERE id = food_accommodation_expenses.submission_id
    AND user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Managers can view team food accommodation expenses"
ON food_accommodation_expenses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions es
    JOIN expense_users emp ON es.user_id = emp.id
    JOIN expense_users mgr ON emp.manager_id = mgr.id
    WHERE es.id = food_accommodation_expenses.submission_id
    AND mgr.id::text = auth.uid()::text
    AND mgr.role IN ('manager', 'finance', 'admin')
  )
);

-- Maintenance Expenses Policies
CREATE POLICY "Users can manage own maintenance expenses"
ON maintenance_expenses FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions
    WHERE id = maintenance_expenses.submission_id
    AND user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Managers can view team maintenance expenses"
ON maintenance_expenses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions es
    JOIN expense_users emp ON es.user_id = emp.id
    JOIN expense_users mgr ON emp.manager_id = mgr.id
    WHERE es.id = maintenance_expenses.submission_id
    AND mgr.id::text = auth.uid()::text
    AND mgr.role IN ('manager', 'finance', 'admin')
  )
);

-- Maintenance Equipment Policies
CREATE POLICY "Users can manage own maintenance equipment"
ON maintenance_equipment FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM maintenance_expenses me
    JOIN expense_submissions es ON me.submission_id = es.id
    WHERE me.id = maintenance_equipment.maintenance_expense_id
    AND es.user_id::text = auth.uid()::text
  )
);

-- Requisition Expenses Policies
CREATE POLICY "Users can manage own requisition expenses"
ON requisition_expenses FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions
    WHERE id = requisition_expenses.submission_id
    AND user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Managers can view team requisition expenses"
ON requisition_expenses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions es
    JOIN expense_users emp ON es.user_id = emp.id
    JOIN expense_users mgr ON emp.manager_id = mgr.id
    WHERE es.id = requisition_expenses.submission_id
    AND mgr.id::text = auth.uid()::text
    AND mgr.role IN ('manager', 'finance', 'admin')
  )
);

-- Expense Attachments Policies
CREATE POLICY "Users can manage own expense attachments"
ON expense_attachments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions
    WHERE id = expense_attachments.submission_id
    AND user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Managers can view team expense attachments"
ON expense_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions es
    JOIN expense_users emp ON es.user_id = emp.id
    JOIN expense_users mgr ON emp.manager_id = mgr.id
    WHERE es.id = expense_attachments.submission_id
    AND mgr.id::text = auth.uid()::text
    AND mgr.role IN ('manager', 'finance', 'admin')
  )
);

-- Expense Approvals Policies
-- Users can view approvals for their own submissions
CREATE POLICY "Users can view own submission approvals"
ON expense_approvals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions
    WHERE id = expense_approvals.submission_id
    AND user_id::text = auth.uid()::text
  )
);

-- Approvers can view and manage approvals assigned to them
CREATE POLICY "Approvers can manage assigned approvals"
ON expense_approvals FOR ALL
USING (approver_id::text = auth.uid()::text);

-- Managers can view team approvals
CREATE POLICY "Managers can view team approvals"
ON expense_approvals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions es
    JOIN expense_users emp ON es.user_id = emp.id
    JOIN expense_users mgr ON emp.manager_id = mgr.id
    WHERE es.id = expense_approvals.submission_id
    AND mgr.id::text = auth.uid()::text
    AND mgr.role IN ('manager', 'finance', 'admin')
  )
);

-- Expense Validation Logs Policies
CREATE POLICY "Users can view own validation logs"
ON expense_validation_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_submissions
    WHERE id = expense_validation_logs.submission_id
    AND user_id::text = auth.uid()::text
  )
);

CREATE POLICY "System can create validation logs"
ON expense_validation_logs FOR INSERT
WITH CHECK (true); -- This will be used by system functions

-- Expense Audit Logs Policies
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON expense_audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM expense_users
    WHERE id::text = auth.uid()::text
    AND role = 'admin'
  )
);

-- System can create audit logs
CREATE POLICY "System can create audit logs"
ON expense_audit_logs FOR INSERT
WITH CHECK (true); -- This will be used by triggers

-- Create a function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role::text
    FROM expense_users
    WHERE id::text = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user can approve expenses
CREATE OR REPLACE FUNCTION can_approve_expense(submission_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  submitter_manager_id UUID;
BEGIN
  -- Get current user's role
  SELECT role INTO user_role
  FROM expense_users
  WHERE id::text = auth.uid()::text;
  
  -- Get the submission's user's manager
  SELECT eu.manager_id INTO submitter_manager_id
  FROM expense_submissions es
  JOIN expense_users eu ON es.user_id = eu.id
  WHERE es.id = submission_id;
  
  -- Check if user can approve
  RETURN (
    user_role IN ('finance', 'admin') OR
    (user_role = 'manager' AND submitter_manager_id::text = auth.uid()::text)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 