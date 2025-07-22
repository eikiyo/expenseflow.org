-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense_submitted', 'expense_approved', 'expense_rejected', 'comment_added')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ
);

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY view_own_notifications ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only the system can create notifications
CREATE POLICY create_notifications ON notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Users can mark their own notifications as read
CREATE POLICY mark_notification_read ON notifications
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND read_at IS NULL
  )
  WITH CHECK (
    auth.uid() = user_id
    AND read_at IS NULL
  );

-- System can update notification status
CREATE POLICY update_notification_status ON notifications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
    AND status = 'pending'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
    AND status IN ('sent', 'failed')
  ); 