# ExpenseFlow - Detailed Task Breakdown

## 🎯 **PHASE 1: AUTHENTICATION SYSTEM**

### **Task 1.1: Replace Fake Authentication** ✅ **COMPLETED**
- [x] Remove hardcoded TEST_USER from lib/supabase.ts
- [x] Remove fake password "123" logic from signInWithEmail function
- [x] Create proper Supabase auth integration (Google OAuth)
- [x] Update signOut function to use real Supabase signOut
- [x] Update getCurrentUser to fetch from actual session
- [x] Replace email login form with Google authentication in main page
- [x] Consolidate conflicting authentication implementations
- [x] Remove duplicate user state management

### **Task 1.2: User Profile Integration** ⏳ **IN PROGRESS**
- [x] Replace getUserProfile hardcoded return with real database query
- [x] Add error handling for getUserProfile database calls
- [x] Update UserProfile component to load real user data from API
- [x] Add loading states to UserProfile component
- [ ] Create API endpoint: GET /api/users/profile
- [ ] Connect UserProfile form fields to update database

### **Task 1.3: Role-Based Access Control**
- [ ] Add role checking middleware for API routes
- [ ] Implement role-based navigation hiding/showing
- [ ] Add role validation to PendingApprovals component (only managers/finance)
- [ ] Add role validation to user management features
- [ ] Create useAuth hook for components to check roles

### **Task 1.4: Protected Routes**
- [x] Create route protection wrapper component (via useAuth)
- [x] Add authentication check to main dashboard
- [x] Redirect unauthenticated users to login
- [x] Add loading spinner during authentication checks
- [x] Handle authentication errors gracefully

---

## 🎯 **PHASE 2: FORM SUBMISSION SYSTEM**

### **Task 2.1: Travel Form Backend**
- [ ] Create API endpoint: POST /api/expenses/travel
- [ ] Add request validation using Zod schema for travel data
- [ ] Create database insert function for transportation_expenses table
- [ ] Create database insert function for food_accommodation_expenses table
- [ ] Connect TravelFlow "Continue to Review" button to save draft
- [ ] Connect ReviewSubmission "Submit" button to POST /api/expenses/travel

### **Task 2.2: Maintenance Form Backend**
- [ ] Create API endpoint: POST /api/expenses/maintenance
- [ ] Add request validation using Zod schema for maintenance data
- [ ] Create database insert function for maintenance_expenses table
- [ ] Create database insert function for maintenance_equipment table
- [ ] Connect MaintenanceFlow "Continue to Review" button to save draft
- [ ] Connect ReviewSubmission "Submit" button to POST /api/expenses/maintenance

### **Task 2.3: Requisition Form Backend**
- [ ] Create API endpoint: POST /api/expenses/requisition
- [ ] Add request validation using Zod schema for requisition data
- [ ] Create database insert function for requisition_expenses table
- [ ] Connect RequisitionFlow "Continue to Documentation" button to save draft
- [ ] Connect ReviewSubmission "Submit" button to POST /api/expenses/requisition

### **Task 2.4: Form State Management**
- [ ] Add form state persistence in TravelFlow component
- [ ] Add form state persistence in MaintenanceFlow component
- [ ] Add form state persistence in RequisitionFlow component
- [ ] Add auto-save functionality every 30 seconds
- [ ] Add form recovery after page refresh
- [ ] Add progress tracking across form steps

---

## 🎯 **PHASE 3: FILE UPLOAD SYSTEM**

### **Task 3.1: File Upload Infrastructure**
- [ ] Create API endpoint: POST /api/files/upload
- [ ] Set up Supabase Storage bucket for receipts
- [ ] Add file type validation (PNG, JPG, PDF only)
- [ ] Add file size validation (5MB limit)
- [ ] Create secure file URL generation

### **Task 3.2: Receipt Upload Integration**
- [ ] Connect all "Choose Files" buttons to file upload API
- [ ] Add file upload progress indicators
- [ ] Add file preview functionality
- [ ] Add file removal functionality
- [ ] Store file references in expense_attachments table
- [ ] Display uploaded files in review screens

### **Task 3.3: File Processing**
- [ ] Add basic image optimization on upload
- [ ] Create file metadata extraction
- [ ] Add virus scanning for uploaded files
- [ ] Create file backup system
- [ ] Add file compression for large images

---

## 🎯 **PHASE 4: VALIDATION ENGINE**

### **Task 4.1: Input Validation**
- [ ] Add real-time validation to all number inputs
- [ ] Add date range validation (start < end dates)
- [ ] Add business purpose minimum 200 character validation
- [ ] Add odometer reading consistency checks
- [ ] Add cost field positive number validation
- [ ] Display validation errors immediately in UI

