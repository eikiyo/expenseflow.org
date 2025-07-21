import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CollapsibleCard } from '@/app/components/ui/collapsible-card'

describe('CollapsibleCard', () => {
  const defaultProps = {
    title: 'Test Card',
    step: 1,
    totalSteps: 3,
    isActive: true,
    isCompleted: false,
    canSkip: true,
    children: <div>Test Content</div>
  }

  it('renders with title and step indicator', () => {
    render(<CollapsibleCard {...defaultProps} />)

    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
  })

  it('shows content when active', () => {
    render(<CollapsibleCard {...defaultProps} />)

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('hides content when not active', () => {
    render(<CollapsibleCard {...defaultProps} isActive={false} />)

    expect(screen.queryByText('Test Content')).not.toBeVisible()
  })

  it('shows completed status when isCompleted is true', () => {
    render(<CollapsibleCard {...defaultProps} isCompleted={true} />)

    expect(screen.getByText(/completed/i)).toBeInTheDocument()
  })

  it('shows skip button when canSkip is true', () => {
    render(<CollapsibleCard {...defaultProps} />)

    expect(screen.getByText(/skip/i)).toBeInTheDocument()
  })

  it('hides skip button when canSkip is false', () => {
    render(<CollapsibleCard {...defaultProps} canSkip={false} />)

    expect(screen.queryByText(/skip/i)).not.toBeInTheDocument()
  })

  it('expands/collapses when header is clicked', () => {
    render(<CollapsibleCard {...defaultProps} isActive={false} />)

    const header = screen.getByText('Test Card').closest('button')
    fireEvent.click(header!)

    expect(screen.getByText('Test Content')).toBeVisible()

    fireEvent.click(header!)

    expect(screen.getByText('Test Content')).not.toBeVisible()
  })
}) 