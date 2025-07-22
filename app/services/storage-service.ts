/**
 * STORAGE SERVICE
 * 
 * This file handles all file storage operations with Supabase.
 * Provides functions for uploading, downloading, and managing files.
 * 
 * Dependencies: @supabase/supabase-js
 * Used by: File upload components and services
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { getSupabaseClient } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'application/pdf'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface UploadOptions {
  onProgress?: (progress: number) => void
}

interface UploadProgress {
  loaded: number
  total: number
}

interface UploadResult {
  fileUrl: string
  fileName: string
  fileType: string
}

// Validates file type and size
export function validateFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload a JPEG, PNG, HEIC, or PDF file.'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 10MB limit.'
  }

  return null
}

// Validates and uploads file to Supabase storage bucket
export async function uploadFile(
  file: File, 
  userId: string, 
  category: string = 'receipts',
  options: UploadOptions = {}
): Promise<UploadResult> {
  const supabase = getSupabaseClient();
  
  const error = validateFile(file)
  if (error) throw new Error(error)

  // Generate a unique file name
  const fileExt = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = `${userId}/${fileName}`

  // Upload the file with progress tracking
  const { data, error: uploadError } = await supabase.storage
    .from('expense-receipts')
    .upload(filePath, file, {
      upsert: false,
      ...(options?.onProgress && {
        onUploadProgress: (progress: UploadProgress) => {
          const percentage = (progress.loaded / progress.total) * 100
          options.onProgress!(percentage)
        }
      })
    })

  if (uploadError) throw uploadError

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('expense-receipts')
    .getPublicUrl(filePath)

  return {
    fileUrl: publicUrl,
    fileName: file.name,
    fileType: file.type
  }
}

// Downloads a file from Supabase storage
export async function downloadFile(bucket: string, filePath: string): Promise<Blob | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.storage
    .from('expense-receipts')
    .download(filePath)

  if (error) throw error
  if (!data) throw new Error('File not found')

  return data
}

// Gets public URL for a file in storage
export function getFileUrl(bucket: string, filePath: string): string {
  const supabase = getSupabaseClient();
  
  const { data: { publicUrl } } = supabase.storage
    .from('expense-receipts')
    .getPublicUrl(filePath)

  return publicUrl || ''
}

// Deletes a file from storage
export async function deleteFile(bucket: string, filePath: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.storage
    .from('expense-receipts')
    .remove([filePath])

  if (error) throw error
  return true
}

// Lists files in a storage bucket
export async function listFiles(bucket: string, path: string = ''): Promise<any[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase.storage
    .from('expense-receipts')
    .list(path)

  if (error) throw error
  return data
} 