### **Task 4.2: Business Rule Validation**
- [ ] Add expense amount vs budget limit checking
- [ ] Add expense amount vs single transaction limit checking
- [ ] Add submission frequency validation (prevent spam)
- [ ] Add date validation (no future dates for completed trips)
- [ ] Add vehicle registration validation against user profile

### **Task 4.3: Employee Profile Validation**
- [ ] Load employee monthly budget from database
- [ ] Check current month spending vs budget
- [ ] Load employee vehicle information for validation
- [ ] Validate expense categories against employee role
- [ ] Add manager approval requirement based on amount

---

## 🎯 **PHASE 5: GOOGLE MAPS INTEGRATION**

### **Task 5.1: Maps API Setup**
- [ ] Get Google Maps API key and add to config
- [ ] Install Google Maps JavaScript API loader
- [ ] Create Maps wrapper component
- [ ] Add Maps API error handling

### **Task 5.2: Location Services**
- [ ] Replace location input placeholder icons with real map pins
- [ ] Add Google Places autocomplete to start/end location fields
- [ ] Add current location detection using GPS
- [ ] Store GPS coordinates in database (start_coordinates, end_coordinates)
- [ ] Add location validation (ensure valid addresses)

### **Task 5.3: Route Calculation**
- [ ] Add distance calculation between start/end points
- [ ] Display calculated distance in UI
- [ ] Add route visualization on map
- [ ] Validate odometer readings against calculated distance
- [ ] Add toll road detection and cost estimation

---

## 🎯 **PHASE 6: APPROVAL WORKFLOW**

### **Task 6.1: Manager Approval**
- [ ] Create API endpoint: GET /api/approvals/pending (for managers)
- [ ] Connect PendingApprovals component to real data
- [ ] Create API endpoint: POST /api/approvals/approve
- [ ] Create API endpoint: POST /api/approvals/reject
- [ ] Connect "Approve" and "Reject" buttons to APIs
- [ ] Add bulk approval functionality

### **Task 6.2: Finance Approval**
- [ ] Add second-level approval for high-amount expenses
- [ ] Create finance team approval interface
- [ ] Add automatic routing based on expense amount
- [ ] Create approval history tracking
- [ ] Add approval notification system

### **Task 6.3: Notification System**
- [ ] Send email notifications to managers for new submissions
- [ ] Send email notifications to employees for approval/rejection
- [ ] Add in-app notification system
- [ ] Create notification preferences
- [ ] Add urgent expense flagging

---

## 🎯 **PHASE 7: DASHBOARD & ANALYTICS**

### **Task 7.1: Employee Dashboard**
- [ ] Connect MonthlyExpenses component to real expense data
- [ ] Create API endpoint: GET /api/expenses/monthly
- [ ] Add real expense history to expense cards
- [ ] Add expense status tracking
- [ ] Create budget vs spending charts

### **Task 7.2: Manager Dashboard**
- [ ] Create team expense overview
- [ ] Add team member expense tracking
- [ ] Create approval queue dashboard
- [ ] Add team budget monitoring
- [ ] Create expense trend analysis

### **Task 7.3: Reporting System**
- [ ] Create expense export functionality
- [ ] Add PDF report generation
- [ ] Create monthly expense reports
- [ ] Add expense category breakdown
- [ ] Create audit trail reports

---

## 🎯 **PHASE 8: SECURITY & OPTIMIZATION**

### **Task 8.1: Security Implementation**
- [ ] Remove exposed database credentials from config files
- [ ] Add input sanitization to all API endpoints
- [ ] Implement rate limiting on API calls
- [ ] Add CSRF protection
- [ ] Add SQL injection protection

### **Task 8.2: Performance Optimization**
- [ ] Add database query optimization
- [ ] Implement API response caching
- [ ] Add image optimization for uploads
- [ ] Create database connection pooling
- [ ] Add lazy loading for components

### **Task 8.3: Error Handling**
- [ ] Add comprehensive error handling to all API endpoints
- [ ] Create user-friendly error messages
- [ ] Add error logging system
- [ ] Create error recovery mechanisms
- [ ] Add offline functionality

---

## 🎯 **TASK PRIORITIZATION STRATEGY**

1. **✅ COMPLETED: Phase 1, Task 1.1** (Replace Fake Authentication)
2. **⏳ CURRENT: Phase 1, Task 1.2** (User Profile Integration) - 67% Complete
3. **Next: Phase 1, Task 1.3** (Role-Based Access Control)
4. **Complete each task fully before moving to next**
5. **Test each task thoroughly before marking complete**
6. **Keep existing UI/UX exactly as designed**
7. **Focus on backend functionality to make frontend work**

**Current Status: 11/85 tasks completed**

**Estimated Timeline: 8-12 weeks for complete implementation**