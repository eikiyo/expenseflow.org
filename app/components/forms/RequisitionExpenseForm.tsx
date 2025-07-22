/**
 * REQUISITION EXPENSE FORM
 * 
 * This component handles requisition expense form submission.
 * Uses base form components with requisition-specific fields.
 * 
 * Dependencies: BaseExpenseForm, FormFields, validation
 * Used by: Requisition expense flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { BaseExpenseForm } from './BaseExpenseForm'
import { TextField, DateField, SelectField, TextareaField } from './FormFields'
import { requisitionExpenseSchema } from '@/app/utils/validation'
import { RequisitionCategory, UrgencyLevel } from '@/app/types/expense'
import { format } from 'date-fns'

const categoryOptions = Object.entries(RequisitionCategory).map(([key, value]) => ({
  value,
  label: key.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}))

const urgencyOptions = Object.entries(UrgencyLevel).map(([key, value]) => ({
  value,
  label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
}))

interface RequisitionExpenseFormProps {
  onSubmit?: (data: any) => Promise<void>
  defaultValues?: any
}

export function RequisitionExpenseForm({ onSubmit, defaultValues }: RequisitionExpenseFormProps) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const minRequiredDate = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') // 7 days from now

  return (
    <BaseExpenseForm
      schema={requisitionExpenseSchema}
      onSubmit={onSubmit}
      defaultValues={{
        type: 'requisition',
        requiredBy: minRequiredDate,
        quantity: 1,
        urgencyLevel: UrgencyLevel.LOW,
        ...defaultValues
      }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DateField
          name="requiredBy"
          label="Required By"
          required
          min={minRequiredDate}
        />

        <SelectField
          name="category"
          label="Requisition Category"
          required
          options={categoryOptions}
        />

        <TextField
          name="quantity"
          label="Quantity"
          type="number"
          required
          min={1}
          step={1}
          placeholder="Enter quantity needed"
        />

        <TextField
          name="unitPrice"
          label="Unit Price"
          type="number"
          required
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
          placeholder="Enter requisition description and justification"
          className="md:col-span-2"
        />
      </div>
    </BaseExpenseForm>
  )
} 