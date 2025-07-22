'use client'

import { AuthProvider } from './providers/auth-provider'
import { ExpenseProvider } from './providers/expense-provider'
import { RouteGuard } from './components/auth/RouteGuard'
import { Toaster } from 'react-hot-toast'

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <RouteGuard>
        <ExpenseProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ExpenseProvider>
      </RouteGuard>
    </AuthProvider>
  )
} 