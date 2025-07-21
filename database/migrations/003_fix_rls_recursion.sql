-- Fix RLS infinite recursion issue for expense_users table
-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage users" ON expense_users;

-- Add the correct policy for users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON expense_users FOR INSERT
WITH CHECK (auth.uid()::text = id::text);

-- Add the correct policy for admins to delete other users (but not themselves)
CREATE POLICY "Admins can delete other users"
ON expense_users FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM expense_users
    WHERE id::text = auth.uid()::text
    AND role = 'admin'
  )
  AND id::text != auth.uid()::text
); 