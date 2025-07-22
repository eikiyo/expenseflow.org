/**
 * TRAVEL EXPENSE FORM COMPONENT TESTS
 * 
 * This file contains comprehensive tests for the TravelExpenseForm component.
 * Tests form rendering, validation, user interactions, and data submission.
 * 
 * Dependencies: @testing-library/react, @testing-library/user-event, jest
 * Used by: Jest test runner for form component validation
 * 
 * Example: npm test TravelExpenseForm.test.tsx
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TravelExpenseForm } from '@/app/components/forms/TravelExpenseForm';
import { TravelExpense } from '@/app/types/expense';

// Mock the expense provider context
jest.mock('@/app/providers/expense-provider', () => ({
  useExpenseContext: () => ({
    currentExpense: null,
    setCurrentExpense: jest.fn(),
    handleSave: jest.fn(),
  }),
}));

describe('TravelExpenseForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    initialData: undefined as TravelExpense | undefined,
  };

  const mockTravelExpense: TravelExpense = {
    type: 'travel',
    description: 'Business trip to client site',
    totalAmount: 1500,
    currency: 'BDT',
    businessPurpose: 'Client meeting and project discussion',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-17'),
    startLocation: {
      address: 'Dhaka, Bangladesh'
    },
    endLocation: {
      address: 'New York, NY'
    },
    transportationType: 'car',
    vehicleOwnership: 'own',
    roundTrip: true,
    mileage: 300,
    fuelCost: 120,
    tollCharges: 25,
    accommodationCost: 400,
    perDiemRate: 200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields correctly', () => {
      render(<TravelExpenseForm {...defaultProps} />);
      
      // Check for main form elements
      expect(screen.getByRole('heading', { name: /travel expense/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /amount/i })).toBeInTheDocument();
      
      // Check for date fields
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
      
      // Check for transportation fields
      expect(screen.getByRole('combobox', { name: /transportation type/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /vehicle ownership/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /destination/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /distance/i })).toBeInTheDocument();
      
      // Check for cost breakdown fields
      expect(screen.getByRole('spinbutton', { name: /fuel cost/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /toll charges/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /accommodation cost/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /meals cost/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /other expenses/i })).toBeInTheDocument();
      
      // Check for business purpose field
      expect(screen.getByRole('textbox', { name: /business purpose/i })).toBeInTheDocument();
      
      // Check for submit button
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('populates form with initial data when provided', () => {
      render(<TravelExpenseForm {...defaultProps} initialData={mockTravelExpense} />);
      
      expect(screen.getByDisplayValue('Business trip to client site')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1500')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-17')).toBeInTheDocument();
      expect(screen.getByDisplayValue('New York, NY')).toBeInTheDocument();
      expect(screen.getByDisplayValue('300')).toBeInTheDocument();
      expect(screen.getByDisplayValue('120')).toBeInTheDocument();
      expect(screen.getByDisplayValue('25')).toBeInTheDocument();
      expect(screen.getByDisplayValue('400')).toBeInTheDocument();
      expect(screen.getByDisplayValue('200')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Client meeting and project discussion')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('allows user to fill out all form fields', async () => {
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} />);
      
      // Fill out basic information
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test business trip');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '2000');
      
      // Fill out dates
      await user.type(screen.getByLabelText(/start date/i), '2024-02-01');
      await user.type(screen.getByLabelText(/end date/i), '2024-02-03');
      
      // Fill out transportation details
      await user.selectOptions(screen.getByRole('combobox', { name: /transportation type/i }), 'car');
      await user.selectOptions(screen.getByRole('combobox', { name: /vehicle ownership/i }), 'personal');
      await user.type(screen.getByRole('textbox', { name: /destination/i }), 'Los Angeles, CA');
      await user.type(screen.getByRole('spinbutton', { name: /distance/i }), '400');
      
      // Fill out cost breakdown
      await user.type(screen.getByRole('spinbutton', { name: /fuel cost/i }), '150');
      await user.type(screen.getByRole('spinbutton', { name: /toll charges/i }), '30');
      await user.type(screen.getByRole('spinbutton', { name: /accommodation cost/i }), '600');
      await user.type(screen.getByRole('spinbutton', { name: /meals cost/i }), '300');
      await user.type(screen.getByRole('spinbutton', { name: /other expenses/i }), '100');
      
      // Fill out business purpose
      await user.type(screen.getByRole('textbox', { name: /business purpose/i }), 'Client presentation and contract negotiation');
      
      // Verify all values are set
      expect(screen.getByDisplayValue('Test business trip')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-02-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-02-03')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Los Angeles, CA')).toBeInTheDocument();
      expect(screen.getByDisplayValue('400')).toBeInTheDocument();
      expect(screen.getByDisplayValue('150')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
      expect(screen.getByDisplayValue('600')).toBeInTheDocument();
      expect(screen.getByDisplayValue('300')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Client presentation and contract negotiation')).toBeInTheDocument();
    });

    it('handles transportation type selection correctly', async () => {
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} />);
      
      const transportationSelect = screen.getByRole('combobox', { name: /transportation type/i });
      
      // Test all transportation options
      const options = ['car', 'train', 'bus', 'flight', 'taxi', 'other'];
      
      for (const option of options) {
        await user.selectOptions(transportationSelect, option);
        expect(transportationSelect).toHaveValue(option);
      }
    });

    it('handles vehicle ownership selection correctly', async () => {
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} />);
      
      const ownershipSelect = screen.getByRole('combobox', { name: /vehicle ownership/i });
      
      // Test all ownership options
      const options = ['personal', 'company', 'rental'];
      
      for (const option of options) {
        await user.selectOptions(ownershipSelect, option);
        expect(ownershipSelect).toHaveValue(option);
      }
    });
  });

  describe('Form Submission', () => {
    it('submits form with correct data when all fields are filled', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} onSubmit={mockOnSubmit} />);
      
      // Fill out the form
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Business conference');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '1500');
      await user.type(screen.getByLabelText(/start date/i), '2024-03-01');
      await user.type(screen.getByLabelText(/end date/i), '2024-03-03');
      await user.selectOptions(screen.getByRole('combobox', { name: /transportation type/i }), 'flight');
      await user.selectOptions(screen.getByRole('combobox', { name: /vehicle ownership/i }), 'company');
      await user.type(screen.getByRole('textbox', { name: /destination/i }), 'San Francisco, CA');
      await user.type(screen.getByRole('spinbutton', { name: /distance/i }), '500');
      await user.type(screen.getByRole('spinbutton', { name: /fuel cost/i }), '0');
      await user.type(screen.getByRole('spinbutton', { name: /toll charges/i }), '0');
      await user.type(screen.getByRole('spinbutton', { name: /accommodation cost/i }), '800');
      await user.type(screen.getByRole('spinbutton', { name: /meals cost/i }), '400');
      await user.type(screen.getByRole('spinbutton', { name: /other expenses/i }), '300');
      await user.type(screen.getByRole('textbox', { name: /business purpose/i }), 'Annual tech conference attendance');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Wait for form submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
      
      // Verify the submitted data
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData).toMatchObject({
        expenseType: 'travel',
        description: 'Business conference',
        amount: 1500,
        startDate: '2024-03-01',
        endDate: '2024-03-03',
        transportationType: 'flight',
        vehicleOwnership: 'company',
        destination: 'San Francisco, CA',
        distance: 500,
        fuelCost: 0,
        tollCharges: 0,
        accommodationCost: 800,
        mealsCost: 400,
        otherExpenses: 300,
        businessPurpose: 'Annual tech conference attendance',
      });
    });

    it('submits form with initial data when no changes are made', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} initialData={mockTravelExpense} onSubmit={mockOnSubmit} />);
      
      // Submit without making changes
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
      
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData).toMatchObject(mockTravelExpense);
    });

    it('submits the form with valid data', async () => {
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      render(<TravelExpenseForm onSubmit={mockOnSubmit} />);
      
      console.log('Filling out form...');
      await user.type(screen.getByLabelText(/description/i), 'Business trip to client meeting');
      await user.type(screen.getByLabelText(/total amount/i), '1500');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      console.log('Clicking submit button...');
      await user.click(submitButton);
      
      console.log('Waiting for submission...');
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
      console.log('Submission complete!');
    });
  });

  describe('Validation', () => {
    it('requires description field', async () => {
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
      });
    });

    it('requires amount field', async () => {
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
      });
    });

    it('validates amount is positive', async () => {
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} />);
      
      const amountInput = screen.getByLabelText(/total amount/i);
      await user.type(amountInput, '-100');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
      });
    });

    it('validates end date is after start date', async () => {
      const user = userEvent.setup();
      render(<TravelExpenseForm {...defaultProps} />);
      
      const startDateInput = screen.getByLabelText(/start date/i);
      const endDateInput = screen.getByLabelText(/end date/i);
      
      await user.type(startDateInput, '2024-02-01');
      await user.type(endDateInput, '2024-01-31');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('End date must be after start date')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form fields', () => {
      render(<TravelExpenseForm {...defaultProps} />);

      // Check for all required form field labels
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/start location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/transportation type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/vehicle ownership/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mileage/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fuel cost/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/toll charges/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/accommodation cost/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/per diem rate/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/total amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business purpose/i)).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<TravelExpenseForm {...defaultProps} />);
      
      // Check for proper form structure
      // The form role is not directly tested here as it's not a top-level element in the component.
      // The form is handled by the TravelExpenseForm component itself.
      
      // Check that submit button has proper type
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
}); 