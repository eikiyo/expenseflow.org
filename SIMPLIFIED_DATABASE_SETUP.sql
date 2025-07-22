-- =================================================================
-- SIMPLIFIED DATABASE SETUP FOR EXPENSEFLOW
-- Clean, simple database structure with basic RLS policies
-- =================================================================

-- Create profiles table with essential fields only
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'manager', 'admin')),
  manager_id UUID REFERENCES profiles(id),
  expense_limit DECIMAL(10,2) DEFAULT 10000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create expenses table for all expense types
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('travel', 'maintenance', 'requisition')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'reimbursed')),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BDT',
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Travel specific fields
  start_date DATE,
  end_date DATE,
  start_location JSONB,
  end_location JSONB,
  transportation_type TEXT,
  
  -- Maintenance specific fields
  service_date DATE,
  category TEXT,
  vendor_name TEXT,
  
  -- Requisition specific fields
  required_by DATE,
  quantity INTEGER,
  unit_price DECIMAL(10,2)
);

-- =================================================================
-- ROW LEVEL SECURITY POLICIES
-- =================================================================

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON profiles TO postgres, service_role;
GRANT ALL ON expenses TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO authenticated;

-- Basic profile policies
CREATE POLICY "Users can manage their own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Managers can view team profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() 
            AND role IN ('manager', 'admin')
        )
    );

-- Basic expense policies
CREATE POLICY "Users can manage their own expenses" ON expenses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Managers can view team expenses" ON expenses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p1
            JOIN profiles p2 ON p2.manager_id = p1.id
            WHERE p1.id = auth.uid() 
            AND p2.id = expenses.user_id
            AND p1.role IN ('manager', 'admin')
        )
    );

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_manager_id ON profiles(manager_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

-- =================================================================
-- VERIFY SETUP
-- =================================================================

-- List all policies
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname; 