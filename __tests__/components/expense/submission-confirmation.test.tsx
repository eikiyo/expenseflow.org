import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SubmissionConfirmation } from '@/app/components/expense/submission-confirmation'

describe('SubmissionConfirmation', () => {
  const defaultProps = {
    onSubmitAnother: jest.fn(),
    onBackToDashboard: jest.fn(),
    referenceNumber: 'EXP-202401-0001'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders success message and reference number', () => {
    render(<SubmissionConfirmation {...defaultProps} />)

    expect(screen.getByText('Submission Successful!')).toBeInTheDocument()
    expect(screen.getByText('EXP-202401-0001')).toBeInTheDocument()
  })

  it('calls onSubmitAnother when submit another button is clicked', () => {
    render(<SubmissionConfirmation {...defaultProps} />)

    const submitAnotherButton = screen.getByRole('button', { name: /submit another expense/i })
    fireEvent.click(submitAnotherButton)

    expect(defaultProps.onSubmitAnother).toHaveBeenCalledTimes(1)
  })

  it('calls onBackToDashboard when back to dashboard button is clicked', () => {
    render(<SubmissionConfirmation {...defaultProps} />)

    const backToDashboardButton = screen.getByRole('button', { name: /back to dashboard/i })
    fireEvent.click(backToDashboardButton)

    expect(defaultProps.onBackToDashboard).toHaveBeenCalledTimes(1)
  })

  it('shows next steps in correct order', () => {
    render(<SubmissionConfirmation {...defaultProps} />)

    const steps = screen.getAllByText(/email confirmation|pending manager|finance team/i)
    expect(steps).toHaveLength(3)
    expect(steps[0]).toHaveTextContent(/email confirmation/i)
    expect(steps[1]).toHaveTextContent(/pending manager/i)
    expect(steps[2]).toHaveTextContent(/finance team/i)
  })

  it('shows download PDF button', () => {
    render(<SubmissionConfirmation {...defaultProps} />)

    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
  })

  it('shows tracking information message', () => {
    render(<SubmissionConfirmation {...defaultProps} />)

    expect(screen.getByText(/track the status/i)).toBeInTheDocument()
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument()
  })
}) 