import StoreList from "@/components/store-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function SupabaseDemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Supabase Integration Demo</h1>
      <p className="text-muted-foreground mb-6">
        This page demonstrates that your Supabase environment variables are working correctly.
      </p>

      <Alert className="mb-6 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Environment Variables Loaded</AlertTitle>
        <AlertDescription className="text-green-700">
          Your Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) have been
          successfully loaded.
        </AlertDescription>
      </Alert>

      <h2 className="text-2xl font-bold mb-4">Stores from Supabase</h2>
      <StoreList />
    </div>
  )
}
