/**
 * EXPENSE TYPE DEFINITIONS
 * 
 * This file contains all TypeScript interfaces for expense types and related entities.
 * It provides type safety and documentation for expense data throughout the application.
 * 
 * Dependencies: None
 * Used by: All expense-related components and services
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

// Base expense interface with common fields for all expense types
export interface BaseExpense {
  id?: string
  userId: string
  status: ExpenseStatus
  submittedAt?: Date
  updatedAt?: Date
  totalAmount: number
  currency: string
  description: string
  attachments?: ExpenseAttachment[]
  comments?: ExpenseComment[]
}

// Travel expense specific fields
export interface TravelExpense extends BaseExpense {
  type: 'travel'
  startDate: Date
  endDate: Date
  startLocation: Location
  endLocation: Location
  transportationType: TransportationType
  mileage?: number
  fuelCost?: number
  tollCharges?: number
  accommodationCost?: number
  perDiemRate?: number
}

// Maintenance expense specific fields
export interface MaintenanceExpense extends BaseExpense {
  type: 'maintenance'
  serviceDate: Date
  category: MaintenanceCategory
  assetId?: string
  vendorName: string
  invoiceNumber?: string
  warrantyApplicable: boolean
}

// Requisition expense specific fields
export interface RequisitionExpense extends BaseExpense {
  type: 'requisition'
  requiredBy: Date
  category: RequisitionCategory
  quantity: number
  unitPrice: number
  preferredVendor?: string
  urgencyLevel: UrgencyLevel
}

// Supporting interfaces
export interface Location {
  address: string
  latitude?: number
  longitude?: number
}

export interface ExpenseAttachment {
  id?: string
  expenseId: string
  fileUrl: string
  fileName: string
  fileType: string
  uploadedAt: Date
}

export interface ExpenseComment {
  id?: string
  expenseId: string
  userId: string
  content: string
  createdAt: Date
}

// Enums
export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REIMBURSED = 'reimbursed'
}

export enum TransportationType {
  PERSONAL_CAR = 'personal_car',
  RENTAL_CAR = 'rental_car',
  TAXI = 'taxi',
  BUS = 'bus',
  TRAIN = 'train',
  FLIGHT = 'flight'
}

export enum MaintenanceCategory {
  REPAIRS = 'repairs',
  SERVICING = 'servicing',
  REPLACEMENT = 'replacement',
  UPGRADE = 'upgrade'
}

export enum RequisitionCategory {
  OFFICE_SUPPLIES = 'office_supplies',
  EQUIPMENT = 'equipment',
  SOFTWARE = 'software',
  SERVICES = 'services'
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Form state interfaces
export interface ExpenseFormState {
  currentStep: number
  expense: TravelExpense | MaintenanceExpense | RequisitionExpense
  isDirty: boolean
  errors: Record<string, string>
  lastSaved?: Date
}

export type ExpenseFormAction = 
  | { type: 'SET_EXPENSE'; payload: Partial<TravelExpense | MaintenanceExpense | RequisitionExpense> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'MARK_SAVED'; payload: Date }
  | { type: 'RESET_FORM' } 