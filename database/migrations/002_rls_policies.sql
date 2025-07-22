-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can read any profile
CREATE POLICY read_all_profiles ON profiles
  FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY update_own_profile ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Only admins can create profiles (handled by auth hook)
CREATE POLICY create_profile_admin ON profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Expenses policies
-- Users can read their own expenses
CREATE POLICY read_own_expenses ON expenses
  FOR SELECT
  USING (
    auth.uid() = user_id
  );

-- Managers can read expenses they need to approve
CREATE POLICY read_approval_expenses ON expenses
  FOR SELECT
  USING (
    auth.uid() = approver_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('manager', 'admin')
    )
  );

-- Users can create their own expenses
CREATE POLICY create_own_expenses ON expenses
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'draft'
  );

-- Users can update their own draft expenses
CREATE POLICY update_own_draft_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status = 'draft'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'draft'
  );

-- Users can submit their own draft expenses
CREATE POLICY submit_own_draft_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status = 'draft'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('submitted')
  );

-- Approvers can update expenses assigned to them
CREATE POLICY approve_assigned_expenses ON expenses
  FOR UPDATE
  USING (
    auth.uid() = approver_id
    AND status = 'submitted'
  )
  WITH CHECK (
    auth.uid() = approver_id
    AND status IN ('approved', 'rejected')
  );

-- Users can delete their own draft expenses
CREATE POLICY delete_own_draft_expenses ON expenses
  FOR DELETE
  USING (
    auth.uid() = user_id
    AND status = 'draft'
  );

-- Admins have full access
CREATE POLICY admin_all_expenses ON expenses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  ); 