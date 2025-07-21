import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReviewSubmission } from '@/app/components/expense/review-submission'

describe('ReviewSubmission', () => {
  const defaultProps = {
    onBack: jest.fn(),
    onSubmit: jest.fn(),
    expenseType: 'travel' as const,
    formData: {
      totalAmount: 2450,
      items: [
        { type: 'Primary Cost', amount: 1800 },
        { type: 'Additional Costs', amount: 650 }
      ]
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders expense type and total amount', () => {
    render(<ReviewSubmission {...defaultProps} />)

    expect(screen.getByText('Travel Expense')).toBeInTheDocument()
    expect(screen.getByText('৳ 2,450.00')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(<ReviewSubmission {...defaultProps} />)

    const backButton = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backButton)

    expect(defaultProps.onBack).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when business purpose is too short', () => {
    render(<ReviewSubmission {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /submit expense report/i })
    expect(submitButton).toBeDisabled()

    const textarea = screen.getByPlaceholderText(/provide detailed business justification/i)
    fireEvent.change(textarea, { target: { value: 'Too short' } })

    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when all conditions are met', () => {
    render(<ReviewSubmission {...defaultProps} />)

    // Fill business purpose
    const textarea = screen.getByPlaceholderText(/provide detailed business justification/i)
    fireEvent.change(textarea, {
      target: {
        value: 'A very long business purpose that meets the minimum character requirement. This is a detailed explanation of why this expense was necessary for business purposes and includes all relevant details about the expense submission.'
      }
    })

    // Check all confirmations
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      fireEvent.click(checkbox)
    })

    const submitButton = screen.getByRole('button', { name: /submit expense report/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('calls onSubmit when submit button is clicked with valid data', () => {
    render(<ReviewSubmission {...defaultProps} />)

    // Fill business purpose
    const textarea = screen.getByPlaceholderText(/provide detailed business justification/i)
    fireEvent.change(textarea, {
      target: {
        value: 'A very long business purpose that meets the minimum character requirement. This is a detailed explanation of why this expense was necessary for business purposes and includes all relevant details about the expense submission.'
      }
    })

    // Check all confirmations
    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      fireEvent.click(checkbox)
    })

    const submitButton = screen.getByRole('button', { name: /submit expense report/i })
    fireEvent.click(submitButton)

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows validation status correctly', () => {
    render(<ReviewSubmission {...defaultProps} />)

    expect(screen.getByText('All required receipts attached')).toBeInTheDocument()
    expect(screen.getByText('Expense amounts within policy limits')).toBeInTheDocument()
    expect(screen.getByText('Business purpose documented')).toBeInTheDocument()
  })

  it('shows correct expense icon based on type', () => {
    const { rerender } = render(<ReviewSubmission {...defaultProps} />)
    expect(screen.getByTestId('expense-icon-travel')).toBeInTheDocument()

    rerender(<ReviewSubmission {...defaultProps} expenseType="maintenance" />)
    expect(screen.getByTestId('expense-icon-maintenance')).toBeInTheDocument()

    rerender(<ReviewSubmission {...defaultProps} expenseType="requisition" />)
    expect(screen.getByTestId('expense-icon-requisition')).toBeInTheDocument()
  })
}) 