-- =================================================================
-- CLEAN PROFILES TABLE POLICY
-- Simple, clear RLS policies for user profiles
-- =================================================================

-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Managers can view team profiles" ON profiles;
DROP POLICY IF EXISTS "open insert" ON profiles;
DROP POLICY IF EXISTS "create_profile_admin" ON profiles;
DROP POLICY IF EXISTS "read_all_profiles" ON profiles;
DROP POLICY IF EXISTS "update_own_profile" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary privileges
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- =================================================================
-- SIMPLIFIED RLS POLICIES
-- =================================================================

-- 1. Basic profile access - users can manage their own profile
CREATE POLICY "manage_own_profile" ON profiles
    USING (auth.uid() = id)  -- For SELECT operations
    WITH CHECK (auth.uid() = id);  -- For INSERT/UPDATE operations

-- 2. Admin access - admins can view all profiles
CREATE POLICY "admin_read_all" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Manager access - managers can view their team's profiles
CREATE POLICY "manager_read_team" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
        AND manager_id = auth.uid()
    );

-- =================================================================
-- VERIFY POLICIES
-- =================================================================

-- List all policies on the profiles table
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Test queries (run these as different users to verify):
/*
-- As regular user:
SELECT * FROM profiles WHERE id = auth.uid();  -- Should work
SELECT * FROM profiles WHERE id != auth.uid();  -- Should fail

-- As admin:
SELECT * FROM profiles;  -- Should work

-- As manager:
SELECT * FROM profiles WHERE manager_id = auth.uid();  -- Should work
SELECT * FROM profiles WHERE manager_id != auth.uid();  -- Should fail
*/ 