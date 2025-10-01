import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env or .env.development
dotenv.config();
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: path.join(__dirname, '../../.env.development') });
}

const supabaseUrl = process.env.SUPABASE_URL || 'https://temp-placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.temp-placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.temp-service-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Using placeholder Supabase configuration for development');
  console.warn('⚠️  Please set up real Supabase credentials for production');
}

// Client for general operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for service operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;
