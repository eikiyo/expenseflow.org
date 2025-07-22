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
import { TransportationType, MaintenanceCategory, RequisitionCategory, UrgencyLevel } from '../types/expense'

// Shared schemas for reusable validation
const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

const attachmentSchema = z.object({
  fileUrl: z.string().url('Invalid file URL'),
  fileName: z.string(),
  fileType: z.string(),
  uploadedAt: z.date()
})

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  userId: z.string(),
  createdAt: z.date()
})

// Base expense validation schema
const baseExpenseSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  totalAmount: z.number()
    .positive('Amount must be greater than 0')
    .max(1000000, 'Amount exceeds maximum limit'),
  currency: z.string().min(1, 'Currency is required'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  attachments: z.array(attachmentSchema).optional(),
  comments: z.array(commentSchema).optional()
})

// Travel expense validation schema
export const travelExpenseSchema = baseExpenseSchema.extend({
  type: z.literal('travel'),
  startDate: z.date(),
  endDate: z.date(),
  startLocation: locationSchema,
  endLocation: locationSchema,
  transportationType: z.nativeEnum(TransportationType),
  mileage: z.number().min(0).optional(),
  fuelCost: z.number().min(0).optional(),
  tollCharges: z.number().min(0).optional(),
  accommodationCost: z.number().min(0).optional(),
  perDiemRate: z.number().min(0).optional()
}).refine(
  (data) => data.endDate >= data.startDate,
  { message: 'End date must be after start date', path: ['endDate'] }
)

// Maintenance expense validation schema
export const maintenanceExpenseSchema = baseExpenseSchema.extend({
  type: z.literal('maintenance'),
  serviceDate: z.date(),
  category: z.nativeEnum(MaintenanceCategory),
  assetId: z.string().optional(),
  vendorName: z.string().min(1, 'Vendor name is required'),
  invoiceNumber: z.string().optional(),
  warrantyApplicable: z.boolean()
})

// Requisition expense validation schema
export const requisitionExpenseSchema = baseExpenseSchema.extend({
  type: z.literal('requisition'),
  requiredBy: z.date(),
  category: z.nativeEnum(RequisitionCategory),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().positive('Unit price must be greater than 0'),
  preferredVendor: z.string().optional(),
  urgencyLevel: z.nativeEnum(UrgencyLevel)
})

// Validation function for any expense type
export function validateExpense(expense: any) {
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