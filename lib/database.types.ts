export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          name: string
          quantity: number
          unit: string
          expiry_date: string | null
          added_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          name: string
          quantity: number
          unit: string
          expiry_date?: string | null
          added_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          name?: string
          quantity?: number
          unit?: string
          expiry_date?: string | null
          added_date?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          product_id: string
          name: string
          price: number
          quantity: number
          store_id: string
          unit: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          name: string
          price: number
          quantity: number
          store_id: string
          unit: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          name?: string
          price?: number
          quantity?: number
          store_id?: string
          unit?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          category: string
          price: number
          unit: string
          store_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          price: number
          unit: string
          store_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          price?: number
          unit?: string
          store_id?: string
          created_at?: string
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          name: string
          quantity: number
          unit: string
          created_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          name: string
          quantity: number
          unit: string
          created_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          name?: string
          quantity?: number
          unit?: string
          created_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string | null
          created_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          location: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          location: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          location?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
