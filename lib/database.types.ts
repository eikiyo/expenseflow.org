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
          user_id: string
          expense_number: string
          type: 'travel' | 'maintenance' | 'requisition'
          status: 'draft' | 'submitted' | 'approved' | 'rejected'
          title: string
          description: string
          total_amount: number
          currency: string
          expense_data: Json
          submitted_at: string | null
          approved_at: string | null
          approver_id: string | null
          approval_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expense_number?: string
          type: 'travel' | 'maintenance' | 'requisition'
          status?: 'draft' | 'submitted' | 'approved' | 'rejected'
          title: string
          description: string
          total_amount: number
          currency?: string
          expense_data?: Json
          submitted_at?: string | null
          approved_at?: string | null
          approver_id?: string | null
          approval_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expense_number?: string
          type?: 'travel' | 'maintenance' | 'requisition'
          status?: 'draft' | 'submitted' | 'approved' | 'rejected'
          title?: string
          description?: string
          total_amount?: number
          currency?: string
          expense_data?: Json
          submitted_at?: string | null
          approved_at?: string | null
          approver_id?: string | null
          approval_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      attachments: {
        Row: {
          id: string
          expense_id: string
          filename: string
          file_path: string
          file_size: number
          content_type: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          filename: string
          file_path: string
          file_size: number
          content_type: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          filename?: string
          file_path?: string
          file_size?: number
          content_type?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          }
        ]
      }
      approvals: {
        Row: {
          id: string
          expense_id: string
          approver_id: string
          action: 'approved' | 'rejected'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          approver_id: string
          action: 'approved' | 'rejected'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          approver_id?: string
          action?: 'approved' | 'rejected'
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          department: string | null
          role: 'user' | 'manager' | 'admin'
          manager_id: string | null
          approval_limit: number | null
          monthly_budget: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          department?: string | null
          role?: 'user' | 'manager' | 'admin'
          manager_id?: string | null
          approval_limit?: number | null
          monthly_budget?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          department?: string | null
          role?: 'user' | 'manager' | 'admin'
          manager_id?: string | null
          approval_limit?: number | null
          monthly_budget?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 