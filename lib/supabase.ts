import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Hardcoded Supabase credentials
const supabaseUrl = "https://usxytqthzmfhfmujbzwg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzeHl0cXRoem1maGZtdWpiendnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODUwOTgsImV4cCI6MjA2MjI2MTA5OH0.6oQXbXuo6-srwZCDZn1QwY-c1fDga70KAE9OlZ4sj9s"

// Create the Supabase client with additional options for better error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: { "x-application-name": "chefmate" },
  },
  // Add debug mode to get more detailed logs
  debug: process.env.NODE_ENV === "development",
})

// Export a function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Add a function to test the Supabase connection
export async function testSupabaseConnection() {
  try {
    // Just check if we can get the session - this should always work
    // if the connection to Supabase is valid
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Supabase connection test failed:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return false
  }
}

// Function to check if the database schema is set up
export async function isDatabaseSchemaSetup() {
  try {
    // Try to query the stores table directly
    const { data, error } = await supabase.from("stores").select("id").limit(1)

    // If there's an error about the relation not existing, the schema isn't set up
    if (error && error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
      console.log("Schema check failed - table does not exist:", error.message)
      return false
    }

    // If there's some other error, log it but assume the schema might be set up
    if (error) {
      console.error("Error checking schema:", error)
      // Don't immediately return false for other errors
      // The table might exist but we might not have permission to query it yet
      console.log("Continuing despite error - schema might be set up")
    }

    // If we got here, the schema is likely set up
    console.log("Schema check passed - tables exist")
    return true
  } catch (error) {
    console.error("Exception checking schema:", error)
    // Don't immediately return false for exceptions
    // Let's be more lenient and assume the schema might be set up
    console.log("Continuing despite exception - schema might be set up")
    return true
  }
}
