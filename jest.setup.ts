process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_anon_key';

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Extend expect
import { expect } from '@jest/globals'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare global {
  namespace jest {
    interface Matchers<R = void> extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
} 