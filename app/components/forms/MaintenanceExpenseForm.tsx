/**
 * MAINTENANCE EXPENSE FORM
 * 
 * This component handles maintenance expense form submission.
 * Uses base form components with maintenance-specific fields.
 * 
 * Dependencies: FormFields, validation
 * Used by: Maintenance expense flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { maintenanceExpenseSchema } from '@/app/utils/validation'
import type { MaintenanceExpense } from '@/app/types/expense'
import { TextField, DateField, SelectField, TextareaField, CheckboxField } from './FormFields'

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

  const methods = useForm<MaintenanceExpense>({
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
      vehicleType: '',
      equipmentPurchased: '',
      vendorName: '',
      invoiceNumber: '',
      assetId: '',
      warrantyApplicable: false,
      ...initialData
    }
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = methods

  const watchedCategory = watch('category')

  // Update selectedCategory when form category changes
  React.useEffect(() => {
    setSelectedCategory(watchedCategory)
  }, [watchedCategory])

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value as 'charges' | 'purchases' | 'repairs'
    setSelectedCategory(category)
    setValue('category', category)
    setValue('subCategory', '') // Reset subcategory when category changes
  }

  const currentSubCategories = selectedCategory ? subCategoryOptions[selectedCategory as keyof typeof subCategoryOptions] : []

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmit(data as MaintenanceExpense))} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              onChange={handleCategoryChange}
              value={selectedCategory}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select category</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sub-Category <span className="text-red-500">*</span>
            </label>
            <select
              name="subCategory"
              disabled={!selectedCategory}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
            >
              <option value="">Select sub-category</option>
              {currentSubCategories.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <p className="mt-1 text-sm text-red-600">{errors.subCategory.message}</p>
            )}
          </div>

          <DateField
            name="serviceDate"
            label="Service Date"
            required
          />

          <TextField
            name="totalAmount"
            label="Total Amount"
            type="number"
            required
            min={0}
            step={0.01}
          />

          <TextField
            name="vehicleType"
            label="Vehicle Type (Optional)"
            placeholder="e.g., Van, Car, Truck"
          />

          <TextField
            name="equipmentPurchased"
            label="Equipment Purchased (Optional)"
            placeholder="e.g., Engine parts, tools"
          />

          <TextField
            name="vendorName"
            label="Vendor Name (Optional)"
            placeholder="Service provider or vendor name"
          />

          <TextField
            name="invoiceNumber"
            label="Invoice Number (Optional)"
            placeholder="Invoice or receipt number"
          />

          <TextField
            name="assetId"
            label="Asset ID (Optional)"
            placeholder="Asset identification number"
          />
        </div>

        <TextareaField
          name="description"
          label="Description"
          required
          placeholder="Describe the maintenance work performed..."
        />

        <TextareaField
          name="businessPurpose"
          label="Business Purpose"
          required
          placeholder="Please provide a detailed explanation of the business purpose for this maintenance expense (minimum 200 characters)..."
        />

        <CheckboxField
          name="warrantyApplicable"
          label="Warranty Applicable"
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
    </FormProvider>
  )
} 