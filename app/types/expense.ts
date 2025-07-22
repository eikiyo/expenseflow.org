/**
 * EXPENSE TYPE DEFINITIONS
 * 
 * This file contains TypeScript interfaces for all expense-related data structures.
 * Provides type safety for expense forms, submissions, and API responses.
 * 
 * Dependencies: None
 * Used by: All expense components and services
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

// Base expense interface
export interface BaseExpense {
  id?: string
  type: 'travel' | 'maintenance' | 'requisition'
  description: string
  totalAmount: number
  currency: string
  businessPurpose: string
  attachments?: File[]
  submittedAt?: Date
  status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
}

// Travel expense specific fields
export interface TravelExpense extends BaseExpense {
  type: 'travel'
  startDate: Date
  endDate: Date
  startLocation: {
    address: string
    coordinates?: { lat: number; lng: number }
  }
  endLocation: {
    address: string
    coordinates?: { lat: number; lng: number }
  }
  transportationType: 'van' | 'rickshaw' | 'boat' | 'cng' | 'train' | 'plane' | 'launch' | 'ferry' | 'bike' | 'car'
  vehicleOwnership: 'own' | 'rental' | 'public'
  roundTrip: boolean
  mileage?: number
  fuelCost?: number
  tollCharges?: number
  accommodationCost?: number
  perDiemRate?: number
  vehicleDetails?: {
    model?: string
    licensePlate?: string
    fuelType?: string
    odometerStart?: number
    odometerEnd?: number
  }
}

// Maintenance expense specific fields
export interface MaintenanceExpense extends BaseExpense {
  type: 'maintenance'
  serviceDate: Date
  category: 'charges' | 'purchases' | 'repairs'
  subCategory: string
  vehicleType?: string
  equipmentPurchased?: string
  vendorName?: string
  invoiceNumber?: string
  warrantyApplicable?: boolean
  assetId?: string
}

// Requisition expense specific fields
export interface RequisitionExpense extends BaseExpense {
  type: 'requisition'
  serviceType: string
  subType: string
  duration: string
  frequency: string
  requiredBy: string
  quantity?: number
  unitPrice?: number
  preferredVendor?: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent'
}

// Union type for all expense types
export type ExpenseFormData = TravelExpense | MaintenanceExpense | RequisitionExpense

// Form validation state
export interface FormValidationState {
  isValid: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

// Expense submission state
export interface ExpenseSubmissionState {
  loading: boolean
  error: string | null
  success: boolean
}

// Expense approval interface
export interface ExpenseApproval {
  id: string
  expenseId: string
  approverId: string
  approvalLevel: number
  action: 'approve' | 'reject'
  comments?: string
  approvedAt?: Date
}

// Expense attachment interface
export interface ExpenseAttachment {
  id: string
  fileName: string
  filePath: string
  fileType: string
  fileSize: number
  description?: string
  uploadedAt: Date
}

// Expense audit log interface
export interface ExpenseAuditLog {
  id: string
  userId: string
  action: string
  tableName: string
  recordId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
} 