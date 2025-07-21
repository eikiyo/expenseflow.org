// Supabase Configuration
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
};

// Application Configuration
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'ExpenseFlow',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 5242880, // 5MB
  allowedFileTypes: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

// Database Configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL
};

// Google Maps Configuration
export const mapsConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
}; 