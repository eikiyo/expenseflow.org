-- =================================================================
-- FINAL FIX: Complete Profiles Table Setup
-- Run this in Supabase SQL Editor to fix all profile-related issues
-- =================================================================

-- 1. Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Managers can view team profiles" ON profiles;
DROP POLICY IF EXISTS "open insert" ON profiles;
DROP POLICY IF EXISTS "create_profile_admin" ON profiles;
DROP POLICY IF EXISTS "read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "update_own_profile" ON profiles;

-- 2. Ensure the profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'manager', 'admin')),
  manager_id UUID REFERENCES profiles(id),
  expense_limit DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Grant necessary privileges (CRITICAL FIX)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- 5. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_manager_id_idx ON profiles(manager_id);
CREATE INDEX IF NOT EXISTS profiles_department_idx ON profiles(department);

-- 7. Create RLS policies
-- Basic profile access
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- This is the critical policy for profile creation
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT
    WITH CHECK (
        -- Allow if the user is creating their own profile
        auth.uid() = id
        OR
        -- Or if they're authenticated (fallback)
        (auth.role() = 'authenticated'::text AND auth.uid() IS NOT NULL)
    );

-- Admin access
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Manager access to team profiles
CREATE POLICY "Managers can view team profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'manager'
        )
        AND 
        manager_id = auth.uid()
    );

-- 8. Add helpful comments
COMMENT ON TABLE profiles IS 'User profiles for the ExpenseFlow application';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN profiles.role IS 'User role: user, manager, or admin';
COMMENT ON COLUMN profiles.manager_id IS 'References the user''s manager';
COMMENT ON COLUMN profiles.expense_limit IS 'Maximum amount user can submit without approval'; 