/**
 * TRAVEL EXPENSE FORM
 * 
 * This component handles travel expense form submission.
 * Uses form components with travel-specific fields.
 * 
 * Dependencies: FormFields, validation
 * Used by: Travel expense flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, DateField, SelectField, TextareaField } from './FormFields'
import { travelExpenseSchema } from '@/app/utils/validation'
import type { TravelExpense } from '@/app/types/expense'

const transportationOptions = [
  { value: 'van', label: 'Van' },
  { value: 'rickshaw', label: 'Rickshaw' },
  { value: 'boat', label: 'Boat' },
  { value: 'cng', label: 'CNG' },
  { value: 'train', label: 'Train' },
  { value: 'plane', label: 'Plane' },
  { value: 'launch', label: 'Launch' },
  { value: 'ferry', label: 'Ferry' },
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' }
]

const vehicleOwnershipOptions = [
  { value: 'own', label: 'Own' },
  { value: 'rental', label: 'Rental' },
  { value: 'public', label: 'Public' }
]

interface TravelExpenseFormProps {
  onSubmit: (data: TravelExpense) => void
  initialData?: Partial<TravelExpense>
}

export function TravelExpenseForm({ onSubmit, initialData }: TravelExpenseFormProps) {
  const today = new Date().toISOString().split('T')[0]

  const methods = useForm<TravelExpense>({
    resolver: zodResolver(travelExpenseSchema),
    defaultValues: {
      type: 'travel',
      startDate: new Date(),
      endDate: new Date(),
      startLocation: {
        address: '',
        coordinates: undefined
      },
      endLocation: {
        address: '',
        coordinates: undefined
      },
      transportationType: 'car',
      vehicleOwnership: 'own',
      roundTrip: false,
      description: '',
      totalAmount: 0,
      currency: 'BDT',
      businessPurpose: '',
      mileage: 0,
      fuelCost: 0,
      tollCharges: 0,
      accommodationCost: 0,
      perDiemRate: 0,
      ...initialData
    }
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmit(data as TravelExpense))} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DateField
            name="startDate"
            label="Start Date"
            required
            min={today}
          />
          <DateField
            name="endDate"
            label="End Date"
            required
            min={today}
          />

          <TextField
            name="startLocation.address"
            label="Start Location"
            required
            placeholder="Enter start location"
          />
          <TextField
            name="endLocation.address"
            label="End Location"
            required
            placeholder="Enter end location"
          />

          <SelectField
            name="transportationType"
            label="Transportation Type"
            required
            options={transportationOptions}
          />

          <SelectField
            name="vehicleOwnership"
            label="Vehicle Ownership"
            required
            options={vehicleOwnershipOptions}
          />

          <TextField
            name="mileage"
            label="Mileage"
            type="number"
            min={0}
            step={0.1}
            placeholder="Enter mileage if applicable"
          />

          <TextField
            name="fuelCost"
            label="Fuel Cost"
            type="number"
            min={0}
            step={0.01}
            placeholder="Enter fuel cost if applicable"
          />

          <TextField
            name="tollCharges"
            label="Toll Charges"
            type="number"
            min={0}
            step={0.01}
            placeholder="Enter toll charges if applicable"
          />

          <TextField
            name="accommodationCost"
            label="Accommodation Cost"
            type="number"
            min={0}
            step={0.01}
            placeholder="Enter accommodation cost if applicable"
          />

          <TextField
            name="perDiemRate"
            label="Per Diem Rate"
            type="number"
            min={0}
            step={0.01}
            placeholder="Enter per diem rate if applicable"
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
            placeholder="Enter expense description"
            className="md:col-span-2"
          />

          <TextareaField
            name="businessPurpose"
            label="Business Purpose"
            required
            placeholder="Please provide a detailed business purpose for this travel expense (minimum 200 characters)..."
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