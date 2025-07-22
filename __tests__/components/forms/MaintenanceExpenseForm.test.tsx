/**
 * MAINTENANCE EXPENSE FORM COMPONENT TESTS
 * 
 * This file contains comprehensive tests for the MaintenanceExpenseForm component.
 * Tests form rendering, validation, user interactions, and data submission.
 * 
 * Dependencies: @testing-library/react, @testing-library/user-event, jest
 * Used by: Jest test runner for form component validation
 * 
 * Example: npm test MaintenanceExpenseForm.test.tsx
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaintenanceExpenseForm } from '@/app/components/forms/MaintenanceExpenseForm';
import { MaintenanceExpense } from '@/app/types/expense';

// Mock the expense provider context
jest.mock('@/app/providers/expense-provider', () => ({
  useExpenseContext: () => ({
    currentExpense: null,
    setCurrentExpense: jest.fn(),
    handleSave: jest.fn(),
  }),
}));

describe('MaintenanceExpenseForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    initialData: undefined as MaintenanceExpense | undefined,
  };

  const mockMaintenanceExpense: MaintenanceExpense = {
    type: 'maintenance',
    description: 'Office printer repair and maintenance',
    totalAmount: 800,
    currency: 'BDT',
    businessPurpose: 'Maintain office equipment for daily operations',
    serviceDate: new Date('2024-01-20'),
    category: 'repairs',
    subCategory: 'office_equipment',
    vendorName: 'TechFix Solutions',
    invoiceNumber: 'INV-2024-001',
    warrantyApplicable: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields correctly', () => {
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Check for main form elements
      expect(screen.getByRole('heading', { name: /maintenance expense/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /amount/i })).toBeInTheDocument();
      
      // Check for category fields
      expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /sub category/i })).toBeInTheDocument();
      
      // Check for service details
      expect(screen.getByLabelText(/service date/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /service provider/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /invoice number/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /warranty info/i })).toBeInTheDocument();
      
      // Check for business purpose field
      expect(screen.getByRole('textbox', { name: /business purpose/i })).toBeInTheDocument();
      
      // Check for submit button
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('populates form with initial data when provided', () => {
      render(<MaintenanceExpenseForm {...defaultProps} initialData={mockMaintenanceExpense} />);
      
      expect(screen.getByDisplayValue('Office printer repair and maintenance')).toBeInTheDocument();
      expect(screen.getByDisplayValue('800')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-20')).toBeInTheDocument();
      expect(screen.getByDisplayValue('TechFix Solutions')).toBeInTheDocument();
      expect(screen.getByDisplayValue('INV-2024-001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1 year warranty included')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Maintain office equipment for daily operations')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('allows user to fill out all form fields', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Fill out basic information
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'HVAC system maintenance');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '1200');
      
      // Select category and sub-category
      await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'maintenance');
      await user.selectOptions(screen.getByRole('combobox', { name: /sub category/i }), 'hvac');
      
      // Fill out service details
      await user.type(screen.getByLabelText(/service date/i), '2024-02-15');
      await user.type(screen.getByRole('textbox', { name: /service provider/i }), 'Climate Control Pro');
      await user.type(screen.getByRole('textbox', { name: /invoice number/i }), 'INV-2024-002');
      await user.type(screen.getByRole('textbox', { name: /warranty info/i }), '2 year warranty');
      
      // Fill out business purpose
      await user.type(screen.getByRole('textbox', { name: /business purpose/i }), 'Regular HVAC maintenance for office comfort');
      
      // Verify all values are set
      expect(screen.getByDisplayValue('HVAC system maintenance')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1200')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-02-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Climate Control Pro')).toBeInTheDocument();
      expect(screen.getByDisplayValue('INV-2024-002')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2 year warranty')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Regular HVAC maintenance for office comfort')).toBeInTheDocument();
    });

    it('handles category selection correctly', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      const categorySelect = screen.getByRole('combobox', { name: /category/i });
      
      // Test all category options
      const options = ['charges', 'purchases', 'repairs', 'maintenance'];
      
      for (const option of options) {
        await user.selectOptions(categorySelect, option);
        expect(categorySelect).toHaveValue(option);
      }
    });

    it('updates sub-category options based on category selection', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      const categorySelect = screen.getByRole('combobox', { name: /category/i });
      const subCategorySelect = screen.getByRole('combobox', { name: /sub category/i });
      
      // Select 'repairs' category
      await user.selectOptions(categorySelect, 'repairs');
      
      // Check that sub-category options are updated
      const repairOptions = ['office_equipment', 'building', 'vehicle', 'other'];
      repairOptions.forEach(option => {
        expect(subCategorySelect).toHaveTextContent(option.replace('_', ' '));
      });
      
      // Select 'maintenance' category
      await user.selectOptions(categorySelect, 'maintenance');
      
      // Check that sub-category options are updated
      const maintenanceOptions = ['hvac', 'electrical', 'plumbing', 'other'];
      maintenanceOptions.forEach(option => {
        expect(subCategorySelect).toHaveTextContent(option);
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with correct data when all fields are filled', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} onSubmit={mockOnSubmit} />);
      
      // Fill out the form
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Server room cooling system repair');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '2500');
      await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'repairs');
      await user.selectOptions(screen.getByRole('combobox', { name: /sub category/i }), 'hvac');
      await user.type(screen.getByLabelText(/service date/i), '2024-03-10');
      await user.type(screen.getByRole('textbox', { name: /service provider/i }), 'Data Center Cooling Solutions');
      await user.type(screen.getByRole('textbox', { name: /invoice number/i }), 'INV-2024-003');
      await user.type(screen.getByRole('textbox', { name: /warranty info/i }), '3 year warranty');
      await user.type(screen.getByRole('textbox', { name: /business purpose/i }), 'Critical infrastructure maintenance for data center operations');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Wait for form submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
      
      // Verify the submitted data
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData).toMatchObject({
        expenseType: 'maintenance',
        description: 'Server room cooling system repair',
        amount: 2500,
        category: 'repairs',
        subCategory: 'hvac',
        serviceDate: '2024-03-10',
        serviceProvider: 'Data Center Cooling Solutions',
        invoiceNumber: 'INV-2024-003',
        warrantyInfo: '3 year warranty',
        businessPurpose: 'Critical infrastructure maintenance for data center operations',
      });
    });

    it('submits form with initial data when no changes are made', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} initialData={mockMaintenanceExpense} onSubmit={mockOnSubmit} />);
      
      // Submit without making changes
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
      
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData).toMatchObject(mockMaintenanceExpense);
    });
  });

  describe('Validation', () => {
    it('requires description field', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Try to submit without description
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });
    });

    it('requires amount field', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Fill description but not amount
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test maintenance');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
      });
    });

    it('validates amount is positive', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Fill with negative amount
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test maintenance');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '-100');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
      });
    });

    it('requires category selection', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Fill basic fields but not category
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test maintenance');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '500');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/category is required/i)).toBeInTheDocument();
      });
    });

    it('requires service date', async () => {
      const user = userEvent.setup();
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Fill basic fields but not service date
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test maintenance');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '500');
      await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'maintenance');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/service date is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form fields', () => {
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Check that all form fields have associated labels
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sub category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/service date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/service provider/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/invoice number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/warranty info/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business purpose/i)).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<MaintenanceExpenseForm {...defaultProps} />);
      
      // Check for proper form structure
      expect(screen.getByRole('form')).toBeInTheDocument();
      
      // Check that submit button has proper type
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
}); 