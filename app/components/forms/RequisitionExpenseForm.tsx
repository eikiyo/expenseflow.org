/**
 * REQUISITION EXPENSE FORM
 * 
 * This component handles requisition expense form submission.
 * Uses form components with requisition-specific fields.
 * 
 * Dependencies: FormFields, validation
 * Used by: Requisition expense flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, DateField, SelectField, TextareaField } from './FormFields'
import { requisitionExpenseSchema } from '@/app/utils/validation'
import type { RequisitionExpense } from '@/app/types/expense'

const categoryOptions = [
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'it_equipment', label: 'IT Equipment' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'tools', label: 'Tools' },
  { value: 'safety_equipment', label: 'Safety Equipment' },
  { value: 'other', label: 'Other' }
]

const urgencyOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

interface RequisitionExpenseFormProps {
  onSubmit: (data: RequisitionExpense) => void
  initialData?: Partial<RequisitionExpense>
}

export function RequisitionExpenseForm({ onSubmit, initialData }: RequisitionExpenseFormProps) {
  const today = new Date().toISOString().split('T')[0]
  const minRequiredDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now

  const methods = useForm<RequisitionExpense>({
    resolver: zodResolver(requisitionExpenseSchema),
    defaultValues: {
      type: 'requisition',
      serviceType: 'office_supplies',
      subType: '',
      duration: '',
      frequency: '',
      description: '',
      totalAmount: 0,
      currency: 'BDT',
      businessPurpose: '',
      requiredBy: minRequiredDate,
      quantity: 1,
      unitPrice: 0,
      urgencyLevel: 'low',
      preferredVendor: '',
      ...initialData
    }
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmit(data as RequisitionExpense))} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DateField
            name="requiredBy"
            label="Required By"
            required
            min={minRequiredDate}
          />

          <SelectField
            name="serviceType"
            label="Service Type"
            required
            options={categoryOptions}
          />

          <TextField
            name="subType"
            label="Sub Type"
            required
            placeholder="Enter sub type"
          />

          <TextField
            name="duration"
            label="Duration"
            required
            placeholder="e.g., 1 month, 6 months"
          />

          <TextField
            name="frequency"
            label="Frequency"
            required
            placeholder="e.g., daily, weekly, monthly"
          />

          <TextField
            name="quantity"
            label="Quantity"
            type="number"
            min={1}
            step={1}
            placeholder="Enter quantity needed"
          />

          <TextField
            name="unitPrice"
            label="Unit Price"
            type="number"
            min={0}
            step={0.01}
            placeholder="Enter price per unit"
          />

          <TextField
            name="preferredVendor"
            label="Preferred Vendor"
            placeholder="Enter preferred vendor if any"
          />

          <SelectField
            name="urgencyLevel"
            label="Urgency Level"
            required
            options={urgencyOptions}
          />

          <TextField
            name="totalAmount"
            label="Total Amount"
            type="number"
            required
            min={0}
            step={0.01}
            placeholder="Enter total expense amount"
            className="md:col-span-2"
          />

          <TextareaField
            name="description"
            label="Description"
            required
            placeholder="Enter requisition description"
            className="md:col-span-2"
          />

          <TextareaField
            name="businessPurpose"
            label="Business Purpose"
            required
            placeholder="Please provide a detailed business purpose for this requisition (minimum 200 characters)..."
            className="md:col-span-2"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </FormProvider>
  )
} 