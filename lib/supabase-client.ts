import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Use the environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
