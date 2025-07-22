/**
 * NOTIFICATION SERVICE
 * 
 * This file handles all notification operations.
 * Provides functions for sending emails and managing notifications.
 * 
 * Dependencies: @sendgrid/mail
 * Used by: Approval workflow and notification components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import sgMail from '@sendgrid/mail'
import { supabase } from '@/lib/supabase'
import type { ExpenseUser } from '@/lib/supabase'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface NotificationData {
  id?: string
  userId: string
  type: 'expense_submitted' | 'expense_approved' | 'expense_rejected' | 'comment_added'
  title: string
  message: string
  link?: string
  read?: boolean
  createdAt?: string
}

// Save notification to database
async function saveNotification(data: NotificationData) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      ...data,
      read: false,
      created_at: new Date().toISOString()
    })

  if (error) throw error
}

// Send email notification
async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not found. Skipping email notification.')
    return
  }

  try {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      html
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Get user's email template preferences
async function getUserEmailPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('email_notifications')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data?.email_notifications || {}
}

// Notify user about expense submission
export async function notifyExpenseSubmitted(
  expense: any,
  submitter: ExpenseUser,
  approver: ExpenseUser
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  // Create notification data
  const notificationData: NotificationData = {
    userId: approver.id,
    type: 'expense_submitted',
    title: 'New Expense Submission',
    message: `${submitter.full_name} has submitted a ${expense.type} expense for ${expense.currency} ${expense.totalAmount} for your approval.`,
    link: `${baseUrl}/approvals/${expense.id}`
  }

  try {
    // Save notification
    await saveNotification(notificationData)

    // Check if user wants email notifications
    const preferences = await getUserEmailPreferences(approver.id)
    if (preferences.expense_submitted) {
      // Send email
      const emailHtml = `
        <h2>New Expense Submission</h2>
        <p>${notificationData.message}</p>
        <p>Click <a href="${notificationData.link}">here</a> to review the expense.</p>
      `

      await sendEmail(
        approver.email,
        notificationData.title,
        emailHtml
      )
    }
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

// Notify user about expense approval/rejection
export async function notifyExpenseStatus(
  expense: any,
  submitter: ExpenseUser,
  approver: ExpenseUser,
  status: 'approved' | 'rejected',
  comment?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  // Create notification data
  const notificationData: NotificationData = {
    userId: submitter.id,
    type: status === 'approved' ? 'expense_approved' : 'expense_rejected',
    title: `Expense ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `Your ${expense.type} expense for ${expense.currency} ${expense.totalAmount} has been ${status} by ${approver.full_name}${comment ? `: ${comment}` : '.'}`,
    link: `${baseUrl}/expenses/${expense.id}`
  }

  try {
    // Save notification
    await saveNotification(notificationData)

    // Check if user wants email notifications
    const preferences = await getUserEmailPreferences(submitter.id)
    if (preferences[`expense_${status}`]) {
      // Send email
      const emailHtml = `
        <h2>Expense ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
        <p>${notificationData.message}</p>
        <p>Click <a href="${notificationData.link}">here</a> to view the expense.</p>
      `

      await sendEmail(
        submitter.email,
        notificationData.title,
        emailHtml
      )
    }
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

// Get user's unread notifications
export async function getUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Mark notification as read
export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  if (error) throw error
}

// Mark all notifications as read
export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
} 