-- Migration: Simplify Database Architecture
-- Consolidates 15+ tables into 5 tables for better performance and maintainability
-- Date: 2025-01-22

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing complex tables (will be recreated with simplified structure)
DROP TABLE IF EXISTS expense_submissions CASCADE;
DROP TABLE IF EXISTS transportation_expenses CASCADE;
DROP TABLE IF EXISTS maintenance_expenses CASCADE;
DROP TABLE IF EXISTS requisition_expenses CASCADE;
DROP TABLE IF EXISTS food_accommodation_expenses CASCADE;
DROP TABLE IF EXISTS maintenance_equipment CASCADE;
DROP TABLE IF EXISTS expense_attachments CASCADE;
DROP TABLE IF EXISTS expense_approvals CASCADE;
DROP TABLE IF EXISTS expense_validation_logs CASCADE;
DROP TABLE IF EXISTS expense_audit_logs CASCADE;
DROP TABLE IF EXISTS error_logs CASCADE;
DROP TABLE IF EXISTS error_alerts CASCADE;
DROP TABLE IF EXISTS user_vehicles CASCADE;

-- Table 1: expenses (replaces 8 tables)
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  expense_number text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('travel', 'maintenance', 'requisition')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  title text NOT NULL,
  description text NOT NULL CHECK (length(description) >= 50),
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  currency text NOT NULL DEFAULT 'BDT',
  
  -- Type-specific data stored as JSON (this replaces separate tables)
  expense_data jsonb NOT NULL DEFAULT '{}',
  
  submitted_at timestamptz,
  approved_at timestamptz,
  approver_id uuid REFERENCES profiles(id),
  approval_notes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table 2: attachments (replaces expense_attachments)
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id uuid NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_size integer NOT NULL,
  content_type text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Table 3: approvals (simplified workflow)
CREATE TABLE IF NOT EXISTS approvals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id uuid NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  approver_id uuid NOT NULL REFERENCES profiles(id),
  action text NOT NULL CHECK (action IN ('approved', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Update profiles table (simplified structure)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'manager', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS approval_limit numeric DEFAULT 10000;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_budget numeric DEFAULT 50000;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Performance indexes
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_status_idx ON expenses(status);
CREATE INDEX IF NOT EXISTS expenses_type_idx ON expenses(type);
CREATE INDEX IF NOT EXISTS expenses_created_at_idx ON expenses(created_at);
CREATE INDEX IF NOT EXISTS expenses_submitted_at_idx ON expenses(submitted_at);

-- JSON indexes will be created in a separate migration

-- Attachment indexes
CREATE INDEX IF NOT EXISTS attachments_expense_id_idx ON attachments(expense_id);

-- Approval indexes
CREATE INDEX IF NOT EXISTS approvals_expense_id_idx ON approvals(expense_id);
CREATE INDEX IF NOT EXISTS approvals_approver_id_idx ON approvals(approver_id);

-- Profile indexes
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_department_idx ON profiles(department);
CREATE INDEX IF NOT EXISTS profiles_manager_id_idx ON profiles(manager_id);

-- Row Level Security (RLS) policies
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update own draft expenses" ON expenses;
DROP POLICY IF EXISTS "Managers can view team expenses" ON expenses;
DROP POLICY IF EXISTS "Admins can view all expenses" ON expenses;

-- Users can only see their own expenses
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own expenses
CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own expenses (if not submitted)
CREATE POLICY "Users can update own draft expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');

-- Managers can view expenses from their team
CREATE POLICY "Managers can view team expenses" ON expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'manager'
      AND expenses.user_id IN (
        SELECT id FROM profiles WHERE manager_id = auth.uid()
      )
    )
  );

-- Admins can view all expenses
CREATE POLICY "Admins can view all expenses" ON expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Drop existing attachment and approval policies if they exist
DROP POLICY IF EXISTS "Users can view own attachments" ON attachments;
DROP POLICY IF EXISTS "Users can upload own attachments" ON attachments;
DROP POLICY IF EXISTS "Users can view own approvals" ON approvals;
DROP POLICY IF EXISTS "Managers can create approvals" ON approvals;

-- Attachment policies
CREATE POLICY "Users can view own attachments" ON attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE expenses.id = attachments.expense_id 
      AND expenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload own attachments" ON attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE expenses.id = attachments.expense_id 
      AND expenses.user_id = auth.uid()
    )
  );

-- Approval policies
CREATE POLICY "Users can view own approvals" ON approvals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM expenses 
      WHERE expenses.id = approvals.expense_id 
      AND expenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can create approvals" ON approvals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('manager', 'admin')
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Triggers for updated_at
CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate expense numbers
CREATE OR REPLACE FUNCTION generate_expense_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expense_number := 'EXP-' || to_char(now(), 'YYYYMMDD') || '-' || 
                       lpad(nextval('expense_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for expense numbers
CREATE SEQUENCE IF NOT EXISTS expense_number_seq START 1;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS generate_expense_number_trigger ON expenses;

-- Trigger to auto-generate expense numbers
CREATE TRIGGER generate_expense_number_trigger
  BEFORE INSERT ON expenses
  FOR EACH ROW EXECUTE FUNCTION generate_expense_number();

-- Grant permissions
GRANT ALL ON expenses TO authenticated;
GRANT ALL ON attachments TO authenticated;
GRANT ALL ON approvals TO authenticated;
GRANT USAGE ON SEQUENCE expense_number_seq TO authenticated; 