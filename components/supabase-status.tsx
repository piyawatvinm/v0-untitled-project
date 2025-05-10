"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2, Database } from "lucide-react"
import { testSupabaseConnection, isDatabaseSchemaSetup } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SupabaseStatus() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "success" | "error">("loading")
  const [schemaStatus, setSchemaStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [detailedInfo, setDetailedInfo] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check Supabase connection
        const isConnected = await testSupabaseConnection()
        setConnectionStatus(isConnected ? "success" : "error")

        if (isConnected) {
          // Check if database schema is set up
          const isSchemaSetup = await isDatabaseSchemaSetup()
          setSchemaStatus(isSchemaSetup ? "success" : "error")
        } else {
          setSchemaStatus("error")
        }

        // Get environment variable info (without exposing actual values)
        const supabaseUrlExists = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
        const supabaseKeyExists = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

        setDetailedInfo(`
          Environment Variables:
          - NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrlExists ? "Set" : "Not set"}
          - NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKeyExists ? "Set" : "Not set"}
          
          Connection Status: ${isConnected ? "Connected" : "Failed"}
          Schema Status: ${connectionStatus === "success" && schemaStatus === "success" ? "Set up" : "Not set up"}
        `)
      } catch (error) {
        setConnectionStatus("error")
        setSchemaStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Unknown error")
      }
    }

    checkConnection()
  }, [connectionStatus, schemaStatus])

  if (connectionStatus === "loading") {
    return (
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertTitle className="text-blue-800">Testing Supabase Connection</AlertTitle>
        <AlertDescription className="text-blue-700">Checking connection to your Supabase database...</AlertDescription>
      </Alert>
    )
  }

  if (connectionStatus === "success" && schemaStatus === "success") {
    return (
      <Alert className="mb-6 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Supabase Connected</AlertTitle>
        <AlertDescription className="text-green-700">
          Successfully connected to your Supabase database and schema is set up.
        </AlertDescription>
      </Alert>
    )
  }

  if (connectionStatus === "success" && schemaStatus === "error") {
    return (
      <Alert className="mb-6 bg-amber-50 border-amber-200">
        <Database className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Database Schema Not Set Up</AlertTitle>
        <AlertDescription className="text-amber-700">
          <p>Connected to Supabase, but the database tables don't exist yet.</p>
          <p className="mt-2">
            Please run the schema.sql file in your Supabase SQL Editor to create the necessary tables. The app is
            currently running in demo mode with mock data.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/schema.sql" target="_blank">
              <Button size="sm" variant="outline" className="text-amber-800 border-amber-300 hover:bg-amber-100">
                View Schema SQL
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-amber-800 border-amber-300 hover:bg-amber-100"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>

          {showDetails && detailedInfo && (
            <pre className="mt-2 p-2 bg-amber-100 rounded text-xs whitespace-pre-wrap">{detailedInfo}</pre>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-6 bg-amber-50 border-amber-200">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Supabase Connection Failed</AlertTitle>
      <AlertDescription className="text-amber-700">
        {errorMessage || "Could not connect to your Supabase database. The app is running in demo mode."}

        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-amber-800 border-amber-300 hover:bg-amber-100"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>

          {showDetails && detailedInfo && (
            <pre className="mt-2 p-2 bg-amber-100 rounded text-xs whitespace-pre-wrap">{detailedInfo}</pre>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
