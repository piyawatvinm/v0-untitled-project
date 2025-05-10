export interface Store {
  id: string
  name: string
  logoUrl: string
  location: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  unit: string
  storeId: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  imageUrl: string
  ingredients: RecipeIngredient[]
}

export interface RecipeIngredient {
  id: string
  name: string
  quantity: number
  unit: string
}

export interface Order {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  storeId: string
  unit: string
}

export interface Ingredient {
  id: string
  productId?: string
  name: string
  quantity: number
  unit: string
  expiryDate?: Date
  addedDate?: Date
}

export enum ExpiryStatus {
  FRESH = "fresh",
  EXPIRING_SOON = "expiring_soon", // Within 3 days
  EXPIRED = "expired",
}

export interface ExtractedItem {
  name: string
  quantity: number
  unit: string
  productId?: string
  expiryDate?: Date
  addedDate?: Date
}
