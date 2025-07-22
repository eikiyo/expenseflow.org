/**
 * NOTIFICATION DROPDOWN COMPONENT
 * 
 * This component displays a dropdown of user notifications.
 * Handles notification display, marking as read, and navigation.
 * 
 * Dependencies: React, notification-service
 * Used by: Header component
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BellIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/app/providers/auth-provider'
import {
  getUnreadNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '@/app/services/notification-service'
import { format } from 'date-fns'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()
  const router = useRouter()

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return

    // Fetches unread notifications for the current user and updates state
    // Ensures correct Notification type mapping to prevent runtime errors
    try {
      const data = await getUnreadNotifications(user.id)
      // Defensive mapping to ensure all Notification fields are present
      const mapped = data.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        read: n.read,
        created_at: n.created_at
      })) as Notification[]
      setNotifications(mapped)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Load notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications()
  }, [user])

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read
      await markNotificationRead(notification.id)

      // Remove from list
      setNotifications(prev =>
        prev.filter(n => n.id !== notification.id)
      )

      // Navigate if link exists
      if (notification.link) {
        router.push(notification.link)
      }

      // Close dropdown
      setIsOpen(false)
    } catch (error) {
      console.error('Error handling notification:', error)
    }
  }

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (!user) return

    try {
      await markAllNotificationsRead(user.id)
      setNotifications([])
      setIsOpen(false)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  return (
    <div className="relative">
      {/* Notification bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="mt-4 divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  No new notifications
                </p>
              ) : (
                notifications.map(notification => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {format(new Date(notification.created_at), 'PPp')}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 