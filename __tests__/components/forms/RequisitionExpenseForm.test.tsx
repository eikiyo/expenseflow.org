/**
 * REQUISITION EXPENSE FORM COMPONENT TESTS
 * 
 * This file contains comprehensive tests for the RequisitionExpenseForm component.
 * Tests form rendering, validation, user interactions, and data submission.
 * 
 * Dependencies: @testing-library/react, @testing-library/user-event, jest
 * Used by: Jest test runner for form component validation
 * 
 * Example: npm test RequisitionExpenseForm.test.tsx
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequisitionExpenseForm } from '@/app/components/forms/RequisitionExpenseForm';
import { RequisitionExpense } from '@/app/types/expense';

// Mock the expense provider context
jest.mock('@/app/providers/expense-provider', () => ({
  useExpenseContext: () => ({
    currentExpense: null,
    setCurrentExpense: jest.fn(),
    handleSave: jest.fn(),
  }),
}));

describe('RequisitionExpenseForm', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    initialData: undefined as RequisitionExpense | undefined,
  };

  const mockRequisitionExpense: RequisitionExpense = {
    type: 'requisition',
    description: 'Office supplies requisition for Q1',
    totalAmount: 1500,
    currency: 'BDT',
    businessPurpose: 'Stock office supplies for daily operations',
    serviceType: 'office_supplies',
    subType: 'stationery',
    duration: '3 months',
    frequency: 'quarterly',
    requiredBy: '2024-03-31',
    quantity: 50,
    unitPrice: 30,
    preferredVendor: 'OfficeMax Supplies',
    urgencyLevel: 'medium',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all form fields correctly', () => {
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Check for main form elements
      expect(screen.getByRole('heading', { name: /requisition management/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /total amount/i })).toBeInTheDocument();
      
      // Check for service type fields
      expect(screen.getByRole('combobox', { name: /service type/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /sub type/i })).toBeInTheDocument();
      
      // Check for timing fields
      expect(screen.getByRole('textbox', { name: /duration/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /frequency/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/required by/i)).toBeInTheDocument();
      
      // Check for quantity and pricing fields
      expect(screen.getByRole('spinbutton', { name: /quantity/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /unit price/i })).toBeInTheDocument();
      
      // Check for vendor and urgency fields
      expect(screen.getByRole('textbox', { name: /preferred vendor/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /urgency level/i })).toBeInTheDocument();
      
      // Check for business purpose field
      expect(screen.getByRole('textbox', { name: /business purpose/i })).toBeInTheDocument();
      
      // Check for submit button
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('populates form with initial data when provided', () => {
      render(<RequisitionExpenseForm {...defaultProps} initialData={mockRequisitionExpense} />);
      
      expect(screen.getByDisplayValue('Office supplies requisition for Q1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1500')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3 months')).toBeInTheDocument();
      expect(screen.getByDisplayValue('quarterly')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
      expect(screen.getByDisplayValue('30')).toBeInTheDocument();
      expect(screen.getByDisplayValue('OfficeMax Supplies')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Stock office supplies for daily operations')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('allows user to fill out all form fields', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Fill out basic information
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'IT equipment requisition');
      await user.type(screen.getByRole('spinbutton', { name: /total amount/i }), '5000');
      
      // Select service type and sub-type
      await user.selectOptions(screen.getByRole('combobox', { name: /service type/i }), 'it_equipment');
      await user.selectOptions(screen.getByRole('combobox', { name: /sub type/i }), 'laptops');
      
      // Fill out timing details
      await user.type(screen.getByRole('textbox', { name: /duration/i }), '6 months');
      await user.type(screen.getByRole('textbox', { name: /frequency/i }), 'semi-annually');
      await user.type(screen.getByLabelText(/required by/i), '2024-06-30');
      
      // Fill out quantity and pricing
      await user.type(screen.getByRole('spinbutton', { name: /quantity/i }), '10');
      await user.type(screen.getByRole('spinbutton', { name: /unit price/i }), '500');
      
      // Fill out vendor and urgency
      await user.type(screen.getByRole('textbox', { name: /preferred vendor/i }), 'Tech Solutions Inc');
      await user.selectOptions(screen.getByRole('combobox', { name: /urgency level/i }), 'high');
      
      // Fill out business purpose
      await user.type(screen.getByRole('textbox', { name: /business purpose/i }), 'Upgrade development team laptops for better productivity');
      
      // Verify all values are set
      expect(screen.getByDisplayValue('IT equipment requisition')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('6 months')).toBeInTheDocument();
      expect(screen.getByDisplayValue('semi-annually')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      expect(screen.getByDisplayValue('500')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Tech Solutions Inc')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Upgrade development team laptops for better productivity')).toBeInTheDocument();
    });

    it('handles service type selection correctly', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      const serviceTypeSelect = screen.getByRole('combobox', { name: /service type/i });
      
      // Test all service type options
      const options = ['office_supplies', 'it_equipment', 'furniture', 'services', 'other'];
      
      for (const option of options) {
        await user.selectOptions(serviceTypeSelect, option);
        expect(serviceTypeSelect).toHaveValue(option);
      }
    });

    it('updates sub-type options based on service type selection', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      const serviceTypeSelect = screen.getByRole('combobox', { name: /service type/i });
      const subTypeSelect = screen.getByRole('combobox', { name: /sub type/i });
      
      // Select 'office_supplies' service type
      await user.selectOptions(serviceTypeSelect, 'office_supplies');
      
      // Check that sub-type options are updated
      const officeSupplyOptions = ['stationery', 'paper', 'ink_cartridges', 'other'];
      officeSupplyOptions.forEach(option => {
        expect(subTypeSelect).toHaveTextContent(option.replace('_', ' '));
      });
      
      // Select 'it_equipment' service type
      await user.selectOptions(serviceTypeSelect, 'it_equipment');
      
      // Check that sub-type options are updated
      const itEquipmentOptions = ['laptops', 'desktops', 'monitors', 'peripherals', 'other'];
      itEquipmentOptions.forEach(option => {
        expect(subTypeSelect).toHaveTextContent(option);
      });
    });

    it('handles urgency level selection correctly', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      const urgencySelect = screen.getByRole('combobox', { name: /urgency level/i });
      
      // Test all urgency options
      const options = ['low', 'medium', 'high', 'urgent'];
      
      for (const option of options) {
        await user.selectOptions(urgencySelect, option);
        expect(urgencySelect).toHaveValue(option);
      }
    });
  });

  describe('Form Submission', () => {
    it('submits form with correct data when all fields are filled', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} onSubmit={mockOnSubmit} />);
      
      // Fill out the form
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Conference room furniture requisition');
      await user.type(screen.getByRole('spinbutton', { name: /total amount/i }), '8000');
      await user.selectOptions(screen.getByRole('combobox', { name: /service type/i }), 'furniture');
      await user.selectOptions(screen.getByRole('combobox', { name: /sub type/i }), 'tables');
      await user.type(screen.getByRole('textbox', { name: /duration/i }), '1 month');
      await user.type(screen.getByRole('textbox', { name: /frequency/i }), 'one-time');
      await user.type(screen.getByLabelText(/required by/i), '2024-04-15');
      await user.type(screen.getByRole('spinbutton', { name: /quantity/i }), '5');
      await user.type(screen.getByRole('spinbutton', { name: /unit price/i }), '1600');
      await user.type(screen.getByRole('textbox', { name: /preferred vendor/i }), 'Office Furniture Plus');
      await user.selectOptions(screen.getByRole('combobox', { name: /urgency level/i }), 'medium');
      await user.type(screen.getByRole('textbox', { name: /business purpose/i }), 'Replace old conference room tables for better meeting experience');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Wait for form submission
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
      
      // Verify the submitted data
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData).toMatchObject({
        type: 'requisition',
        description: 'Conference room furniture requisition',
        totalAmount: 8000,
        currency: 'BDT',
        businessPurpose: 'Replace old conference room tables for better meeting experience',
        serviceType: 'furniture',
        subType: 'tables',
        duration: '1 month',
        frequency: 'one-time',
        requiredBy: '2024-04-15',
        quantity: 5,
        unitPrice: 1600,
        preferredVendor: 'Office Furniture Plus',
        urgencyLevel: 'medium',
      });
    });

    it('submits form with initial data when no changes are made', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} initialData={mockRequisitionExpense} onSubmit={mockOnSubmit} />);
      
      // Submit without making changes
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
      
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData).toMatchObject(mockRequisitionExpense);
    });
  });

  describe('Validation', () => {
    it('requires description field', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Try to submit without description
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      });
    });

    it('requires total amount field', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Fill description but not total amount
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test requisition');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/total amount is required/i)).toBeInTheDocument();
      });
    });

    it('validates total amount is positive', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Fill with negative amount
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test requisition');
      await user.type(screen.getByRole('spinbutton', { name: /total amount/i }), '-100');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/total amount must be positive/i)).toBeInTheDocument();
      });
    });

    it('requires service type selection', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Fill basic fields but not service type
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test requisition');
      await user.type(screen.getByRole('spinbutton', { name: /total amount/i }), '500');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/service type is required/i)).toBeInTheDocument();
      });
    });

    it('requires urgency level selection', async () => {
      const user = userEvent.setup();
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Fill basic fields but not urgency level
      await user.type(screen.getByRole('textbox', { name: /description/i }), 'Test requisition');
      await user.type(screen.getByRole('spinbutton', { name: /total amount/i }), '500');
      await user.selectOptions(screen.getByRole('combobox', { name: /service type/i }), 'office_supplies');
      
      // Try to submit
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/urgency level is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form fields', () => {
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Check that all form fields have associated labels
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/total amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/service type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sub type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/required by/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/unit price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preferred vendor/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/urgency level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business purpose/i)).toBeInTheDocument();
    });

    it('has proper ARIA attributes', () => {
      render(<RequisitionExpenseForm {...defaultProps} />);
      
      // Check that submit button has proper type
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
}); 