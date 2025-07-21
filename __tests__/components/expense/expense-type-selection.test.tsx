import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExpenseTypeSelection } from '@/app/components/expense/expense-type-selection'

describe('ExpenseTypeSelection', () => {
  const mockOnBack = jest.fn()
  const mockOnSelectType = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all expense type cards', () => {
    render(
      <ExpenseTypeSelection
        onBack={mockOnBack}
        onSelectType={mockOnSelectType}
      />
    )

    expect(screen.getByText('Travel Expense')).toBeInTheDocument()
    expect(screen.getByText('Maintenance')).toBeInTheDocument()
    expect(screen.getByText('Requisition')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(
      <ExpenseTypeSelection
        onBack={mockOnBack}
        onSelectType={mockOnSelectType}
      />
    )

    const backButton = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backButton)

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('calls onSelectType with correct type when a card is clicked', () => {
    render(
      <ExpenseTypeSelection
        onBack={mockOnBack}
        onSelectType={mockOnSelectType}
      />
    )

    const travelCard = screen.getByText('Travel Expense').closest('button')
    fireEvent.click(travelCard!)

    expect(mockOnSelectType).toHaveBeenCalledWith('travel')
  })

  it('shows correct descriptions for each expense type', () => {
    render(
      <ExpenseTypeSelection
        onBack={mockOnBack}
        onSelectType={mockOnSelectType}
      />
    )

    expect(screen.getByText(/transportation and accommodation/i)).toBeInTheDocument()
    expect(screen.getByText(/vehicle maintenance and repairs/i)).toBeInTheDocument()
    expect(screen.getByText(/recurring services and utilities/i)).toBeInTheDocument()
  })
}) 