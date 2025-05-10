import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { SmartFridgeProvider } from "@/context/smart-fridge-context"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { checkRequiredEnvVars } from "@/lib/env-check"

// Check environment variables
checkRequiredEnvVars()

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ChefMate",
  description: "Your intelligent kitchen companion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SmartFridgeProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Toaster />
              </div>
            </SmartFridgeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
