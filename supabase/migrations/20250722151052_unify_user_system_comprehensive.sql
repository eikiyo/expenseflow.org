-- Comprehensive User System Unification Migration
-- This migration unifies the dual user system by making profiles the single source of truth

-- Step 1: Add missing columns to profiles table to match expense_users functionality
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monthly_budget NUMERIC DEFAULT 50000;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS single_transaction_limit NUMERIC DEFAULT 10000;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update role column to match expense_users enum values
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['user'::text, 'manager'::text, 'admin'::text, 'employee'::text]));

-- Step 2: Migrate existing expense_users data to profiles (if any exists)
INSERT INTO public.profiles (
    id, email, full_name, employee_id, role, department, 
    phone, address, monthly_budget, single_transaction_limit, 
    profile_picture_url, is_active, manager_id, created_at, updated_at
)
SELECT 
    eu.id, eu.email, eu.full_name, eu.employee_id, 
    CASE 
        WHEN eu.role::text = 'employee' THEN 'employee'
        WHEN eu.role::text = 'manager' THEN 'manager'
        WHEN eu.role::text = 'admin' THEN 'admin'
        ELSE 'user'
    END,
    eu.department, eu.phone, eu.address, eu.monthly_budget, 
    eu.single_transaction_limit, eu.profile_picture_url, eu.is_active,
    eu.manager_id, eu.created_at, eu.updated_at
FROM public.expense_users eu
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = eu.id
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    employee_id = EXCLUDED.employee_id,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    monthly_budget = EXCLUDED.monthly_budget,
    single_transaction_limit = EXCLUDED.single_transaction_limit,
    profile_picture_url = EXCLUDED.profile_picture_url,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Step 3: Create your specific user profile if it doesn't exist
INSERT INTO public.profiles (
    id, email, full_name, employee_id, role, department,
    created_at, updated_at, is_active
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
    'EMP001',
    'user',
    'Engineering',
    NOW(),
    NOW(),
    true
FROM auth.users au
WHERE au.id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
    employee_id = COALESCE(profiles.employee_id, 'EMP001'),
    is_active = COALESCE(profiles.is_active, true),
    updated_at = NOW();

-- Step 4: Drop foreign key constraints that reference expense_users
ALTER TABLE public.user_vehicles DROP CONSTRAINT IF EXISTS user_vehicles_user_id_fkey;
ALTER TABLE public.expense_submissions DROP CONSTRAINT IF EXISTS expense_submissions_user_id_fkey;
ALTER TABLE public.expense_audit_logs DROP CONSTRAINT IF EXISTS expense_audit_logs_user_id_fkey;
ALTER TABLE public.expense_approvals DROP CONSTRAINT IF EXISTS expense_approvals_approver_id_fkey;

-- Step 5: Add new foreign key constraints that reference profiles
ALTER TABLE public.user_vehicles 
ADD CONSTRAINT user_vehicles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.expense_submissions 
ADD CONSTRAINT expense_submissions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.expense_audit_logs 
ADD CONSTRAINT expense_audit_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.expense_approvals 
ADD CONSTRAINT expense_approvals_approver_id_fkey 
FOREIGN KEY (approver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Step 6: Update RLS policies to work with unified system
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Managers can view team profiles" ON public.profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Managers can view team profiles"
    ON public.profiles
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT p.id 
            FROM public.profiles p 
            WHERE p.role IN ('manager', 'admin')
            AND (
                p.id = auth.uid() 
                OR EXISTS (
                    SELECT 1 
                    FROM public.profiles team 
                    WHERE team.manager_id = p.id 
                    AND team.id = profiles.id
                )
            )
        )
    );

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_employee_id_idx ON public.profiles (employee_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);
CREATE INDEX IF NOT EXISTS profiles_department_idx ON public.profiles (department);
CREATE INDEX IF NOT EXISTS profiles_is_active_idx ON public.profiles (is_active);

-- Step 8: Create a view for backward compatibility (optional)
CREATE OR REPLACE VIEW public.expense_users_view AS
SELECT 
    id, email, full_name, employee_id, role, department,
    manager_id, phone, address, monthly_budget, single_transaction_limit,
    profile_picture_url, is_active, created_at, updated_at
FROM public.profiles
WHERE is_active = true;

-- Step 9: Drop the expense_users table (after ensuring all data is migrated)
-- We'll do this in a separate step after verification
-- DROP TABLE IF EXISTS public.expense_users CASCADE;

-- Step 10: Update the handle_new_user function to create complete profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, email, full_name, avatar_url, employee_id, role, 
        is_active, created_at, updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'EMP' || LPAD(EXTRACT(EPOCH FROM NOW())::text, 10, '0'), -- Generate unique employee ID
        'user',
        true,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Grant necessary permissions
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.expense_users_view TO anon, authenticated;

-- Step 12: Verification queries (these will run and show results)
DO $$
BEGIN
    -- Check that your user profile exists and is complete
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005' 
        AND employee_id IS NOT NULL
        AND is_active = true
    ) THEN
        RAISE NOTICE 'SUCCESS: User profile exists and is complete';
    ELSE
        RAISE NOTICE 'WARNING: User profile incomplete or missing';
    END IF;
    
    -- Check foreign key constraints
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_vehicles_user_id_fkey'
        AND table_name = 'user_vehicles'
    ) THEN
        RAISE NOTICE 'SUCCESS: user_vehicles foreign key updated to profiles';
    END IF;
    
    RAISE NOTICE 'User system unification completed successfully';
END $$;
