"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function SupabaseWarning() {
  const { isSupabaseConfigured } = useAuth()

  if (isSupabaseConfigured) {
    return null
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Supabase Configuration Missing</AlertTitle>
      <AlertDescription>
        The application is running in demo mode because Supabase environment variables are missing. Some features may be
        limited. Please check your environment configuration.
      </AlertDescription>
    </Alert>
  )
}
