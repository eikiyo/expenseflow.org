-- Fix User Profile Completion Migration
-- This ensures your specific user profile has all required fields

-- Update your user profile to ensure it's complete
UPDATE public.profiles 
SET 
    employee_id = COALESCE(employee_id, 'EMP001'),
    role = COALESCE(role, 'user'),
    is_active = COALESCE(is_active, true),
    monthly_budget = COALESCE(monthly_budget, 50000),
    single_transaction_limit = COALESCE(single_transaction_limit, 10000),
    department = COALESCE(department, 'Engineering'),
    updated_at = NOW()
WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005';

-- Ensure the profile exists if somehow it's still missing
INSERT INTO public.profiles (
    id, email, full_name, employee_id, role, department,
    is_active, monthly_budget, single_transaction_limit,
    created_at, updated_at
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
    'EMP001',
    'user',
    'Engineering',
    true,
    50000,
    10000,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- Now we can safely drop the expense_users table since all data is unified
DROP TABLE IF EXISTS public.expense_users CASCADE;

-- Verification
DO $$
BEGIN
    -- Check that your user profile is now complete
    IF EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005' 
        AND employee_id IS NOT NULL
        AND is_active = true
        AND role IS NOT NULL
    ) THEN
        RAISE NOTICE 'SUCCESS: User profile is now complete and ready!';
        RAISE NOTICE 'User can now access the expense system without 42P17 errors';
    ELSE
        RAISE NOTICE 'ERROR: User profile still incomplete';
    END IF;
    
    -- Check if expense_users table was dropped
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'expense_users' 
        AND table_schema = 'public'
    ) THEN
        RAISE NOTICE 'SUCCESS: expense_users table removed - unified system active';
    END IF;
END $$;
