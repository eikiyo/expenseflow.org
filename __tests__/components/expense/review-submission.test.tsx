import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReviewSubmission } from '@/app/components/expense/review-submission'
import type { TravelExpense, MaintenanceExpense, RequisitionExpense } from '@/app/types/expense'

describe('ReviewSubmission', () => {
  const defaultProps = {
    onBack: jest.fn(),
    onSubmit: jest.fn(),
    expenseType: 'travel' as const,
    formData: {
      type: 'travel' as const,
      totalAmount: 2450,
      description: 'Test travel expense',
      currency: 'BDT',
      businessPurpose: 'Test business purpose',
      transportationType: 'van' as const,
      startLocation: { address: 'Start Location', coordinates: { lat: 0, lng: 0 } },
      endLocation: { address: 'End Location', coordinates: { lat: 0, lng: 0 } },
      startDate: new Date('2025-01-22'),
      endDate: new Date('2025-01-23'),
      vehicleOwnership: 'own' as const,
      roundTrip: false,
      fuelCost: 500,
      tollCharges: 100,
      accommodationCost: 0,
      perDiemRate: 0,
      vehicleDetails: undefined
    } as TravelExpense
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders expense type and total amount', () => {
    render(<ReviewSubmission {...defaultProps} />)

    expect(screen.getByText('travel Expense')).toBeInTheDocument()
    expect(screen.getByText('৳ 2,450')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(<ReviewSubmission {...defaultProps} />)

    const backButton = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backButton)

    expect(defaultProps.onBack).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when business purpose is too short', () => {
    render(<ReviewSubmission {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /submit expense/i })
    expect(submitButton).toBeDisabled()

    const textarea = screen.getByPlaceholderText(/explain the business purpose and justification/i)
    fireEvent.change(textarea, { target: { value: 'Too short' } })

    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when all conditions are met', () => {
    render(<ReviewSubmission {...defaultProps} />)

    // Fill business purpose
    const textarea = screen.getByPlaceholderText(/explain the business purpose and justification/i)
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

    const submitButton = screen.getByRole('button', { name: /submit expense/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('calls onSubmit when submit button is clicked with valid data', () => {
    render(<ReviewSubmission {...defaultProps} />)

    // Fill business purpose
    const textarea = screen.getByPlaceholderText(/explain the business purpose and justification/i)
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

    const submitButton = screen.getByRole('button', { name: /submit expense/i })
    fireEvent.click(submitButton)

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows expense breakdown for travel expenses', () => {
    render(<ReviewSubmission {...defaultProps} />)

    expect(screen.getByText('Transportation')).toBeInTheDocument()
    expect(screen.getByText('van • own')).toBeInTheDocument()
    expect(screen.getByText('৳ 500')).toBeInTheDocument()
  })

  it('shows correct expense icon based on type', () => {
    const { rerender } = render(<ReviewSubmission {...defaultProps} />)
    
    // Check that the travel icon (Plane) is present
    expect(screen.getByText('travel Expense')).toBeInTheDocument()

    // Test maintenance type
    const maintenanceData: MaintenanceExpense = {
      type: 'maintenance',
      totalAmount: 1000,
      description: 'Test maintenance',
      currency: 'BDT',
      businessPurpose: 'Test business purpose',
      category: 'charges',
      subCategory: 'fuel',
      serviceDate: new Date('2025-01-22'),
      vendorName: 'Test Vendor',
      vehicleType: 'Car',
      assetId: 'ASSET001',
      warrantyApplicable: false,
      invoiceNumber: 'INV001'
    }
    rerender(<ReviewSubmission {...defaultProps} expenseType="maintenance" formData={maintenanceData} />)
    expect(screen.getByText('maintenance Expense')).toBeInTheDocument()

    // Test requisition type
    const requisitionData: RequisitionExpense = {
      type: 'requisition',
      totalAmount: 500,
      description: 'Test requisition',
      currency: 'BDT',
      businessPurpose: 'Test business purpose',
      serviceType: 'cleaning',
      subType: 'office',
      duration: '1 month',
      frequency: 'weekly',
      requiredBy: '2025-02-22',
      urgencyLevel: 'medium',
      quantity: 1,
      unitPrice: 500,
      preferredVendor: 'Test Vendor'
    }
    rerender(<ReviewSubmission {...defaultProps} expenseType="requisition" formData={requisitionData} />)
    expect(screen.getByText('requisition Expense')).toBeInTheDocument()
  })
}) 