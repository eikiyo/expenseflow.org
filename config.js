// Supabase Configuration
export const supabaseConfig = {
  url: 'https://jbkzcjdqbuhgxahhzkno.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impia3pjamRxYnVoZ3hhaGh6a25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDY0MTYsImV4cCI6MjA2ODY4MjQxNn0.9ywKDUR0KJMugrNXzk3koBC38vLmQgwTtwsdvZHFurc',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impia3pjamRxYnVoZ3hhaGh6a25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDY0MTYsImV4cCI6MjA2ODY4MjQxNn0.9ywKDUR0KJMugrNXzk3koBC38vLmQgwTtwsdvZHFurc',
  projectId: 'jbkzcjdqbuhgxahhzkno'
};

// Application Configuration
export const appConfig = {
  name: 'ExpenseFlow',
  version: '1.0.0',
  environment: 'development',
  maxFileSize: 5242880, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

// Database Configuration
export const databaseConfig = {
  url: 'postgresql://postgres:Shakiba420@@@db.jbkzcjdqbuhgxahhzkno.supabase.co:5432/postgres'
};

// Google Maps Configuration (you'll need to get an API key)
export const mapsConfig = {
  apiKey: 'your_google_maps_api_key_here'
}; 