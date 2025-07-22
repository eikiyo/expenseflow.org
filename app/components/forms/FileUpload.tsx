/**
 * FILE UPLOAD COMPONENT
 * 
 * This component handles file uploads with drag and drop support.
 * Provides file validation, progress tracking, and preview.
 * 
 * Dependencies: React, storage-service
 * Used by: Expense form components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'
import { useAuth } from '@/app/providers/auth-provider'
import { uploadFile, validateFile } from '@/app/services/storage-service'
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { toast } from 'react-hot-toast'

interface FileUploadProps {
  name: string
  label: string
  required?: boolean
  maxFiles?: number
  className?: string
}

export function FileUpload({
  name,
  label,
  required = false,
  maxFiles = 5,
  className = ''
}: FileUploadProps) {
  const { user } = useAuth()
  const { register, setValue, watch } = useFormContext()
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  // Get current files from form
  const files = watch(name) || []

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user?.id) {
      toast.error('Please log in to upload files')
      return
    }

    // Check if adding these files would exceed the limit
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Upload each file
    for (const file of acceptedFiles) {
      try {
        // Validate file
        const error = validateFile(file)
        if (error) {
          toast.error(error)
          continue
        }

        // Upload with progress tracking
        const uploadedFile = await uploadFile(file, user.id, 'receipts', {
          onProgress: (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }))
          }
        })

        // Add to form state
        setValue(name, [...files, uploadedFile], { shouldValidate: true })
        toast.success('File uploaded successfully')
      } catch (error) {
        console.error('Upload error:', error)
        toast.error('Failed to upload file')
      } finally {
        // Clear progress
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[file.name]
          return newProgress
        })
      }
    }
  }, [user, files, maxFiles, name, setValue])

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'application/pdf': ['.pdf']
    },
    maxFiles
  })

  // Remove a file
  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setValue(name, newFiles, { shouldValidate: true })
  }

  // Register field with form
  register(name)

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div
        {...getRootProps()}
        className={`
          mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6
          ${isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <input {...getInputProps()} />
            <p className="pl-1">
              Drag and drop files here, or click to select files
            </p>
          </div>
          <p className="text-xs text-gray-500">
            JPEG, PNG, HEIC or PDF up to 10MB
          </p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-4 divide-y divide-gray-200 rounded-md border border-gray-200">
          {files.map((file: any, index: number) => (
            <li
              key={file.fileUrl}
              className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
            >
              <div className="flex w-0 flex-1 items-center">
                <DocumentIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-2 w-0 flex-1 truncate">
                  {file.fileName}
                </span>
              </div>
              <div className="ml-4 flex flex-shrink-0 space-x-4">
                {uploadProgress[file.fileName] !== undefined && (
                  <span className="text-sm text-gray-500">
                    {Math.round(uploadProgress[file.fileName])}%
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 