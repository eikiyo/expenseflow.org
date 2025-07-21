-- ExpenseFlow Database Schema Migration
-- Travel & Petty Expense Submission System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for various expense types and statuses
DO $$ BEGIN
    CREATE TYPE expense_type AS ENUM ('travel', 'maintenance', 'requisition');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE expense_status AS ENUM ('draft', 'submitted', 'pending_manager', 'pending_finance', 'approved', 'rejected', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transport_method AS ENUM ('van', 'rickshaw', 'boat', 'cng', 'train', 'plane', 'launch', 'ferry', 'bike', 'car');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_ownership AS ENUM ('own', 'rental', 'public');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE maintenance_category AS ENUM ('charges', 'purchases', 'repairs');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snacks');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('employee', 'manager', 'finance', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE approval_action AS ENUM ('approve', 'reject', 'request_changes');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users/employees table
CREATE TABLE IF NOT EXISTS expense_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    role user_role DEFAULT 'employee',
    department VARCHAR(100),
    manager_id UUID REFERENCES expense_users(id),
    phone VARCHAR(20),
    address TEXT,
    monthly_budget DECIMAL(10,2) DEFAULT 50000,
    single_transaction_limit DECIMAL(10,2) DEFAULT 10000,
    profile_picture_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user vehicles table
CREATE TABLE IF NOT EXISTS user_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES expense_users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(100),
    license_plate VARCHAR(20),
    fuel_type VARCHAR(30),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense submissions table
CREATE TABLE IF NOT EXISTS expense_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES expense_users(id),
    expense_type expense_type NOT NULL,
    status expense_status DEFAULT 'draft',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    business_purpose TEXT NOT NULL CHECK (length(business_purpose) >= 200),
    submission_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transportation expenses table
CREATE TABLE IF NOT EXISTS transportation_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES expense_submissions(id) ON DELETE CASCADE,
    transport_method transport_method NOT NULL,
    vehicle_ownership vehicle_ownership NOT NULL,
    vehicle_model VARCHAR(100),
    license_plate VARCHAR(20),
    start_location TEXT NOT NULL,
    start_coordinates POINT,
    end_location TEXT NOT NULL,
    end_coordinates POINT,
    departure_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    return_datetime TIMESTAMP WITH TIME ZONE,
    is_round_trip BOOLEAN DEFAULT false,
    start_odometer INTEGER,
    end_odometer INTEGER,
    distance_km DECIMAL(8,2),
    base_cost DECIMAL(8,2) NOT NULL,
    fuel_cost DECIMAL(8,2) DEFAULT 0,
    toll_charges DECIMAL(8,2) DEFAULT 0,
    total_cost DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food and accommodation expenses table
CREATE TABLE IF NOT EXISTS food_accommodation_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES expense_submissions(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    meal_types meal_type[],
    hotel_name VARCHAR(255),
    hotel_location TEXT,
    check_in_date DATE,
    check_out_date DATE,
    nights_count INTEGER DEFAULT 0,
    food_cost DECIMAL(8,2) DEFAULT 0,
    accommodation_cost DECIMAL(8,2) DEFAULT 0,
    total_cost DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance expenses table
CREATE TABLE IF NOT EXISTS maintenance_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES expense_submissions(id) ON DELETE CASCADE,
    category maintenance_category NOT NULL,
    subcategory VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50),
    vehicle_model VARCHAR(100),
    service_purpose TEXT NOT NULL,
    service_date DATE NOT NULL,
    duration_months INTEGER DEFAULT 1,
    contractor_details TEXT,
    equipment_purchased BOOLEAN DEFAULT false,
    total_cost DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance equipment table (for when equipment is purchased)
CREATE TABLE IF NOT EXISTS maintenance_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_expense_id UUID NOT NULL REFERENCES maintenance_expenses(id) ON DELETE CASCADE,
    equipment_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_cost DECIMAL(8,2) NOT NULL,
    total_cost DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create requisition expenses table
CREATE TABLE IF NOT EXISTS requisition_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES expense_submissions(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    service_description TEXT NOT NULL,
    service_date DATE NOT NULL,
    fee_period_start DATE,
    fee_period_end DATE,
    service_provider VARCHAR(255),
    contract_details TEXT,
    total_cost DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense attachments table for receipts and documents
CREATE TABLE IF NOT EXISTS expense_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES expense_submissions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval workflow table
CREATE TABLE IF NOT EXISTS expense_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES expense_submissions(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES expense_users(id),
    approval_level INTEGER NOT NULL, -- 1 for manager, 2 for finance
    action approval_action,
    comments TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expense validation logs table
CREATE TABLE IF NOT EXISTS expense_validation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES expense_submissions(id) ON DELETE CASCADE,
    validation_type VARCHAR(100) NOT NULL,
    validation_result BOOLEAN NOT NULL,
    validation_message TEXT,
    validation_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system audit logs table
CREATE TABLE IF NOT EXISTS expense_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES expense_users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expense_submissions_user_id ON expense_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_submissions_status ON expense_submissions(status);
CREATE INDEX IF NOT EXISTS idx_expense_submissions_type ON expense_submissions(expense_type);
CREATE INDEX IF NOT EXISTS idx_expense_submissions_date ON expense_submissions(submission_date);
CREATE INDEX IF NOT EXISTS idx_transportation_expenses_submission_id ON transportation_expenses(submission_id);
CREATE INDEX IF NOT EXISTS idx_food_accommodation_expenses_submission_id ON food_accommodation_expenses(submission_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_expenses_submission_id ON maintenance_expenses(submission_id);
CREATE INDEX IF NOT EXISTS idx_requisition_expenses_submission_id ON requisition_expenses(submission_id);
CREATE INDEX IF NOT EXISTS idx_expense_attachments_submission_id ON expense_attachments(submission_id);
CREATE INDEX IF NOT EXISTS idx_expense_approvals_submission_id ON expense_approvals(submission_id);
CREATE INDEX IF NOT EXISTS idx_expense_approvals_approver_id ON expense_approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_expense_validation_logs_submission_id ON expense_validation_logs(submission_id);
CREATE INDEX IF NOT EXISTS idx_expense_audit_logs_user_id ON expense_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_audit_logs_created_at ON expense_audit_logs(created_at);

-- Create functions for automatic submission number generation
CREATE OR REPLACE FUNCTION generate_expense_submission_number()
RETURNS TEXT AS $$
DECLARE
    year_month TEXT;
    sequence_num INTEGER;
BEGIN
    year_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(submission_number FROM 'EXP-' || year_month || '-(.*)') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM expense_submissions
    WHERE submission_number LIKE 'EXP-' || year_month || '-%';
    
    RETURN 'EXP-' || year_month || '-' || LPAD(sequence_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate submission numbers
CREATE OR REPLACE FUNCTION set_expense_submission_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.submission_number IS NULL OR NEW.submission_number = '' THEN
        NEW.submission_number := generate_expense_submission_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_set_expense_submission_number ON expense_submissions;
CREATE TRIGGER trigger_set_expense_submission_number
    BEFORE INSERT ON expense_submissions
    FOR EACH ROW
    EXECUTE FUNCTION set_expense_submission_number();

-- Create trigger to update total amounts
CREATE OR REPLACE FUNCTION update_expense_submission_total()
RETURNS TRIGGER AS $$
DECLARE
    transport_total DECIMAL(10,2);
    food_total DECIMAL(10,2);
    maintenance_total DECIMAL(10,2);
    requisition_total DECIMAL(10,2);
    new_total DECIMAL(10,2);
BEGIN
    -- Calculate totals from each expense type
    SELECT COALESCE(SUM(total_cost), 0) INTO transport_total
    FROM transportation_expenses
    WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id);
    
    SELECT COALESCE(SUM(total_cost), 0) INTO food_total
    FROM food_accommodation_expenses
    WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id);
    
    SELECT COALESCE(SUM(total_cost), 0) INTO maintenance_total
    FROM maintenance_expenses
    WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id);
    
    SELECT COALESCE(SUM(total_cost), 0) INTO requisition_total
    FROM requisition_expenses
    WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id);
    
    new_total := transport_total + food_total + maintenance_total + requisition_total;
    
    -- Update the submission total
    UPDATE expense_submissions
    SET total_amount = new_total, updated_at = NOW()
    WHERE id = COALESCE(NEW.submission_id, OLD.submission_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for total calculation
DROP TRIGGER IF EXISTS trigger_update_total_transport ON transportation_expenses;
CREATE TRIGGER trigger_update_total_transport
    AFTER INSERT OR UPDATE OR DELETE ON transportation_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_submission_total();

DROP TRIGGER IF EXISTS trigger_update_total_food ON food_accommodation_expenses;
CREATE TRIGGER trigger_update_total_food
    AFTER INSERT OR UPDATE OR DELETE ON food_accommodation_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_submission_total();

DROP TRIGGER IF EXISTS trigger_update_total_maintenance ON maintenance_expenses;
CREATE TRIGGER trigger_update_total_maintenance
    AFTER INSERT OR UPDATE OR DELETE ON maintenance_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_submission_total();

DROP TRIGGER IF EXISTS trigger_update_total_requisition ON requisition_expenses;
CREATE TRIGGER trigger_update_total_requisition
    AFTER INSERT OR UPDATE OR DELETE ON requisition_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_submission_total();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_expense_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
DROP TRIGGER IF EXISTS trigger_expense_users_updated_at ON expense_users;
CREATE TRIGGER trigger_expense_users_updated_at
    BEFORE UPDATE ON expense_users
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_updated_at_column();

DROP TRIGGER IF EXISTS trigger_expense_submissions_updated_at ON expense_submissions;
CREATE TRIGGER trigger_expense_submissions_updated_at
    BEFORE UPDATE ON expense_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_expense_updated_at_column(); 