/**
 * ROOT LAYOUT CLIENT
 * 
 * Client-side root layout component that wraps the app with providers.
 * Handles auth state and error boundaries.
 * 
 * Dependencies: react, @supabase/auth-helpers-nextjs
 * Used by: Root layout
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client';

import { AuthProvider } from './providers/auth-provider';
import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary';
import type { Session } from '@supabase/supabase-js';

interface RootLayoutClientProps {
  children: React.ReactNode;
  serverSession: Session | null;
}

export function RootLayoutClient({ children, serverSession }: RootLayoutClientProps) {
  return (
    <AuthErrorBoundary>
      <AuthProvider initialSession={serverSession}>
        {children}
      </AuthProvider>
    </AuthErrorBoundary>
  );
} 