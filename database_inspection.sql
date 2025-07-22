-- Database Structure Inspection Script
-- This script will help us understand the current database state

-- 1. Check if profiles table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Check if functions exist
SELECT 
    proname as function_name,
    prosrc as function_source,
    proacl as function_permissions
FROM pg_proc 
WHERE proname IN ('handle_new_user', 'update_updated_at_column')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 3. Check if triggers exist
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgfoid::regproc as function_name
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'update_profiles_updated_at');

-- 4. Check RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Check if profiles table has any data
SELECT COUNT(*) as profile_count FROM public.profiles;

-- 6. Check if the specific user has a profile
SELECT * FROM public.profiles WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005';

-- 7. Check auth.users table for the user
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005';

-- 8. Check all tables in public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 9. Check all functions in public schema
SELECT 
    proname as function_name,
    proargtypes::regtype[] as argument_types,
    prorettype::regtype as return_type
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;

-- 10. Check all triggers in public schema
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgfoid::regproc as function_name,
    tgtype
FROM pg_trigger 
WHERE tgrelid::regnamespace::regname = 'public'
ORDER BY tgname;

-- 11. Check for any views that might be causing issues
SELECT 
    viewname,
    definition
FROM pg_views 
WHERE schemaname = 'public';

-- 12. Check for any dependencies on the functions
SELECT 
    dependent_ns.nspname as dependent_schema,
    dependent_object.relname as dependent_object,
    pg_class.relkind as object_type
FROM pg_depend 
JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid 
JOIN pg_class as dependent_object ON pg_rewrite.ev_class = dependent_object.oid 
JOIN pg_class ON pg_depend.refobjid = pg_class.oid 
JOIN pg_namespace dependent_ns ON dependent_object.relnamespace = dependent_ns.oid 
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid 
JOIN pg_proc ON pg_proc.oid = pg_depend.refobjid
WHERE pg_proc.proname IN ('handle_new_user', 'update_updated_at_column')
AND pg_namespace.nspname = 'public'; 