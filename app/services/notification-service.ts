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

import { getSupabaseClient } from '@/lib/supabase';

export interface Notification {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  type: 'error' | 'info' | 'success' | 'warning';
  is_read: boolean;
  created_at: string;
}

export async function sendNotification(to: string, subject: string, html: string, notification: Partial<Notification>) {
  const response = await fetch('/api/notifications/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, subject, html, notification }),
  });

  if (!response.ok) {
    throw new Error('Failed to send notification');
  }

  return response.json();
}

export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .is('read_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);

  if (error) throw error;
}

export async function notifyExpenseSubmitted(expense: any, submitter: any, approver: any) {
  const subject = `New Expense Submission from ${submitter.full_name}`;
  const html = `
    <h2>New Expense Submission</h2>
    <p>A new expense has been submitted for your approval:</p>
    <ul>
      <li>Submitter: ${submitter.full_name}</li>
      <li>Amount: ${expense.currency} ${expense.totalAmount}</li>
      <li>Type: ${expense.type}</li>
      <li>Description: ${expense.description}</li>
    </ul>
    <p>Please review and take action on this expense.</p>
  `;

  return sendNotification(approver.email, subject, html, {
    user_id: approver.id,
    type: 'info',
    title: subject,
    message: html,
    is_read: false,
    created_at: new Date().toISOString()
  });
}

export async function notifyExpenseStatus(expense: any, submitter: any, approver: any, status: 'approved' | 'rejected', comment?: string) {
  const subject = `Expense ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  const html = `
    <h2>Expense ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
    <p>Your expense submission has been ${status}:</p>
    <ul>
      <li>Amount: ${expense.currency} ${expense.totalAmount}</li>
      <li>Type: ${expense.type}</li>
      <li>Description: ${expense.description}</li>
      ${comment ? `<li>Comment: ${comment}</li>` : ''}
    </ul>
    <p>Approved by: ${approver.full_name}</p>
  `;

  return sendNotification(submitter.email, subject, html, {
    user_id: submitter.id,
    type: status === 'approved' ? 'success' : 'error',
    title: subject,
    message: html,
    is_read: false,
    created_at: new Date().toISOString()
  });
} 