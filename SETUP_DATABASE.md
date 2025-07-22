# ExpenseFlow Database Setup Instructions

## 🚨 URGENT: Database Tables Missing

Your Supabase database is currently set up for a different project (news/articles). You need to create the ExpenseFlow tables manually.

## 📋 Quick Setup (Copy & Paste in Supabase SQL Editor)

### Step 1: Go to your Supabase Dashboard
1. Open [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `jbkzcjdqbuhgxahhzkno`
3. Go to **SQL Editor** in the left sidebar

### Step 2: Run This SQL (Copy the entire block)

```sql
-- ==========================================
-- EXPENSEFLOW DATABASE SETUP
-- ==========================================

-- 1. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'manager', 'admin')),
  manager_id UUID REFERENCES profiles(id),
  expense_limit DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CREATE EXPENSES TABLE
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

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES FOR PROFILES
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. CREATE POLICIES FOR EXPENSES
CREATE POLICY "Users can view their own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. CREATE TRIGGERS
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. CREATE INDEXES
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_type_idx ON expenses(type);
CREATE INDEX IF NOT EXISTS expenses_status_idx ON expenses(status);
CREATE INDEX IF NOT EXISTS expenses_created_at_idx ON expenses(created_at);
CREATE INDEX IF NOT EXISTS expenses_service_date_idx ON expenses(service_date);
CREATE INDEX IF NOT EXISTS expenses_start_date_idx ON expenses(start_date);
```

### Step 3: After Running the SQL
1. ✅ Click **RUN** in the SQL Editor
2. ✅ You should see "Success. No rows returned" 
3. ✅ The app should now work properly!

## 🔧 Alternative: Manual Step-by-Step

If the above doesn't work, run these one at a time:

### Create Profiles Table:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'manager', 'admin')),
  manager_id UUID REFERENCES profiles(id),
  expense_limit DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Enable RLS:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Create Policies:
```sql
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## ✅ Once Complete

After running the SQL, refresh your browser and try logging in again. The profile creation should now work!

**Expected behavior:**
- ✅ No more "❌ Error creating user profile" 
- ✅ Should see "✅ Successfully created new profile"
- ✅ Dashboard should load instead of login form 