-- Drop all existing policies first to avoid conflicts
DO $$ 
BEGIN
    -- expense_users policies
    DROP POLICY IF EXISTS "Users can view own profile" ON expense_users;
    DROP POLICY IF EXISTS "Managers can view team members" ON expense_users;
    DROP POLICY IF EXISTS "Users can insert own profile" ON expense_users;
    DROP POLICY IF EXISTS "Users can update own profile" ON expense_users;
    DROP POLICY IF EXISTS "Admins can delete other users" ON expense_users;
    DROP POLICY IF EXISTS "Admins can manage users" ON expense_users;

    -- expense_submissions policies
    DROP POLICY IF EXISTS "Finance can view all submissions" ON expense_submissions;
    DROP POLICY IF EXISTS "Managers can view team submissions" ON expense_submissions;
    DROP POLICY IF EXISTS "Users can manage own submissions" ON expense_submissions;
    DROP POLICY IF EXISTS "Users can update own draft submissions" ON expense_submissions;
    DROP POLICY IF EXISTS "Users can view own submissions" ON expense_submissions;

    -- expense_approvals policies
    DROP POLICY IF EXISTS "Approvers can manage assigned approvals" ON expense_approvals;
    DROP POLICY IF EXISTS "Managers can view team approvals" ON expense_approvals;
    DROP POLICY IF EXISTS "Users can view own submission approvals" ON expense_approvals;

    -- expense_attachments policies
    DROP POLICY IF EXISTS "Users can manage own expense attachments" ON expense_attachments;
    DROP POLICY IF EXISTS "Managers can view team expense attachments" ON expense_attachments;

    -- expense_audit_logs policies
    DROP POLICY IF EXISTS "Admins can view audit logs" ON expense_audit_logs;
    DROP POLICY IF EXISTS "System can create audit logs" ON expense_audit_logs;
END $$;

-- Recreate all policies with correct permissions

-- expense_users policies
CREATE POLICY "Users can view own profile"
ON expense_users FOR SELECT
USING (auth.uid()::text = id::text);

CREATE POLICY "Managers can view team members"
ON expense_users FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM expense_users
        WHERE id::text = auth.uid()::text
        AND role IN ('manager', 'finance', 'admin')
    )
);

CREATE POLICY "Users can insert own profile"
ON expense_users FOR INSERT
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
ON expense_users FOR UPDATE
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

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

-- expense_submissions policies
CREATE POLICY "Finance can view all submissions"
ON expense_submissions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM expense_users
        WHERE id::text = auth.uid()::text
        AND role IN ('finance', 'admin')
    )
);

CREATE POLICY "Managers can view team submissions"
ON expense_submissions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM expense_users emp
        JOIN expense_users mgr ON emp.manager_id = mgr.id
        WHERE emp.id = expense_submissions.user_id
        AND mgr.id::text = auth.uid()::text
        AND mgr.role IN ('manager', 'finance', 'admin')
    )
);

CREATE POLICY "Users can manage own submissions"
ON expense_submissions FOR INSERT
WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own draft submissions"
ON expense_submissions FOR UPDATE
USING (
    user_id::text = auth.uid()::text
    AND status = 'draft'
)
WITH CHECK (
    user_id::text = auth.uid()::text
    AND status = 'draft'
);

CREATE POLICY "Users can view own submissions"
ON expense_submissions FOR SELECT
USING (user_id::text = auth.uid()::text);

-- expense_approvals policies
CREATE POLICY "Approvers can manage assigned approvals"
ON expense_approvals FOR ALL
USING (approver_id::text = auth.uid()::text);

CREATE POLICY "Managers can view team approvals"
ON expense_approvals FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM expense_submissions es
        JOIN expense_users emp ON es.user_id = emp.id
        JOIN expense_users mgr ON emp.manager_id = mgr.id
        WHERE es.id = expense_approvals.submission_id
        AND mgr.id::text = auth.uid()::text
        AND mgr.role IN ('manager', 'finance', 'admin')
    )
);

CREATE POLICY "Users can view own submission approvals"
ON expense_approvals FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM expense_submissions
        WHERE id = expense_approvals.submission_id
        AND user_id::text = auth.uid()::text
    )
);

-- expense_attachments policies
CREATE POLICY "Users can manage own expense attachments"
ON expense_attachments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM expense_submissions
        WHERE id = expense_attachments.submission_id
        AND user_id::text = auth.uid()::text
    )
);

CREATE POLICY "Managers can view team expense attachments"
ON expense_attachments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM expense_submissions es
        JOIN expense_users emp ON es.user_id = emp.id
        JOIN expense_users mgr ON emp.manager_id = mgr.id
        WHERE es.id = expense_attachments.submission_id
        AND mgr.id::text = auth.uid()::text
        AND mgr.role IN ('manager', 'finance', 'admin')
    )
);

-- expense_audit_logs policies
CREATE POLICY "Admins can view audit logs"
ON expense_audit_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM expense_users
        WHERE id::text = auth.uid()::text
        AND role = 'admin'
    )
);

CREATE POLICY "System can create audit logs"
ON expense_audit_logs FOR INSERT
WITH CHECK (true); 