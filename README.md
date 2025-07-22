# ExpenseFlow - Modern Expense Management System

A comprehensive expense management application built with Next.js, TypeScript, and Supabase. Streamline expense submissions, approvals, and reporting for your organization.

## 🚀 Features

- **🔐 Secure Authentication** - Google OAuth integration with Supabase Auth
- **📱 Responsive Design** - Modern UI that works on all devices
- **💰 Multi-Type Expenses** - Travel, Maintenance, and Requisition expenses
- **✅ Approval Workflow** - Multi-level approval system with notifications
- **📊 Analytics Dashboard** - Real-time expense tracking and reporting
- **🔒 Role-Based Access** - User roles with appropriate permissions
- **📄 Document Management** - Receipt upload and storage
- **🎯 Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google OAuth credentials

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/eikiyo/expenseflow.org.git
   cd expenseflow.org
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   **Fill in your Supabase credentials:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings → API
   - Copy the Project URL and anon public key
   - Update `.env.local` with your values

4. **Set up the database**
   
   The database schema is already configured. Run migrations using Supabase CLI:
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase
   
   # Link your project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Apply migrations
   supabase db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Core Tables
- **profiles**: User profiles and roles (unified user system)
- **expenses**: Main expense submissions
- **expense_approvals**: Approval workflow tracking
- **expense_attachments**: Receipt and document storage
- **expense_audit_logs**: Comprehensive audit trail

### User Roles
- **Employee**: Submit and manage own expenses
- **Manager**: Approve team expenses
- **Finance**: Final approval and financial oversight
- **Admin**: System administration and user management

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Managers can view team member expenses
- Finance team has broader access for approval
- Comprehensive audit logging

### Authentication
- Google OAuth integration
- Secure session management
- Error boundary protection
- Automatic token refresh

## 🎯 User Journey

### Employee Workflow
1. **Login** → Dashboard overview
2. **Create Expense** → Select type (Travel/Maintenance/Requisition)
3. **Fill Details** → Complete expense information
4. **Upload Receipts** → Attach supporting documents
5. **Review & Submit** → Final review and submission
6. **Track Status** → Monitor approval progress

### Manager Workflow
1. **Review Pending** → View team expense submissions
2. **Approve/Reject** → Make approval decisions
3. **Add Comments** → Provide feedback
4. **Monitor Budget** → Track team spending

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📦 Build & Deploy

Build for production:
```bash
npm run build
```

Deploy to Vercel:
```bash
npm run deploy
```

## 🔧 Development

### Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for quality checks

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── providers/         # Context providers
│   ├── services/          # API services
│   └── types/             # TypeScript definitions
├── lib/                   # Utility libraries
├── supabase/              # Database migrations
└── __tests__/             # Test files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@expenseflow.org or create an issue in the repository.

---

**Built with ❤️ by the ExpenseFlow Team** 