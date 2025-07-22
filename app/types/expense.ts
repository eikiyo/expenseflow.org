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

// Database record types (matches the new simplified schema)
export interface ExpenseRecord {
  id: string
  user_id: string
  expense_type: 'travel' | 'maintenance' | 'requisition'
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'in_review'
  description: string | null
  total_amount: number
  currency: string
  submission_data: ExpenseData
  created_at: string
  updated_at: string
}

export interface AttachmentRecord {
  id: string
  expense_id: string
  file_name: string
  file_path: string
  file_size: number | null
  file_type: string | null
  uploaded_at: string
}

export interface ApprovalRecord {
  id: string
  submission_id: string
  approver_id: string
  status: 'approved' | 'rejected'
  comments: string | null
  created_at: string | null
}

// JSON data structures for expense_data field
export interface TravelExpenseData {
  transport_method: 'van' | 'rickshaw' | 'boat' | 'cng' | 'train' | 'plane' | 'launch' | 'ferry' | 'bike' | 'car'
  start_location: string
  end_location: string
  departure_date: string
  return_date: string
  vehicle_ownership: 'own' | 'rental' | 'public'
  round_trip: boolean
  business_purpose: string
  vehicle_details?: {
    model?: string
    license_plate?: string
    fuel_type?: string
    odometer_start?: number
    odometer_end?: number
  }
  costs: {
    base_cost: number
    fuel_cost?: number
    toll_charges?: number
    accommodation_cost?: number
    per_diem_rate?: number
  }
}

export interface MaintenanceExpenseData {
  category: 'charges' | 'purchases' | 'repairs'
  sub_category: string
  service_date: string
  business_purpose: string
  vendor?: string
  equipment?: Array<{
    name: string
    quantity: number
    cost: number
  }>
  vehicle_details?: {
    model?: string
    service_type?: string
    asset_id?: string
  }
  warranty_applicable?: boolean
  invoice_number?: string
}

export interface RequisitionExpenseData {
  service_type: string
  sub_type: string
  duration: string
  frequency: string
  required_by: string
  business_purpose: string
  quantity?: number
  unit_price?: number
  preferred_vendor?: string
  urgency_level: 'low' | 'medium' | 'high' | 'urgent'
  specifications?: string
}

export type ExpenseData = TravelExpenseData | MaintenanceExpenseData | RequisitionExpenseData

// Frontend form types (keep existing for backward compatibility)
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

