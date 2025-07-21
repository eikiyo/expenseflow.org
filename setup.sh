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

# Create .env.local from config if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://jbkzcjdqbuhgxahhzkno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impia3pjamRxYnVoZ3hhaGh6a25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDY0MTYsImV4cCI6MjA2ODY4MjQxNn0.9ywKDUR0KJMugrNXzk3koBC38vLmQgwTtwsdvZHFurc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impia3pjamRxYnVoZ3hhaGh6a25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDY0MTYsImV4cCI6MjA2ODY4MjQxNn0.9ywKDUR0KJMugrNXzk3koBC38vLmQgwTtwsdvZHFurc

# Database Configuration
SUPABASE_PROJECT_ID=jbkzcjdqbuhgxahhzkno
DATABASE_URL=postgresql://postgres:Shakiba420@@@db.jbkzcjdqbuhgxahhzkno.supabase.co:5432/postgres

# JWT Configuration
SUPABASE_JWT_SECRET=gPi0qNx26SO/SwBJADWCn2iJlQUPkpP2c4E6xn2JHeLslZGi5gYOS84SQ9VyUakUkWW1UvorBC5xXFwSG522aA==

# Application Configuration
NEXT_PUBLIC_APP_NAME=ExpenseFlow
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=development

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,application/pdf

# Google Maps API (you'll need to get this)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
EOL
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

# Build the project to check for errors
echo ""
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Project built successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your Google Maps API key in .env.local"
echo "2. Run the database migrations in Supabase:"
echo "   - database/migrations/001_expense_schema.sql"
echo "   - database/migrations/002_rls_policies.sql"
echo "3. Start the development server: npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🚀 Happy coding with ExpenseFlow!" 