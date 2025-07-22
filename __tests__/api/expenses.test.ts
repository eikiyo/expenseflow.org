/**
 * EXPENSE API ROUTES TESTS
 * 
 * This file contains comprehensive tests for the expense API routes.
 * Tests GET and POST endpoints for expense management.
 * 
 * Dependencies: jest, @testing-library/react, @testing-library/jest-dom
 * Used by: Jest test runner for API endpoint validation
 * 
 * Example: npm test expenses.test.ts
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/expenses/route';
import { saveExpense, getUserExpenses } from '@/app/services/expense-service';

// Mock the expense service
jest.mock('@/app/services/expense-service');
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
    },
  })),
}));

const mockSaveExpense = saveExpense as jest.MockedFunction<typeof saveExpense>;
const mockGetUserExpenses = getUserExpenses as jest.MockedFunction<typeof getUserExpenses>;

describe('Expense API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/expenses', () => {
    it('returns user expenses when authenticated', async () => {
      const mockExpenses = [
        {
          id: '1',
          user_id: 'user123',
          expense_number: 'EXP-001',
          type: 'travel' as const,
          status: 'submitted' as const,
          title: 'Business Trip',
          description: 'Client meeting in New York',
          total_amount: 1500,
          currency: 'BDT',
          expense_data: {
            transport_method: 'plane' as const,
            start_location: 'Dhaka',
            end_location: 'New York',
            departure_date: '2024-01-15',
            return_date: '2024-01-17',
            vehicle_ownership: 'public' as const,
            round_trip: true,
            business_purpose: 'Client meeting',
            costs: {
              base_cost: 1500,
              fuel_cost: 0,
              toll_charges: 0,
              accommodation_cost: 0,
              per_diem_rate: 0,
            },
          },
          submitted_at: '2024-01-15T10:00:00Z',
          approved_at: null,
          approver_id: null,
          approval_notes: null,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
      ];

      mockGetUserExpenses.mockResolvedValue(mockExpenses);

      const request = new NextRequest('http://localhost:3000/api/expenses');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockExpenses);
      expect(mockGetUserExpenses).toHaveBeenCalledTimes(1);
    });

    it('returns 401 when user is not authenticated', async () => {
      mockGetUserExpenses.mockRejectedValue(new Error('Unauthorized'));

      const request = new NextRequest('http://localhost:3000/api/expenses');
      
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('returns 500 when service throws an error', async () => {
      mockGetUserExpenses.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/expenses');
      
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/expenses', () => {
    it('creates a new expense when valid data is provided', async () => {
      const mockExpenseData = {
        type: 'travel',
        description: 'Business trip to client site',
        totalAmount: 1500,
        currency: 'BDT',
        businessPurpose: 'Client meeting and project discussion',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        transportationType: 'car',
        vehicleOwnership: 'personal',
        destination: 'New York, NY',
        distance: 300,
        fuelCost: 120,
        tollCharges: 25,
        accommodationCost: 400,
        mealsCost: 200,
        otherExpenses: 50,
      };

      const mockCreatedExpense = {
        id: 'new-expense-id',
        user_id: 'user123',
        expense_number: 'EXP-002',
        type: 'travel' as const,
        status: 'draft' as const,
        title: 'Business trip to client site',
        description: 'Client meeting and project discussion',
        total_amount: 1500,
        currency: 'BDT',
        expense_data: {
          transport_method: 'car' as const,
          start_location: 'Dhaka',
          end_location: 'New York, NY',
          departure_date: '2024-01-15',
          return_date: '2024-01-17',
          vehicle_ownership: 'own' as const,
          round_trip: true,
          business_purpose: 'Client meeting and project discussion',
          costs: {
            base_cost: 1500,
            fuel_cost: 120,
            toll_charges: 25,
            accommodation_cost: 400,
            per_diem_rate: 0,
          },
        },
        submitted_at: null,
        approved_at: null,
        approver_id: null,
        approval_notes: null,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      };

      mockSaveExpense.mockResolvedValue(mockCreatedExpense);

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockExpenseData),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockCreatedExpense);
      expect(mockSaveExpense).toHaveBeenCalledTimes(1);
      expect(mockSaveExpense).toHaveBeenCalledWith(mockExpenseData, 'user123');
    });

    it('returns 400 when invalid data is provided', async () => {
      const invalidExpenseData = {
        type: 'invalid_type',
        description: '',
        totalAmount: -100,
      };

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidExpenseData),
      });
      
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('returns 401 when user is not authenticated', async () => {
      mockSaveExpense.mockRejectedValue(new Error('Unauthorized'));

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'travel',
          description: 'Test expense',
          totalAmount: 100,
        }),
      });
      
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('returns 500 when service throws an error', async () => {
      mockSaveExpense.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'travel',
          description: 'Test expense',
          totalAmount: 100,
        }),
      });
      
      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });
}); 