-- Create expenses table for the ExpenseFlow application
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('travel', 'maintenance', 'requisition')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'reimbursed')),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  
  -- Travel specific fields
  start_date DATE,
  end_date DATE,
  start_location JSONB,
  end_location JSONB,
  transportation_type TEXT,
  mileage DECIMAL(10,2),
  fuel_cost DECIMAL(10,2),
  toll_charges DECIMAL(10,2),
  accommodation_cost DECIMAL(10,2),
  per_diem_rate DECIMAL(10,2),
  
  -- Maintenance specific fields
  service_date DATE,
  category TEXT,
  asset_id TEXT,
  vendor_name TEXT,
  invoice_number TEXT,
  warranty_applicable BOOLEAN DEFAULT false,
  
  -- Requisition specific fields
  required_by DATE,
  quantity INTEGER,
  unit_price DECIMAL(10,2),
  preferred_vendor TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'urgent'))
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_type_idx ON expenses(type);
CREATE INDEX IF NOT EXISTS expenses_status_idx ON expenses(status);
CREATE INDEX IF NOT EXISTS expenses_created_at_idx ON expenses(created_at);
CREATE INDEX IF NOT EXISTS expenses_service_date_idx ON expenses(service_date);
CREATE INDEX IF NOT EXISTS expenses_start_date_idx ON expenses(start_date); 