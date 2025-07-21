// Supabase Configuration
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jbkzcjdqbuhgxahhzkno.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || 'jbkzcjdqbuhgxahhzkno'
};

// Application Configuration
export const appConfig = {
  name: 'ExpenseFlow',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  maxFileSize: 5242880, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

// Database Configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL
};

// Google Maps Configuration
export const mapsConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}; 