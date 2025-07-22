# Database Diagnosis Guide

## Current Issue: 42P17 "undefined_function" Error

The `42P17` error means "undefined_function" - this happens when:
1. Functions don't exist
2. Functions exist but have wrong permissions
3. Functions exist but are in wrong schema
4. Dependencies are broken

## Step 1: Run These Queries in Supabase SQL Editor

### 1. Check if profiles table exists
```sql
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'profiles';
```

### 2. Check profiles table structure
```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;
```

### 3. Check if functions exist
```sql
SELECT 
    proname as function_name,
    prosrc as function_source,
    proacl as function_permissions
FROM pg_proc 
WHERE proname IN ('handle_new_user', 'update_updated_at_column')
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
```

### 4. Check if triggers exist
```sql
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgfoid::regproc as function_name
FROM pg_trigger 
WHERE tgname IN ('on_auth_user_created', 'update_profiles_updated_at');
```

### 5. Check RLS policies
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'profiles';
```

### 6. Check if your user has a profile
```sql
SELECT * FROM public.profiles 
WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005';
```

### 7. Check auth.users for your user
```sql
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005';
```

### 8. Check all functions in public schema
```sql
SELECT 
    proname as function_name,
    prorettype::regtype as return_type
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname;
```

### 9. Check all triggers in public schema
```sql
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgfoid::regproc as function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY tgname;
```

## Step 2: Based on Results, Run the Appropriate Fix

### If functions don't exist:
Run the comprehensive fix migration we created earlier.

### If functions exist but have wrong permissions:
```sql
-- Grant proper permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO anon, authenticated;
```

### If triggers don't exist:
```sql
-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
```

### If profiles table doesn't exist:
```sql
-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    department TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    manager_id UUID REFERENCES public.profiles(id),
    expense_limit DECIMAL(10,2) DEFAULT 10000.00
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

## Step 3: Manual Profile Creation (if needed)

If the trigger isn't working, manually create your profile:

```sql
INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
    au.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
FROM auth.users au
WHERE au.id = 'f50672bd-43b5-4dcc-b13b-7966e6ecd005'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);
```

## Expected Results

After running these queries, you should see:
- ✅ Functions exist with proper permissions
- ✅ Triggers are attached to correct tables
- ✅ RLS policies are in place
- ✅ Your profile exists in the profiles table

## Next Steps

1. Run the diagnosis queries above
2. Share the results with me
3. I'll provide the exact fix based on what's missing
4. Test the authentication flow again

This systematic approach will help us identify exactly what's causing the `42P17` error and fix it properly. 