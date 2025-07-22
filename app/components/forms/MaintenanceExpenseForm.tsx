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

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { maintenanceExpenseSchema } from '@/app/utils/validation'
import type { MaintenanceExpense } from '@/app/types/expense'
import { TextField, DateField, SelectField, TextareaField, CheckboxField } from './FormFields'
import { format } from 'date-fns'

const categoryOptions = [
  { value: 'charges', label: 'Charges' },
  { value: 'purchases', label: 'Purchases' },
  { value: 'repairs', label: 'Repairs' }
]

const subCategoryOptions = {
  charges: [
    { value: 'fuel', label: 'Fuel' },
    { value: 'oil', label: 'Oil' },
    { value: 'lubricants', label: 'Lubricants' },
    { value: 'other_charges', label: 'Other Charges' }
  ],
  purchases: [
    { value: 'spare_parts', label: 'Spare Parts' },
    { value: 'tools', label: 'Tools' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'accessories', label: 'Accessories' }
  ],
  repairs: [
    { value: 'engine', label: 'Engine' },
    { value: 'transmission', label: 'Transmission' },
    { value: 'brakes', label: 'Brakes' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'body', label: 'Body' },
    { value: 'other_repairs', label: 'Other Repairs' }
  ]
}

interface MaintenanceExpenseFormProps {
  onSubmit: (data: MaintenanceExpense) => void
  initialData?: Partial<MaintenanceExpense>
}

export function MaintenanceExpenseForm({ onSubmit, initialData }: MaintenanceExpenseFormProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '')

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<MaintenanceExpense>({
    resolver: zodResolver(maintenanceExpenseSchema),
    defaultValues: {
      type: 'maintenance',
      category: 'charges',
      subCategory: '',
      serviceDate: new Date(),
      description: '',
      totalAmount: 0,
      currency: 'BDT',
      businessPurpose: '',
      ...initialData
    }
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setValue('category', category as 'charges' | 'purchases' | 'repairs')
    setValue('subCategory', '') // Reset subcategory when category changes
  }

  const currentSubCategories = selectedCategory ? subCategoryOptions[selectedCategory as keyof typeof subCategoryOptions] : []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Maintenance Category"
              options={categoryOptions}
              value={field.value}
              onChange={(value) => handleCategoryChange(value)}
              error={errors.category?.message}
              required
            />
          )}
        />

        <Controller
          name="subCategory"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Sub-Category"
              options={currentSubCategories}
              value={field.value}
              onChange={field.onChange}
              error={errors.subCategory?.message}
              required
              disabled={!selectedCategory}
            />
          )}
        />

        <Controller
          name="serviceDate"
          control={control}
          render={({ field }) => (
            <DateField
              label="Service Date"
              value={field.value}
              onChange={field.onChange}
              error={errors.serviceDate?.message}
              required
            />
          )}
        />

        <Controller
          name="totalAmount"
          control={control}
          render={({ field }) => (
            <TextField
              label="Total Amount"
              type="number"
              value={field.value}
              onChange={field.onChange}
              error={errors.totalAmount?.message}
              required
            />
          )}
        />

        <Controller
          name="vehicleType"
          control={control}
          render={({ field }) => (
            <TextField
              label="Vehicle Type (Optional)"
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.vehicleType?.message}
            />
          )}
        />

        <Controller
          name="equipmentPurchased"
          control={control}
          render={({ field }) => (
            <TextField
              label="Equipment Purchased (Optional)"
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.equipmentPurchased?.message}
            />
          )}
        />

        <Controller
          name="vendorName"
          control={control}
          render={({ field }) => (
            <TextField
              label="Vendor Name (Optional)"
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.vendorName?.message}
            />
          )}
        />

        <Controller
          name="invoiceNumber"
          control={control}
          render={({ field }) => (
            <TextField
              label="Invoice Number (Optional)"
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.invoiceNumber?.message}
            />
          )}
        />

        <Controller
          name="assetId"
          control={control}
          render={({ field }) => (
            <TextField
              label="Asset ID (Optional)"
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.assetId?.message}
            />
          )}
        />
      </div>

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextareaField
            label="Description"
            value={field.value}
            onChange={field.onChange}
            error={errors.description?.message}
            required
            rows={3}
          />
        )}
      />

      <Controller
        name="businessPurpose"
        control={control}
        render={({ field }) => (
          <TextareaField
            label="Business Purpose"
            value={field.value}
            onChange={field.onChange}
            error={errors.businessPurpose?.message}
            required
            rows={4}
            placeholder="Please provide a detailed explanation of the business purpose for this maintenance expense (minimum 200 characters)..."
          />
        )}
      />

      <Controller
        name="warrantyApplicable"
        control={control}
        render={({ field }) => (
          <CheckboxField
            label="Warranty Applicable"
            checked={field.value || false}
            onChange={field.onChange}
            error={errors.warrantyApplicable?.message}
          />
        )}
      />

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
  )
} 