"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isSupabaseConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabaseConfigured = isSupabaseConfigured()

  useEffect(() => {
    // Skip auth if Supabase is not configured
    if (!supabaseConfigured) {
      setIsLoading(false)
      return
    }

    // Get session from local storage
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        setSession(data.session)
        setUser(data.session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    let authListener: { subscription: { unsubscribe: () => void } } | null = null

    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      })
      authListener = data
    } catch (error) {
      console.error("Error setting up auth listener:", error)
      setIsLoading(false)
    }

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabaseConfigured])

  const signIn = async (email: string, password: string) => {
    if (!supabaseConfigured) {
      return { error: new Error("Supabase is not configured") }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabaseConfigured) {
      return { error: new Error("Supabase is not configured"), data: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      return { data, error }
    } catch (error) {
      console.error("Error signing up:", error)
      return { error, data: null }
    }
  }

  const signOut = async () => {
    if (!supabaseConfigured) {
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isSupabaseConfigured: supabaseConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
