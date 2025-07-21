import { Inter } from 'next/font/google'
import { RootLayoutClient } from './root-layout-client'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ExpenseFlow - Travel & Petty Expense Management',
  description: 'Comprehensive expense management platform for travel, maintenance, and requisition expenses',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
} 