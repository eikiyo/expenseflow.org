/**
 * TRAVEL EXPENSE FORM
 * 
 * This component handles travel expense form submission.
 * Uses base form components with travel-specific fields.
 * 
 * Dependencies: BaseExpenseForm, FormFields, validation
 * Used by: Travel expense flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { BaseExpenseForm } from './BaseExpenseForm'
import { TextField, DateField, SelectField, TextareaField } from './FormFields'
import { travelExpenseSchema } from '@/app/utils/validation'
import { TransportationType } from '@/app/types/expense'
import { format } from 'date-fns'

const transportationOptions = Object.entries(TransportationType).map(([key, value]) => ({
  value,
  label: key.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}))

interface TravelExpenseFormProps {
  onSubmit?: (data: any) => Promise<void>
  defaultValues?: any
}

export function TravelExpenseForm({ onSubmit, defaultValues }: TravelExpenseFormProps) {
  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <BaseExpenseForm
      schema={travelExpenseSchema}
      onSubmit={onSubmit}
      defaultValues={{
        type: 'travel',
        startDate: today,
        endDate: today,
        ...defaultValues
      }}
    >
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
      </div>
    </BaseExpenseForm>
  )
} 