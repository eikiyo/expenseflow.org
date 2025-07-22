/**
 * EXPENSE VALIDATION UTILITIES
 * 
 * This file contains all validation schemas and utilities for expense forms.
 * Uses Zod for type-safe validation with detailed error messages.
 * 
 * Dependencies: zod
 * Used by: All expense form components and providers
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { z } from 'zod'
import type { TravelExpense, MaintenanceExpense, RequisitionExpense } from '../types/expense'

// Shared schemas for reusable validation
const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
})

const attachmentSchema = z.object({
  fileName: z.string(),
  filePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  description: z.string().optional(),
  uploadedAt: z.date()
})

// Base expense validation schema
const baseExpenseSchema = z.object({
  type: z.enum(['travel', 'maintenance', 'requisition']),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  totalAmount: z.number()
    .positive('Amount must be greater than 0')
    .max(1000000, 'Amount exceeds maximum limit'),
  currency: z.string().default('BDT'),
  businessPurpose: z.string()
    .min(200, 'Business purpose must be at least 200 characters')
    .max(2000, 'Business purpose cannot exceed 2000 characters'),
  attachments: z.array(z.instanceof(File)).optional(),
  submittedAt: z.date().optional(),
  status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected']).optional()
})

// Travel expense validation schema
export const travelExpenseSchema = baseExpenseSchema.extend({
  type: z.literal('travel'),
  startDate: z.date(),
  endDate: z.date(),
  startLocation: locationSchema,
  endLocation: locationSchema,
  transportationType: z.enum(['van', 'rickshaw', 'boat', 'cng', 'train', 'plane', 'launch', 'ferry', 'bike', 'car']),
  vehicleOwnership: z.enum(['own', 'rental', 'public']),
  roundTrip: z.boolean(),
  mileage: z.number().min(0).optional(),
  fuelCost: z.number().min(0).optional(),
  tollCharges: z.number().min(0).optional(),
  accommodationCost: z.number().min(0).optional(),
  perDiemRate: z.number().min(0).optional(),
  vehicleDetails: z.object({
    model: z.string().optional(),
    licensePlate: z.string().optional(),
    fuelType: z.string().optional(),
    odometerStart: z.number().optional(),
    odometerEnd: z.number().optional()
  }).optional()
}).refine(
  (data) => data.endDate >= data.startDate,
  { message: 'End date must be after start date', path: ['endDate'] }
)

// Maintenance expense validation schema
export const maintenanceExpenseSchema = baseExpenseSchema.extend({
  type: z.literal('maintenance'),
  serviceDate: z.date(),
  category: z.enum(['charges', 'purchases', 'repairs']),
  subCategory: z.string().min(1, 'Sub-category is required'),
  vehicleType: z.string().optional(),
  equipmentPurchased: z.string().optional(),
  vendorName: z.string().optional(),
  invoiceNumber: z.string().optional(),
  warrantyApplicable: z.boolean().optional(),
  assetId: z.string().optional()
})

// Requisition expense validation schema
export const requisitionExpenseSchema = baseExpenseSchema.extend({
  type: z.literal('requisition'),
  serviceType: z.string().min(1, 'Service type is required'),
  subType: z.string().min(1, 'Sub-type is required'),
  duration: z.string().min(1, 'Duration is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  requiredBy: z.string().min(1, 'Required by is required'),
  quantity: z.number().positive('Quantity must be greater than 0').optional(),
  unitPrice: z.number().positive('Unit price must be greater than 0').optional(),
  preferredVendor: z.string().optional(),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'urgent'])
})

// Validation function for any expense type
export function validateExpense(expense: TravelExpense | MaintenanceExpense | RequisitionExpense) {
  const { type } = expense

  switch (type) {
    case 'travel':
      return travelExpenseSchema.safeParse(expense)
    case 'maintenance':
      return maintenanceExpenseSchema.safeParse(expense)
    case 'requisition':
      return requisitionExpenseSchema.safeParse(expense)
    default:
      throw new Error(`Unknown expense type: ${type}`)
  }
}

// Helper to format validation errors
export function formatValidationErrors(result: z.SafeParseError<any>) {
  return Object.fromEntries(
    result.error.issues.map(issue => [
      issue.path.join('.'),
      issue.message
    ])
  )
} 