/**
 * SIMPLIFIED ROOT LAYOUT
 * 
 * This is the root layout component that wraps all pages.
 * Uses simplified client-side auth without complex server session handling.
 * 
 * Dependencies: next/font, simplified auth provider
 * Used by: Next.js App Router
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import './globals.css';
import { RootLayoutClient } from './root-layout-client';

export const metadata = {
  title: 'ExpenseFlow',
  description: 'Streamline your expense management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
} 