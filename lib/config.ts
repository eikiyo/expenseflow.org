/**
 * APPLICATION CONFIGURATION
 * 
 * This file contains environment-specific configuration values.
 * Ensures consistent URLs and configuration across the application.
 * 
 * Dependencies: None
 * Used by: Auth flows and API routes
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

// Base URLs without trailing slashes
export const APP_URLS = {
  development: 'http://localhost:3000',
  preview: 'https://expenseflow-org-git-main-eikiyos-projects.vercel.app',
  production: 'https://expenseflow.org' // No www
} as const;

// Get the current environment
export const getEnvironment = () => {
  if (process.env.NODE_ENV === 'development') return 'development';
  if (process.env.VERCEL_ENV === 'preview') return 'preview';
  return 'production';
};

// Get the base URL for the current environment
export const getBaseUrl = () => {
  const env = getEnvironment();
  return APP_URLS[env];
};

// Get the OAuth callback URL for the current environment
export const getOAuthCallbackUrl = () => {
  return `${getBaseUrl()}/auth/callback`;
};

// Get the Supabase project URL
export const getSupabaseUrl = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || '';
};

// Get the Supabase OAuth callback URL
export const getSupabaseOAuthUrl = () => {
  return `${getSupabaseUrl()}/auth/v1/callback`;
};

// Validate configuration
export const validateConfig = () => {
  const missingEnvVars = [];
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missingEnvVars.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missingEnvVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  // Validate URL formats
  const baseUrl = getBaseUrl();
  if (!baseUrl.startsWith('http')) {
    throw new Error(`Invalid base URL: ${baseUrl}`);
  }

  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl.startsWith('https')) {
    throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
  }
}; 