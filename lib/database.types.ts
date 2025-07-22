/**
 * DATABASE TYPES
 * 
 * This file contains TypeScript definitions for our Supabase database schema.
 * Generated types for tables, views, and stored procedures.
 * 
 * Dependencies: None
 * Used by: API routes and database operations
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          type: 'travel' | 'maintenance' | 'requisition'
          status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'reimbursed'
          total_amount: number
          currency: string
          description: string
          attachments?: Json[]
          comments?: Json[]
          // Travel specific fields
          start_date?: string
          end_date?: string
          start_location?: Json
          end_location?: Json
          transportation_type?: string
          mileage?: number
          fuel_cost?: number
          toll_charges?: number
          accommodation_cost?: number
          per_diem_rate?: number
          // Maintenance specific fields
          service_date?: string
          category?: string
          asset_id?: string
          vendor_name?: string
          invoice_number?: string
          warranty_applicable?: boolean
          // Requisition specific fields
          required_by?: string
          quantity?: number
          unit_price?: number
          preferred_vendor?: string
          urgency_level?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          type: 'travel' | 'maintenance' | 'requisition'
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'reimbursed'
          total_amount: number
          currency?: string
          description: string
          attachments?: Json[]
          comments?: Json[]
          // Travel specific fields
          start_date?: string
          end_date?: string
          start_location?: Json
          end_location?: Json
          transportation_type?: string
          mileage?: number
          fuel_cost?: number
          toll_charges?: number
          accommodation_cost?: number
          per_diem_rate?: number
          // Maintenance specific fields
          service_date?: string
          category?: string
          asset_id?: string
          vendor_name?: string
          invoice_number?: string
          warranty_applicable?: boolean
          // Requisition specific fields
          required_by?: string
          quantity?: number
          unit_price?: number
          preferred_vendor?: string
          urgency_level?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          type?: 'travel' | 'maintenance' | 'requisition'
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'reimbursed'
          total_amount?: number
          currency?: string
          description?: string
          attachments?: Json[]
          comments?: Json[]
          // Travel specific fields
          start_date?: string
          end_date?: string
          start_location?: Json
          end_location?: Json
          transportation_type?: string
          mileage?: number
          fuel_cost?: number
          toll_charges?: number
          accommodation_cost?: number
          per_diem_rate?: number
          // Maintenance specific fields
          service_date?: string
          category?: string
          asset_id?: string
          vendor_name?: string
          invoice_number?: string
          warranty_applicable?: boolean
          // Requisition specific fields
          required_by?: string
          quantity?: number
          unit_price?: number
          preferred_vendor?: string
          urgency_level?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          avatar_url?: string | null
          department?: string | null
          role: 'user' | 'manager' | 'admin' | 'employee'
          manager_id?: string | null
          expense_limit?: number | null
          // New unified fields from expense_users
          employee_id?: string | null
          phone?: string | null
          address?: string | null
          monthly_budget?: number | null
          single_transaction_limit?: number | null
          profile_picture_url?: string | null
          is_active?: boolean | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          avatar_url?: string | null
          department?: string | null
          role?: 'user' | 'manager' | 'admin' | 'employee'
          manager_id?: string | null
          expense_limit?: number | null
          // New unified fields from expense_users
          employee_id?: string | null
          phone?: string | null
          address?: string | null
          monthly_budget?: number | null
          single_transaction_limit?: number | null
          profile_picture_url?: string | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          department?: string | null
          role?: 'user' | 'manager' | 'admin' | 'employee'
          manager_id?: string | null
          expense_limit?: number | null
          // New unified fields from expense_users
          employee_id?: string | null
          phone?: string | null
          address?: string | null
          monthly_budget?: number | null
          single_transaction_limit?: number | null
          profile_picture_url?: string | null
          is_active?: boolean | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 