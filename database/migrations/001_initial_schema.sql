-- Create initial schema for ExpenseFlow
-- Dependencies: Supabase auth schema
-- Used by: All expense-related operations

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  manager_id UUID REFERENCES profiles(id),
  expense_limit DECIMAL(10,2),
  CONSTRAINT valid_role CHECK (role IN ('user', 'manager', 'admin'))
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  submitted_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  approver_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  description TEXT NOT NULL,
  attachments JSONB[] DEFAULT ARRAY[]::JSONB[],
  comments JSONB[] DEFAULT ARRAY[]::JSONB[],
  -- Travel specific fields
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  start_location JSONB,
  end_location JSONB,
  transportation_type TEXT,
  mileage DECIMAL(10,2),
  fuel_cost DECIMAL(10,2),
  toll_charges DECIMAL(10,2),
  accommodation_cost DECIMAL(10,2),
  per_diem_rate DECIMAL(10,2),
  -- Maintenance specific fields
  service_date TIMESTAMP WITH TIME ZONE,
  category TEXT,
  asset_id TEXT,
  vendor_name TEXT,
  invoice_number TEXT,
  warranty_applicable BOOLEAN,
  -- Requisition specific fields
  required_by TIMESTAMP WITH TIME ZONE,
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  preferred_vendor TEXT,
  urgency_level TEXT,
  CONSTRAINT valid_type CHECK (type IN ('travel', 'maintenance', 'requisition')),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'reimbursed'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_approver_id_idx ON expenses(approver_id);
CREATE INDEX IF NOT EXISTS expenses_status_idx ON expenses(status);
CREATE INDEX IF NOT EXISTS expenses_type_idx ON expenses(type);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_manager_id_idx ON profiles(manager_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 