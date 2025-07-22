/**
 * MAINTENANCE EXPENSE FORM
 * 
 * This component handles maintenance expense form submission.
 * Uses base form components with maintenance-specific fields.
 * 
 * Dependencies: BaseExpenseForm, FormFields, validation
 * Used by: Maintenance expense flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { BaseExpenseForm } from './BaseExpenseForm'
import { TextField, DateField, SelectField, TextareaField, CheckboxField } from './FormFields'
import { maintenanceExpenseSchema } from '@/app/utils/validation'
import { MaintenanceCategory } from '@/app/types/expense'
import { format } from 'date-fns'

const categoryOptions = Object.entries(MaintenanceCategory).map(([key, value]) => ({
  value,
  label: key.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}))

interface MaintenanceExpenseFormProps {
  onSubmit?: (data: any) => Promise<void>
  defaultValues?: any
}

export function MaintenanceExpenseForm({ onSubmit, defaultValues }: MaintenanceExpenseFormProps) {
  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <BaseExpenseForm
      schema={maintenanceExpenseSchema}
      onSubmit={onSubmit}
      defaultValues={{
        type: 'maintenance',
        serviceDate: today,
        warrantyApplicable: false,
        ...defaultValues
      }}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DateField
          name="serviceDate"
          label="Service Date"
          required
          min={today}
        />

        <SelectField
          name="category"
          label="Maintenance Category"
          required
          options={categoryOptions}
        />

        <TextField
          name="assetId"
          label="Asset ID"
          placeholder="Enter asset ID if applicable"
        />

        <TextField
          name="vendorName"
          label="Vendor Name"
          required
          placeholder="Enter vendor name"
        />

        <TextField
          name="invoiceNumber"
          label="Invoice Number"
          placeholder="Enter invoice number"
        />

        <CheckboxField
          name="warrantyApplicable"
          label="Warranty Applicable"
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
          placeholder="Enter maintenance description"
          className="md:col-span-2"
        />
      </div>
    </BaseExpenseForm>
  )
} 