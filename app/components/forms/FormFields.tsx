/**
 * FORM FIELD COMPONENTS
 * 
 * This file contains reusable form field components with validation.
 * Provides consistent styling and error handling for form inputs.
 * 
 * Dependencies: React, react-hook-form
 * Used by: All form components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { useFormContext } from 'react-hook-form'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
  min?: number | string
  max?: number | string
  step?: number
  options?: { value: string; label: string }[]
}

// Text input field
export function TextField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  className = '',
  min,
  max,
  step
}: FormFieldProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        <input
          {...register(name)}
          type={type}
          id={name}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`
            block w-full rounded-md shadow-sm sm:text-sm
            ${error
              ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Textarea field
export function TextareaField({
  name,
  label,
  placeholder,
  required = false,
  className = ''
}: FormFieldProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        <textarea
          {...register(name)}
          id={name}
          placeholder={placeholder}
          rows={4}
          className={`
            block w-full rounded-md shadow-sm sm:text-sm
            ${error
              ? 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Select field
export function SelectField({
  name,
  label,
  options = [],
  required = false,
  className = ''
}: FormFieldProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        <select
          {...register(name)}
          id={name}
          className={`
            block w-full rounded-md shadow-sm sm:text-sm
            ${error
              ? 'border-red-300 pr-10 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        >
          <option value="">Select an option</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Date field
export function DateField({
  name,
  label,
  required = false,
  className = '',
  min,
  max
}: FormFieldProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        <input
          {...register(name)}
          type="date"
          id={name}
          min={min as string}
          max={max as string}
          className={`
            block w-full rounded-md shadow-sm sm:text-sm
            ${error
              ? 'border-red-300 pr-10 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
          `}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Checkbox field
export function CheckboxField({
  name,
  label,
  required = false,
  className = ''
}: FormFieldProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message as string

  return (
    <div className={className}>
      <div className="flex items-center">
        <input
          {...register(name)}
          type="checkbox"
          id={name}
          className={`
            h-4 w-4 rounded
            ${error
              ? 'border-red-300 text-red-600 focus:ring-red-500'
              : 'border-gray-300 text-blue-600 focus:ring-blue-500'
            }
          `}
        />
        <label
          htmlFor={name}
          className="ml-2 block text-sm text-gray-900"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
} 