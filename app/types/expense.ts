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

export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface ExpenseAttachment {
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: Date;
}

export interface ExpenseComment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

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
  RIDE_SHARE = 'ride_share',
  PUBLIC_TRANSPORT = 'public_transport',
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

export interface BaseExpense {
  id?: string;
  userId: string;
  status: ExpenseStatus;
  submittedAt?: Date;
  updatedAt?: Date;
  totalAmount: number;
  currency: string;
  description: string;
  attachments?: ExpenseAttachment[];
  comments?: ExpenseComment[];
}

export interface TravelExpense extends BaseExpense {
  type: 'travel';
  startDate: Date;
  endDate: Date;
  startLocation: Location;
  endLocation: Location;
  transportationType: TransportationType;
  distance?: number;
  mileageRate?: number;
  fuelCost?: number;
  tollCharges?: number;
  parkingFees?: number;
  accommodationCost?: number;
  perDiemRate?: number;
}

export interface MaintenanceExpense extends BaseExpense {
  type: 'maintenance';
  serviceDate: Date;
  category: MaintenanceCategory;
  assetId: string;
  vendorName: string;
  invoiceNumber?: string;
  warrantyApplicable: boolean;
  warrantyDetails?: string;
  nextServiceDate?: Date;
}

export interface RequisitionExpense extends BaseExpense {
  type: 'requisition';
  category: RequisitionCategory;
  requiredBy: Date;
  quantity: number;
  unitPrice: number;
  preferredVendor?: string;
  urgencyLevel: UrgencyLevel;
  justification: string;
  alternatives?: string;
}

export type Expense = TravelExpense | MaintenanceExpense | RequisitionExpense;

export interface ExpenseFormState {
  expense: Expense;
  isDirty: boolean;
  currentStep: number;
  errors: Record<string, string>;
  lastSaved?: Date;
}

export type ExpenseFormAction =
  | { type: 'SET_EXPENSE'; payload: Partial<Expense> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'MARK_SAVED'; payload: Date }
  | { type: 'RESET_FORM' }; 