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
          userId: string
          type: 'travel' | 'maintenance' | 'requisition'
          status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'reimbursed'
          totalAmount: number
          currency: string
          description: string
          attachments?: Json[]
          comments?: Json[]
          // Travel specific fields
          startDate?: string
          endDate?: string
          startLocation?: Json
          endLocation?: Json
          transportationType?: string
          mileage?: number
          fuelCost?: number
          tollCharges?: number
          accommodationCost?: number
          perDiemRate?: number
          // Maintenance specific fields
          serviceDate?: string
          category?: string
          assetId?: string
          vendorName?: string
          invoiceNumber?: string
          warrantyApplicable?: boolean
          // Requisition specific fields
          requiredBy?: string
          quantity?: number
          unitPrice?: number
          preferredVendor?: string
          urgencyLevel?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          userId: string
          type: 'travel' | 'maintenance' | 'requisition'
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'reimbursed'
          totalAmount: number
          currency: string
          description: string
          attachments?: Json[]
          comments?: Json[]
          // Travel specific fields
          startDate?: string
          endDate?: string
          startLocation?: Json
          endLocation?: Json
          transportationType?: string
          mileage?: number
          fuelCost?: number
          tollCharges?: number
          accommodationCost?: number
          perDiemRate?: number
          // Maintenance specific fields
          serviceDate?: string
          category?: string
          assetId?: string
          vendorName?: string
          invoiceNumber?: string
          warrantyApplicable?: boolean
          // Requisition specific fields
          requiredBy?: string
          quantity?: number
          unitPrice?: number
          preferredVendor?: string
          urgencyLevel?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          userId?: string
          type?: 'travel' | 'maintenance' | 'requisition'
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'reimbursed'
          totalAmount?: number
          currency?: string
          description?: string
          attachments?: Json[]
          comments?: Json[]
          // Travel specific fields
          startDate?: string
          endDate?: string
          startLocation?: Json
          endLocation?: Json
          transportationType?: string
          mileage?: number
          fuelCost?: number
          tollCharges?: number
          accommodationCost?: number
          perDiemRate?: number
          // Maintenance specific fields
          serviceDate?: string
          category?: string
          assetId?: string
          vendorName?: string
          invoiceNumber?: string
          warrantyApplicable?: boolean
          // Requisition specific fields
          requiredBy?: string
          quantity?: number
          unitPrice?: number
          preferredVendor?: string
          urgencyLevel?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          avatar_url?: string
          department?: string
          role: string
          manager_id?: string
          expense_limit?: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          avatar_url?: string
          department?: string
          role?: string
          manager_id?: string
          expense_limit?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string
          department?: string
          role?: string
          manager_id?: string
          expense_limit?: number
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