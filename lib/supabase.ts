import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../config'

const supabaseUrl = supabaseConfig.url
const supabaseAnonKey = supabaseConfig.anonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Types for our database tables
export interface ExpenseUser {
  id: string
  email: string
  full_name: string
  employee_id: string
  role: 'employee' | 'manager' | 'finance' | 'admin'
  department?: string
  manager_id?: string
  phone?: string
  address?: string
  monthly_budget: number
  single_transaction_limit: number
  profile_picture_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ExpenseSubmission {
  id: string
  submission_number: string
  user_id: string
  expense_type: 'travel' | 'maintenance' | 'requisition'
  status: 'draft' | 'submitted' | 'pending_manager' | 'pending_finance' | 'approved' | 'rejected' | 'cancelled'
  total_amount: number
  business_purpose: string
  submission_date?: string
  created_at: string
  updated_at: string
}

export interface TransportationExpense {
  id: string
  submission_id: string
  transport_method: 'van' | 'rickshaw' | 'boat' | 'cng' | 'train' | 'plane' | 'launch' | 'ferry' | 'bike' | 'car'
  vehicle_ownership: 'own' | 'rental' | 'public'
  vehicle_model?: string
  license_plate?: string
  start_location: string
  start_coordinates?: any
  end_location: string
  end_coordinates?: any
  departure_datetime: string
  return_datetime?: string
  is_round_trip: boolean
  start_odometer?: number
  end_odometer?: number
  distance_km?: number
  base_cost: number
  fuel_cost: number
  toll_charges: number
  total_cost: number
  created_at: string
}

export interface FoodAccommodationExpense {
  id: string
  submission_id: string
  expense_date: string
  meal_types: ('breakfast' | 'lunch' | 'dinner' | 'snacks')[]
  hotel_name?: string
  hotel_location?: string
  check_in_date?: string
  check_out_date?: string
  nights_count: number
  food_cost: number
  accommodation_cost: number
  total_cost: number
  created_at: string
}

export interface MaintenanceExpense {
  id: string
  submission_id: string
  category: 'charges' | 'purchases' | 'repairs'
  subcategory: string
  vehicle_type?: string
  vehicle_model?: string
  service_purpose: string
  service_date: string
  duration_months: number
  contractor_details?: string
  equipment_purchased: boolean
  total_cost: number
  created_at: string
}

export interface ExpenseAttachment {
  id: string
  submission_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  description?: string
  uploaded_at: string
}

export interface ExpenseApproval {
  id: string
  submission_id: string
  approver_id: string
  approval_level: number
  action?: 'approve' | 'reject' | 'request_changes'
  comments?: string
  approved_at?: string
  created_at: string
}

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helper functions
export const getUserProfile = async (userId: string): Promise<ExpenseUser | null> => {
  const { data, error } = await supabase
    .from('expense_users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data
}

export const getUserSubmissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('expense_submissions')
    .select(`
      *,
      transportation_expenses(*),
      food_accommodation_expenses(*),
      maintenance_expenses(*),
      requisition_expenses(*),
      expense_attachments(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching submissions:', error)
    return []
  }
  
  return data || []
}

export const createExpenseSubmission = async (submission: Partial<ExpenseSubmission>) => {
  const { data, error } = await supabase
    .from('expense_submissions')
    .insert([submission])
    .select()
    .single()
  
  return { data, error }
}

export const updateExpenseSubmission = async (id: string, updates: Partial<ExpenseSubmission>) => {
  const { data, error } = await supabase
    .from('expense_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

// File upload helper
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  return { data, error }
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
} 