/**
 * HEADER COMPONENT
 * 
 * This component displays the main application header.
 * Includes navigation, notifications, and user menu.
 * 
 * Dependencies: React, next/navigation
 * Used by: Root layout
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { useAuth } from '@/app/providers/auth-provider'
import { useRoleAccess } from '@/app/hooks/useRoleAccess'
import { NotificationDropdown } from '../notifications/NotificationDropdown'

type Role = 'user' | 'manager' | 'admin'

interface NavigationItem {
  name: string
  href: string
  roles?: Role[]
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Expenses', href: '/expenses' },
  { name: 'Approvals', href: '/approvals', roles: ['manager', 'admin'] },
  { name: 'Reports', href: '/reports', roles: ['manager', 'admin'] },
  { name: 'Settings', href: '/settings', roles: ['admin'] }
]

export function Header() {
  const { user, userProfile, signOut } = useAuth()
  const { hasAnyRole } = useRoleAccess()
  const pathname = usePathname()

  if (!user || !userProfile) return null

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Navigation */}
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard">
                <span className="text-xl font-bold text-blue-600">
                  ExpenseFlow
                </span>
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              {navigation.map(item => {
                if (item.roles && !hasAnyRole(item.roles)) {
                  return null
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium
                      ${pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right section */}
          <div className="flex items-center">
            {/* Notifications */}
            <NotificationDropdown />

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                {userProfile.avatar_url ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={userProfile.avatar_url}
                    alt={userProfile.full_name}
                  />
                ) : (
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <Link
                        href="/profile"
                        className={`
                          block px-4 py-2 text-sm text-gray-700
                          ${active ? 'bg-gray-100' : ''}
                        `}
                      >
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }: { active: boolean }) => (
                      <button
                        onClick={() => signOut()}
                        className={`
                          block w-full px-4 py-2 text-left text-sm text-gray-700
                          ${active ? 'bg-gray-100' : ''}
                        `}
                      >
                        Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  )
} 