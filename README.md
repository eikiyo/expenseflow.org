# ExpenseFlow - Travel & Petty Expense Management System

A comprehensive, auditable, and user-friendly expense management platform that modernizes petty cash workflows while establishing transparency and control over all field-level operational expenses.

## 🌟 Features

### Core Functionality
- **Travel Expense Management**: Transportation, food, accommodation tracking
- **Maintenance Expenses**: Vehicle maintenance, equipment purchases, repairs
- **Requisition Management**: Recurring services, utilities, operational expenses
- **Receipt Management**: Mandatory receipt uploads with validation
- **Approval Workflow**: Multi-level approval system with role-based access
- **Real-time Validation**: Pattern analysis and fraud detection
- **Audit Trail**: Complete tracking of all expense activities

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Real-time)
- **UI Components**: Radix UI, Lucide React
- **Form Management**: React Hook Form, Zod validation
- **Maps Integration**: Google Maps API
- **File Upload**: React Dropzone

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Supabase account

### Installation

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
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://jbkzcjdqbuhgxahhzkno.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Set up the database**
   
   The database schema is already configured. The migration files are located in:
   - `database/migrations/001_expense_schema.sql` - Main schema
   - `database/migrations/002_rls_policies.sql` - Security policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Core Tables
- **expense_users**: User profiles and roles
- **expense_submissions**: Main expense submissions
- **transportation_expenses**: Travel-related expenses
- **food_accommodation_expenses**: Meal and lodging costs
- **maintenance_expenses**: Vehicle and equipment maintenance
- **requisition_expenses**: Services and utilities
- **expense_attachments**: Receipt and document storage
- **expense_approvals**: Approval workflow tracking

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

### Validation Framework
- **Input-level validation**: Real-time field validation
- **Business logic validation**: Policy compliance checking  
- **Fraud detection**: Anomaly detection and pattern analysis
- **Receipt validation**: File type and authenticity checks

## 🎯 User Journey

### Employee Workflow
1. **Login** → Dashboard overview
2. **Create Expense** → Select type (Travel/Maintenance/Requisition)
3. **Fill Details** → Progressive form with validation
4. **Upload Receipts** → Mandatory documentation
5. **Submit** → Automatic validation and routing
6. **Track Status** → Real-time approval progress

### Manager Workflow
1. **Review Submissions** → Team expense overview
2. **Validate Details** → Check compliance and documentation
3. **Approve/Reject** → Provide feedback and decisions
4. **Monitor Budgets** → Track team spending patterns

### Finance Workflow
1. **Final Review** → All approved expenses
2. **Compliance Check** → Policy and audit validation
3. **Process Payment** → Integration with accounting systems
4. **Generate Reports** → Analytics and insights

## 🏗️ Project Structure

```
expenseflow.org/
├── app/                          # Next.js App Router
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── expenses/           # Expense form components
│   │   └── ui/                # Reusable UI components
│   ├── providers/              # Context providers
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── lib/                         # Utilities and configurations
│   └── supabase.ts             # Supabase client and types
├── database/                    # Database migrations
│   └── migrations/             # SQL migration files
├── config.js                   # Application configuration
└── README.md                   # Project documentation
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the migration files in order:
   - `001_expense_schema.sql`
   - `002_rls_policies.sql`
3. Set up authentication providers
4. Configure storage buckets for file uploads

### Google Maps Setup
1. Get a Google Maps API key
2. Enable Places API and Geocoding API
3. Add the key to your environment variables

## 🚦 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Database
npm run db:generate  # Generate TypeScript types from Supabase
```

## 📱 Features by Category

### Travel Expenses
- **Transportation**: Multiple vehicle types and ownership models
- **Route Planning**: GPS integration with Google Maps
- **Cost Breakdown**: Fuel, tolls, base transportation costs
- **Round-trip Support**: Automatic duplication and calculations

### Maintenance Expenses  
- **Categories**: Charges, Purchases, Repairs
- **Equipment Tracking**: Detailed purchase records
- **Service Management**: Contractor and service provider tracking
- **Duration Tracking**: Monthly service periods

### Requisition Management
- **Service Types**: Security, utilities, cleaning, etc.
- **Contract Management**: Third-party service agreements
- **Recurring Expenses**: Automated period tracking

## 🔍 Validation & Compliance

### Multi-Layer Validation
1. **Format Validation**: Data type and format compliance
2. **Business Rules**: Policy and authorization limits
3. **Cross-Reference**: Historical consistency checks
4. **Fraud Detection**: Pattern analysis and anomaly detection

### Audit Requirements
- 100% receipt attachment requirement
- 200+ character business purpose minimum
- Complete location and timing documentation
- Manager and finance approval workflow

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on commits

### Docker Deployment
```bash
# Build Docker image
docker build -t expenseflow .

# Run container
docker run -p 3000:3000 expenseflow
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@expenseflow.org
- Documentation: [docs.expenseflow.org](https://docs.expenseflow.org)

## 🎯 Roadmap

### Phase 1 (Current): Foundation
- ✅ Core expense submission workflow
- ✅ Authentication and authorization
- ✅ Basic validation framework
- ✅ Receipt management

### Phase 2: Enhanced Features
- 🔄 Advanced fraud detection
- 🔄 Mobile app development
- 🔄 Offline capability
- 🔄 Advanced analytics

### Phase 3: Enterprise Features
- 📋 Multi-tenant support
- 📋 Advanced integrations
- 📋 Custom approval workflows
- 📋 Compliance reporting

---

**ExpenseFlow** - Transforming expense management with transparency, efficiency, and control. 