// Utility functions for converting between frontend and database types
export function convertExpenseFormToRecord(
  formData: ExpenseFormData,
  userId: string
): Omit<ExpenseRecord, 'id' | 'expense_number' | 'created_at' | 'updated_at'> {
  const baseRecord = {
    user_id: userId,
    type: formData.type,
    status: 'draft' as const,
    title: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Expense`,
    description: formData.description,
    total_amount: formData.totalAmount,
    currency: formData.currency,
    business_purpose: formData.businessPurpose,
    submitted_at: null,
    approved_at: null,
    approver_id: null,
    approval_notes: null
  }

  let expense_data: ExpenseData

  switch (formData.type) {
    case 'travel':
      expense_data = {
        transport_method: formData.transportationType,
        start_location: formData.startLocation.address,
        end_location: formData.endLocation.address,
        departure_date: formData.startDate.toISOString().split('T')[0],
        return_date: formData.endDate.toISOString().split('T')[0],
        vehicle_ownership: formData.vehicleOwnership,
        round_trip: formData.roundTrip,
        business_purpose: formData.businessPurpose,
        vehicle_details: formData.vehicleDetails ? {
          model: formData.vehicleDetails.model,
          license_plate: formData.vehicleDetails.licensePlate,
          fuel_type: formData.vehicleDetails.fuelType,
          odometer_start: formData.vehicleDetails.odometerStart,
          odometer_end: formData.vehicleDetails.odometerEnd
        } : undefined,
        costs: {
          base_cost: formData.totalAmount,
          fuel_cost: formData.fuelCost,
          toll_charges: formData.tollCharges,
          accommodation_cost: formData.accommodationCost,
          per_diem_rate: formData.perDiemRate
        }
      }
      break

    case 'maintenance':
      expense_data = {
        category: formData.category,
        sub_category: formData.subCategory,
        service_date: formData.serviceDate.toISOString().split('T')[0],
        business_purpose: formData.businessPurpose,
        vendor: formData.vendorName,
        vehicle_details: {
          model: formData.vehicleType,
          asset_id: formData.assetId
        },
        warranty_applicable: formData.warrantyApplicable,
        invoice_number: formData.invoiceNumber
      }
      break

    case 'requisition':
      expense_data = {
        service_type: formData.serviceType,
        sub_type: formData.subType,
        duration: formData.duration,
        frequency: formData.frequency,
        required_by: formData.requiredBy,
        business_purpose: formData.businessPurpose,
        quantity: formData.quantity,
        unit_price: formData.unitPrice,
        preferred_vendor: formData.preferredVendor,
        urgency_level: formData.urgencyLevel
      }
      break
  }

  return {
    ...baseRecord,
    expense_data
  }
}

export function convertExpenseRecordToForm(
  record: ExpenseRecord
): ExpenseFormData {
  const baseForm = {
    id: record.id,
    type: record.type,
    description: record.description,
    totalAmount: record.total_amount,
    currency: record.currency,
    businessPurpose: record.expense_data.business_purpose || '',
    status: record.status,
    submittedAt: record.submitted_at ? new Date(record.submitted_at) : undefined
  }

  switch (record.type) {
    case 'travel':
      const travelData = record.expense_data as TravelExpenseData
      return {
        ...baseForm,
        type: 'travel',
        startDate: new Date(travelData.departure_date),
        endDate: new Date(travelData.return_date),
        startLocation: { address: travelData.start_location },
        endLocation: { address: travelData.end_location },
        transportationType: travelData.transport_method,
        vehicleOwnership: travelData.vehicle_ownership,
        roundTrip: travelData.round_trip,
        fuelCost: travelData.costs.fuel_cost,
        tollCharges: travelData.costs.toll_charges,
        accommodationCost: travelData.costs.accommodation_cost,
        perDiemRate: travelData.costs.per_diem_rate,
        vehicleDetails: travelData.vehicle_details ? {
          model: travelData.vehicle_details.model,
          licensePlate: travelData.vehicle_details.license_plate,
          fuelType: travelData.vehicle_details.fuel_type,
          odometerStart: travelData.vehicle_details.odometer_start,
          odometerEnd: travelData.vehicle_details.odometer_end
        } : undefined
      } as TravelExpense

    case 'maintenance':
      const maintenanceData = record.expense_data as MaintenanceExpenseData
      return {
        ...baseForm,
        type: 'maintenance',
        serviceDate: new Date(maintenanceData.service_date),
        category: maintenanceData.category,
        subCategory: maintenanceData.sub_category,
        vehicleType: maintenanceData.vehicle_details?.model,
        vendorName: maintenanceData.vendor,
        invoiceNumber: maintenanceData.invoice_number,
        warrantyApplicable: maintenanceData.warranty_applicable,
        assetId: maintenanceData.vehicle_details?.asset_id
      } as MaintenanceExpense

    case 'requisition':
      const requisitionData = record.expense_data as RequisitionExpenseData
      return {
        ...baseForm,
        type: 'requisition',
        serviceType: requisitionData.service_type,
        subType: requisitionData.sub_type,
        duration: requisitionData.duration,
        frequency: requisitionData.frequency,
        requiredBy: requisitionData.required_by,
        quantity: requisitionData.quantity,
        unitPrice: requisitionData.unit_price,
        preferredVendor: requisitionData.preferred_vendor,
        urgencyLevel: requisitionData.urgency_level
      } as RequisitionExpense
  }
} 