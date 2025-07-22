-- Migration: Add expense_data column to expenses table
-- Adds the JSONB column for storing type-specific expense data
-- Date: 2025-01-22

-- Add expense_data column to existing expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS expense_data jsonb NOT NULL DEFAULT '{}';

-- Add btree indexes for fast queries on specific JSON keys
CREATE INDEX IF NOT EXISTS expenses_transport_method_idx ON expenses ((expense_data->>'transport_method'));
CREATE INDEX IF NOT EXISTS expenses_service_date_idx ON expenses ((expense_data->>'service_date'));
CREATE INDEX IF NOT EXISTS expenses_category_idx ON expenses ((expense_data->>'category'));
CREATE INDEX IF NOT EXISTS expenses_urgency_level_idx ON expenses ((expense_data->>'urgency_level')); 