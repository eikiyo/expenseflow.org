-- First, enable RLS if not already enabled
ALTER TABLE expense_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can insert own profile" ON expense_users;
DROP POLICY IF EXISTS "Users can view own profile" ON expense_users;
DROP POLICY IF EXISTS "Users can update own profile" ON expense_users;

-- Create a policy that allows authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON expense_users FOR INSERT
WITH CHECK (
    -- Allow insert if the user is authenticated and the id matches
    auth.uid()::text = id::text
    -- Also allow if no profile exists yet for this user
    AND NOT EXISTS (
        SELECT 1 FROM expense_users
        WHERE id::text = auth.uid()::text
    )
);

-- Create a policy that allows users to view their own profile
CREATE POLICY "Users can view own profile"
ON expense_users FOR SELECT
USING (
    -- Users can view their own profile
    auth.uid()::text = id::text
    OR
    -- Managers/Finance/Admin can view all profiles
    EXISTS (
        SELECT 1 FROM expense_users
        WHERE id::text = auth.uid()::text
        AND role IN ('manager', 'finance', 'admin')
    )
);

-- Create a policy that allows users to update their own profile
CREATE POLICY "Users can update own profile"
ON expense_users FOR UPDATE
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

-- Create a function to check if a user profile exists
CREATE OR REPLACE FUNCTION public.user_profile_exists(user_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM expense_users
        WHERE id::text = user_id
    );
END;
$$; 