/**
 * ROOT LAYOUT
 * 
 * This is the root layout component that wraps all pages.
 * Handles server-side session initialization using @supabase/ssr.
 * 
 * Dependencies: next/headers, @supabase/ssr
 * Used by: Next.js App Router
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import './globals.css';
import { RootLayoutClient } from './root-layout-client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

export const metadata = {
  title: 'ExpenseFlow',
  description: 'Streamline your expense management',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookies) {
          cookies.forEach(cookie => {
            cookieStore.set(cookie.name, cookie.value, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/'
            })
          })
        }
      }
    }
  );

  try {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session in root layout:', error);
      // Clear any potentially corrupted session cookies
      const authCookies = cookieStore.getAll()
        .filter(cookie => cookie.name.includes('supabase') || cookie.name.includes('sb-'));
      
      authCookies.forEach(cookie => {
        cookieStore.delete(cookie.name);
      });
    }

    return (
      <html lang="en">
        <body>
          <RootLayoutClient serverSession={session}>
            {children}
          </RootLayoutClient>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Unexpected error in root layout:', error);
    return (
      <html lang="en">
        <body>
          <RootLayoutClient serverSession={null}>
            {children}
          </RootLayoutClient>
        </body>
      </html>
    );
  }
} 