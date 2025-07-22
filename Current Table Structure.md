-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attachments (
  expense_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT attachments_pkey PRIMARY KEY (id),
  CONSTRAINT attachments_expense_id_fkey FOREIGN KEY (expense_id) REFERENCES public.expense_submissions(id)
);
CREATE TABLE public.expense_approvals (
  submission_id uuid NOT NULL,
  approver_id uuid NOT NULL,
  status text NOT NULL CHECK (status = ANY (ARRAY['approved'::text, 'rejected'::text])),
  comments text,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expense_approvals_pkey PRIMARY KEY (id),
  CONSTRAINT expense_approvals_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.expense_submissions(id),
  CONSTRAINT expense_approvals_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.expense_submissions (
  user_id uuid NOT NULL,
  total_amount numeric NOT NULL,
  description text,
  expense_type text NOT NULL,
  submission_data jsonb NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'in_review'::text])),
  currency text NOT NULL DEFAULT 'BDT'::text,
  CONSTRAINT expense_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT expense_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notifications (
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'info'::text CHECK (type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text])),
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  avatar_url text,
  department text,
  manager_id uuid,
  employee_id text UNIQUE,
  phone text,
  address text,
  role text NOT NULL DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'manager'::text, 'admin'::text])),
  monthly_budget numeric DEFAULT 50000,
  single_transaction_limit numeric DEFAULT 10000,
  is_active boolean DEFAULT true,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT profiles_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.profiles(id)
);