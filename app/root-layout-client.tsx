'use client';

import { AuthProvider } from './providers/auth-provider';
import { ExpenseProvider } from './providers/expense-provider';
import { RouteGuard } from './components/auth/RouteGuard';
import { Toaster } from 'react-hot-toast';
import type { Session } from '@supabase/supabase-js';

interface RootLayoutClientProps {
  children: React.ReactNode;
  serverSession: Session | null;
}

export function RootLayoutClient({
  children,
  serverSession,
}: RootLayoutClientProps) {
  return (
    <AuthProvider initialSession={serverSession}>
      {/* <RouteGuard> */}
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
      {/* </RouteGuard> */}
    </AuthProvider>
  );
} 