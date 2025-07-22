#!/bin/bash

# ExpenseFlow Setup Script
echo "🚀 Setting up ExpenseFlow - Travel & Petty Expense Management System"
echo "=================================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local template if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "🔧 Creating .env.local template..."
    cat > .env.local << EOL
# Supabase Configuration - REPLACE WITH YOUR ACTUAL VALUES
NEXT_PUBLIC_SUPABASE_URL=https://jbkzcjdqbuhgxahhzkno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_supabase_project_id

# Database Configuration - REPLACE WITH YOUR ACTUAL VALUES
DATABASE_URL=your_database_connection_string

# JWT Configuration - REPLACE WITH YOUR ACTUAL VALUES
SUPABASE_JWT_SECRET=your_jwt_secret

# Application Configuration
NEXT_PUBLIC_APP_NAME=ExpenseFlow
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=development

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Google Maps API - REPLACE WITH YOUR ACTUAL KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Email Configuration (for notifications) - REPLACE WITH YOUR ACTUAL VALUES
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
EOL
    echo "✅ Environment template created"
    echo ""
    echo "⚠️  IMPORTANT: Please update .env.local with your actual credentials!"
    echo "   You can get these from your Supabase dashboard."
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your actual Supabase credentials"
echo "2. Get your credentials from: https://supabase.com/dashboard"
echo "3. Update your Google Maps API key in .env.local"
echo "4. Run the database migrations in Supabase:"
echo "   - database/migrations/001_expense_schema.sql"
echo "   - database/migrations/002_rls_policies.sql"
echo "5. Start the development server: npm run dev"
echo "6. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🚀 Happy coding with ExpenseFlow!" 