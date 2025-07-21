-- Ensure unique policy definitions for expense_users
-- This migration drops the existing "Users can view own profile" policy if it exists
-- and recreates it with the intended logic. This avoids the 42710 duplication error.

-- Drop the policy if it already exists
DROP POLICY IF EXISTS "Users can view own profile" ON expense_users;

-- Recreate the policy (only once)
CREATE POLICY "Users can view own profile"
ON expense_users FOR SELECT
USING (auth.uid()::text = id::text); 