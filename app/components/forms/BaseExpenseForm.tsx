/**
 * BASE EXPENSE FORM COMPONENT
 * 
 * This component provides common form functionality for all expense types.
 * Handles form state, validation, and submission logic.
 * 
 * Dependencies: React, react-hook-form, zod
 * Used by: All expense form components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useExpense } from '@/app/providers/expense-provider'
import { FileUpload } from './FileUpload'
import { toast } from 'react-hot-toast'

interface BaseExpenseFormProps<T extends z.ZodSchema> {
  schema: T
  defaultValues?: Partial<z.infer<T>>
  onSubmit?: (data: z.infer<T>) => Promise<void>
  children: React.ReactNode
  showFileUpload?: boolean
}

export function BaseExpenseForm<T extends z.ZodSchema>({
  schema,
  defaultValues,
  onSubmit,
  children,
  showFileUpload = true
}: BaseExpenseFormProps<T>) {
  const { state, dispatch } = useExpense()
  
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<T>
  })

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    reset
  } = methods

  // Handle form submission
  const onSubmitHandler = async (data: z.infer<T>) => {
    try {
      // Update expense state
      dispatch({
        type: 'SET_EXPENSE',
        payload: data
      })

      // Call custom submit handler if provided
      if (onSubmit) {
        await onSubmit(data)
      }

      toast.success('Form submitted successfully')
      reset(data)
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to submit form')
    }
  }

  // Show validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the form errors')
    }
  }, [errors])

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="space-y-6"
        noValidate
      >
        {children}

        {showFileUpload && (
          <FileUpload
            name="attachments"
            label="Attachments"
            className="mt-6"
          />
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting || !isDirty}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </FormProvider>
  )
} 