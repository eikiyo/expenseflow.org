-- Add Attachments Table Migration
-- This migration adds the 'attachments' table, which was missed during the database reset.

CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES public.expense_submissions(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for the new table
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for attachments
CREATE POLICY "Users can manage their own expense attachments" ON public.attachments
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.expense_submissions
        WHERE id = expense_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Managers and admins can view all attachments" ON public.attachments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN public.expense_submissions es ON es.id = attachments.expense_id
        WHERE 
            (p.role = 'admin' AND p.id = auth.uid()) OR
            (p.role = 'manager' AND p.id = auth.uid() AND es.user_id IN (SELECT id FROM public.profiles WHERE manager_id = p.id))
    )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS attachments_expense_id_idx ON public.attachments (expense_id);

-- Grant permissions
GRANT ALL ON public.attachments TO anon, authenticated, service_role;

SELECT 'Attachments table created successfully.'; 