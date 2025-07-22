-- Comprehensive Database Reset and Unification Migration
-- This script drops all existing tables, policies, and functions, 
-- and then creates a clean, unified schema.

-- Step 1: Drop all tables in the public schema to ensure a clean slate
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Step 2: Drop all functions in the public schema
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
    ) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
    END LOOP;
END $$;

-- Step 3: Create the unified profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    department TEXT,
    role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'manager', 'admin')),
    manager_id UUID REFERENCES public.profiles(id),
    employee_id TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    monthly_budget NUMERIC DEFAULT 50000,
    single_transaction_limit NUMERIC DEFAULT 10000,
    is_active BOOLEAN DEFAULT true
);

-- Step 4: Create other application tables (e.g., expenses, approvals)
CREATE TABLE public.expense_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
    total_amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BDT',
    description TEXT,
    expense_type TEXT NOT NULL,
    submission_data JSONB NOT NULL
);

CREATE TABLE public.expense_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.expense_submissions(id),
    approver_id UUID NOT NULL REFERENCES public.profiles(id),
    status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_approvals ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Expense Submissions
CREATE POLICY "Users can manage their own submissions" ON public.expense_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Managers can view team submissions" ON public.expense_submissions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.role = 'manager' AND p.id = auth.uid() AND p.id = (SELECT manager_id FROM public.profiles WHERE id = user_id)
    )
);
CREATE POLICY "Admins can view all submissions" ON public.expense_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Expense Approvals
CREATE POLICY "Approvers can manage approvals assigned to them" ON public.expense_approvals FOR ALL USING (auth.uid() = approver_id);
CREATE POLICY "Users can view their own submission approvals" ON public.expense_approvals FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.expense_submissions 
        WHERE id = submission_id AND user_id = auth.uid()
    )
);

-- Step 7: Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, employee_id, role, is_active, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'EMP' || LPAD(EXTRACT(EPOCH FROM NOW())::text, 10, '0'),
        'user',
        true,
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Create trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 9: Create function to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Create triggers to update 'updated_at' on table changes
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expense_submissions_updated_at
    BEFORE UPDATE ON public.expense_submissions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Step 11: Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
CREATE INDEX IF NOT EXISTS profiles_manager_id_idx ON public.profiles (manager_id);
CREATE INDEX IF NOT EXISTS expense_submissions_user_id_idx ON public.expense_submissions (user_id);
CREATE INDEX IF NOT EXISTS expense_approvals_submission_id_idx ON public.expense_approvals (submission_id);
CREATE INDEX IF NOT EXISTS expense_approvals_approver_id_idx ON public.expense_approvals (approver_id);

-- Step 12: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Final verification notice
SELECT 'Database reset and unification complete.'; 