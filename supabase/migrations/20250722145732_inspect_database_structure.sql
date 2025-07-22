-- Database Structure Inspection Migration
-- This migration will help us understand the current database state

-- Create a temporary table to store inspection results
CREATE TEMP TABLE inspection_results (
    section TEXT,
    result_data JSONB
);

-- 1. Check profiles table structure
INSERT INTO inspection_results (section, result_data)
SELECT 
    'profiles_table_structure',
    jsonb_agg(
        jsonb_build_object(
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable,
            'column_default', column_default
        )
    )
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- 2. Check if functions exist
INSERT INTO inspection_results (section, result_data)
SELECT 
    'functions_check',
    jsonb_agg(
        jsonb_build_object(
            'function_name', proname,
            'exists', true,
            'permissions', proacl
        )
    )
FROM pg_proc 
WHERE proname IN ('handle_new_user', 'update_updated_at_column')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 3. Check if triggers exist
INSERT INTO inspection_results (section, result_data)
SELECT 
    'triggers_check',
    jsonb_agg(
        jsonb_build_object(
            'trigger_name', tgname,
            'table_name', tgrelid::regclass::text,
            'function_name', tgfoid::regproc::text
        )
    )
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'update_profiles_updated_at');

-- 4. Check RLS policies
INSERT INTO inspection_results (section, result_data)
SELECT 
    'rls_policies',
    jsonb_agg(
        jsonb_build_object(
            'policy_name', policyname,
            'permissive', permissive,
            'roles', roles,
            'cmd', cmd
        )
    )
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Check profile count
INSERT INTO inspection_results (section, result_data)
SELECT 
    'profile_count',
    jsonb_build_object('count', COUNT(*))
FROM public.profiles;

-- 6. Check specific user profile
INSERT INTO inspection_results (section, result_data)
SELECT 
    'user_profile',
    jsonb_build_object(
        'has_profile', CASE WHEN COUNT(*) > 0 THEN true ELSE false END,
        'profile_data', jsonb_agg(
            jsonb_build_object(
                'id', id,
                'email', email,
                'full_name', full_name,
                'created_at', created_at
            )
        )
    )
FROM public.profiles 
WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005';

-- 7. Check all tables in public schema
INSERT INTO inspection_results (section, result_data)
SELECT 
    'all_tables',
    jsonb_agg(
        jsonb_build_object(
            'table_name', table_name,
            'table_type', table_type
        )
    )
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 8. Check all functions in public schema
INSERT INTO inspection_results (section, result_data)
SELECT 
    'all_functions',
    jsonb_agg(
        jsonb_build_object(
            'function_name', proname,
            'return_type', prorettype::regtype::text
        )
    )
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

-- 9. Check all triggers in public schema
INSERT INTO inspection_results (section, result_data)
SELECT 
    'all_triggers',
    jsonb_agg(
        jsonb_build_object(
            'trigger_name', tgname,
            'table_name', tgrelid::regclass::text,
            'function_name', tgfoid::regproc::text
        )
    )
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public';

-- Output all results
SELECT 
    section,
    result_data
FROM inspection_results
ORDER BY section;

-- Clean up
DROP TABLE inspection_results;
