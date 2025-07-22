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

    expect(screen.getByText('Travel Expenses')).toBeInTheDocument()
    expect(screen.getByText('Maintenance Expenses')).toBeInTheDocument()
    expect(screen.getByText('Requisition Management')).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    render(
      <ExpenseTypeSelection
        onBack={mockOnBack}
        onSelectType={mockOnSelectType}
      />
    )

    // The back button is the first button in the component
    const backButton = screen.getAllByRole('button')[0]
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

    const travelCard = screen.getByText('Travel Expenses').closest('.group')
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

    expect(screen.getByText(/transportation, meals, accommodation, and trip-related costs/i)).toBeInTheDocument()
    expect(screen.getByText(/vehicle maintenance, equipment purchases, and repairs/i)).toBeInTheDocument()
    expect(screen.getByText(/recurring services, utilities, and operational expenses/i)).toBeInTheDocument()
  })
}) 