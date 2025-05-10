"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Store, Product, Recipe, Order, Ingredient, ExpiryStatus } from "@/lib/types"
import { useAuth } from "@/context/auth-context"
import { isSupabaseConfigured, testSupabaseConnection, isDatabaseSchemaSetup } from "@/lib/supabase"
import {
  fetchStores,
  fetchProducts,
  fetchRecommendations,
  fetchOrders,
  fetchIngredients,
  addOrder,
  updateOrder,
  deleteOrder,
  addIngredient,
  updateIngredientExpiryDate as updateIngredientExpiry,
  deleteIngredient,
  seedData,
} from "@/lib/api-service"
import {
  fetchStores as fetchMockStores,
  fetchProducts as fetchMockProducts,
  fetchRecommendations as fetchMockRecommendations,
} from "@/lib/api"

interface SmartFridgeContextType {
  stores: Store[]
  products: Product[]
  recommendations: Recipe[]
  orders: Order[]
  ingredients: Ingredient[]
  loading: boolean
  isSupabaseConfigured: boolean
  databaseSchemaSetup: boolean
  addToOrder: (product: Product, quantity: number) => void
  removeFromOrder: (orderId: string) => void
  updateOrderQuantity: (orderId: string, quantity: number) => void
  confirmOrder: () => Promise<void>
  getProductsByStore: (storeId: string) => Product[]
  getStoreById: (storeId: string) => Store | undefined
  getProductById: (productId: string) => Product | undefined
  getIngredientExpiryStatus: (ingredient: Ingredient) => ExpiryStatus
  updateIngredientExpiryDate: (ingredientId: string, expiryDate: Date) => Promise<void>
  removeIngredient: (ingredientId: string) => Promise<void>
  addIngredientDirectly: (ingredient: Partial<Ingredient>) => Promise<void>
  addMultipleIngredients: (ingredients: Partial<Ingredient>[]) => Promise<void>
}

const SmartFridgeContext = createContext<SmartFridgeContextType | undefined>(undefined)

// Helper function to determine expiry status
const getExpiryStatus = (ingredient: Ingredient): ExpiryStatus => {
  if (!ingredient.expiryDate) return "fresh" as ExpiryStatus

  const today = new Date()
  const expiryDate = new Date(ingredient.expiryDate)

  // Check if already expired
  if (expiryDate < today) {
    return "expired" as ExpiryStatus
  }

  // Check if expiring soon (within 3 days)
  const threeDaysFromNow = new Date(today)
  threeDaysFromNow.setDate(today.getDate() + 3)

  if (expiryDate <= threeDaysFromNow) {
    return "expiring_soon" as ExpiryStatus
  }

  return "fresh" as ExpiryStatus
}

export function SmartFridgeProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const [stores, setStores] = useState<Store[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<Recipe[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [databaseSchemaSetup, setDatabaseSchemaSetup] = useState(false)
  const supabaseConfigured = isSupabaseConfigured()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        let storesData: Store[] = []
        let productsData: Product[] = []
        let recommendationsData: Recipe[] = []
        let schemaSetup = false

        if (supabaseConfigured) {
          // Use Supabase if configured
          try {
            console.log("Testing Supabase connection...")
            const connectionTest = await testSupabaseConnection()

            if (!connectionTest) {
              console.error("Supabase connection test failed")
              throw new Error("Supabase connection test failed")
            }

            console.log("Supabase connection successful, checking database schema...")

            // Check if the database schema is set up
            schemaSetup = await isDatabaseSchemaSetup()
            setDatabaseSchemaSetup(schemaSetup)

            if (!schemaSetup) {
              console.log("Database schema not set up. Using mock data.")
              // Don't throw an error here, just continue with mock data
              // This prevents the "Error with Supabase operations" message
            } else {
              console.log("Database schema is set up, attempting to seed data...")

              try {
                // Seed data for development (will only run if tables are empty)
                await seedData()
                console.log("Seed data process completed")
              } catch (seedError) {
                console.error("Error during seed data process:", seedError)
                // Continue even if seeding fails
              }

              console.log("Fetching data from Supabase...")

              // Fetch each data type separately to isolate errors
              try {
                storesData = await fetchStores()
                console.log(`Fetched ${storesData.length} stores`)
              } catch (storesError) {
                console.error("Error fetching stores:", storesError)
                storesData = await fetchMockStores()
                console.log("Using mock stores data instead")
              }

              try {
                productsData = await fetchProducts()
                console.log(`Fetched ${productsData.length} products`)
              } catch (productsError) {
                console.error("Error fetching products:", productsError)
                productsData = await fetchMockProducts()
                console.log("Using mock products data instead")
              }

              try {
                recommendationsData = await fetchRecommendations()
                console.log(`Fetched ${recommendationsData.length} recommendations`)
              } catch (recommendationsError) {
                console.error("Error fetching recommendations:", recommendationsError)
                recommendationsData = await fetchMockRecommendations()
                console.log("Using mock recommendations data instead")
              }
            }
          } catch (error) {
            console.error("Error with Supabase operations:", error)
            console.log("Falling back to mock data...")
            // Fallback to mock data if Supabase fetch fails
            storesData = await fetchMockStores()
            productsData = await fetchMockProducts()
            recommendationsData = await fetchMockRecommendations()
          }
        } else {
          // Use mock data if Supabase is not configured
          console.log("Using mock data (Supabase not configured)")
          storesData = await fetchMockStores()
          productsData = await fetchMockProducts()
          recommendationsData = await fetchMockRecommendations()
        }

        setStores(storesData)
        setProducts(productsData)
        setRecommendations(recommendationsData)

        // Fetch user-specific data if logged in and Supabase is configured
        if (user && supabaseConfigured && schemaSetup) {
          try {
            const [ordersData, ingredientsData] = await Promise.all([fetchOrders(user.id), fetchIngredients(user.id)])

            setOrders(ordersData)
            setIngredients(ingredientsData)
          } catch (error) {
            console.error("Error fetching user data:", error)
            // Initialize with empty arrays if fetch fails
            setOrders([])
            setIngredients([])
          }
        } else {
          // Initialize with mock data for ingredients if not logged in or Supabase not configured
          const today = new Date()
          const mockIngredients = [
            {
              id: "ing1",
              productId: "p1",
              name: "Eggs",
              quantity: 6,
              unit: "pcs",
              addedDate: new Date(today.setDate(today.getDate() - 5)),
              expiryDate: new Date(today.setDate(today.getDate() + 10)),
            },
            {
              id: "ing2",
              productId: "p5",
              name: "Milk",
              quantity: 1,
              unit: "liter",
              addedDate: new Date(today.setDate(today.getDate() - 3)),
              expiryDate: new Date(today.setDate(today.getDate() + 2)),
            },
            {
              id: "ing3",
              productId: "p10",
              name: "Onion",
              quantity: 2,
              unit: "pcs",
              addedDate: new Date(today.setDate(today.getDate() - 7)),
              expiryDate: new Date(today.setDate(today.getDate() - 1)),
            },
          ]

          setIngredients(mockIngredients)
          setOrders([])
        }
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadData()
    }
  }, [user, authLoading, supabaseConfigured])

  const getProductsByStore = (storeId: string) => {
    return products.filter((product) => product.storeId === storeId)
  }

  const getStoreById = (storeId: string) => {
    return stores.find((store) => store.id === storeId)
  }

  const getProductById = (productId: string) => {
    return products.find((product) => product.id === productId)
  }

  const getIngredientExpiryStatus = (ingredient: Ingredient): ExpiryStatus => {
    return getExpiryStatus(ingredient)
  }

  const updateIngredientExpiryDate = async (ingredientId: string, expiryDate: Date) => {
    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      setIngredients(
        ingredients.map((ingredient) => (ingredient.id === ingredientId ? { ...ingredient, expiryDate } : ingredient)),
      )
      return
    }

    const success = await updateIngredientExpiry(ingredientId, expiryDate)

    if (success) {
      setIngredients(
        ingredients.map((ingredient) => (ingredient.id === ingredientId ? { ...ingredient, expiryDate } : ingredient)),
      )
    }
  }

  const removeIngredient = async (ingredientId: string) => {
    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== ingredientId))
      return
    }

    const success = await deleteIngredient(ingredientId)

    if (success) {
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== ingredientId))
    }
  }

  const addIngredientDirectly = async (ingredient: Partial<Ingredient>): Promise<void> => {
    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      const newIngredient: Ingredient = {
        id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: ingredient.productId || undefined,
        name: ingredient.name || "Unknown Item",
        quantity: ingredient.quantity || 1,
        unit: ingredient.unit || "piece",
        addedDate: ingredient.addedDate || new Date(),
        expiryDate: ingredient.expiryDate,
      }
      setIngredients((prev) => [...prev, newIngredient])
      return
    }

    const newIngredient = await addIngredient(user.id, {
      productId: ingredient.productId,
      name: ingredient.name || "Unknown Item",
      quantity: ingredient.quantity || 1,
      unit: ingredient.unit || "piece",
      addedDate: ingredient.addedDate || new Date(),
      expiryDate: ingredient.expiryDate,
    } as Omit<Ingredient, "id">)

    if (newIngredient) {
      setIngredients((prev) => [...prev, newIngredient])
    }
  }

  const addMultipleIngredients = async (newIngredients: Partial<Ingredient>[]): Promise<void> => {
    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      const ingredientsToAdd = newIngredients.map((ingredient) => ({
        id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: ingredient.productId || undefined,
        name: ingredient.name || "Unknown Item",
        quantity: ingredient.quantity || 1,
        unit: ingredient.unit || "piece",
        addedDate: ingredient.addedDate || new Date(),
        expiryDate: ingredient.expiryDate,
      }))

      setIngredients((prev) => [...prev, ...ingredientsToAdd])
      return
    }

    const addedIngredients: Ingredient[] = []

    for (const ingredient of newIngredients) {
      const newIngredient = await addIngredient(user.id, {
        productId: ingredient.productId,
        name: ingredient.name || "Unknown Item",
        quantity: ingredient.quantity || 1,
        unit: ingredient.unit || "piece",
        addedDate: ingredient.addedDate || new Date(),
        expiryDate: ingredient.expiryDate,
      } as Omit<Ingredient, "id">)

      if (newIngredient) {
        addedIngredients.push(newIngredient)
      }
    }

    if (addedIngredients.length > 0) {
      setIngredients((prev) => [...prev, ...addedIngredients])
    }
  }

  const addToOrder = async (product: Product, quantity: number) => {
    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      const existingOrderIndex = orders.findIndex((order) => order.productId === product.id)

      if (existingOrderIndex >= 0) {
        const updatedOrders = [...orders]
        updatedOrders[existingOrderIndex].quantity += quantity
        setOrders(updatedOrders)
      } else {
        const newOrder = {
          id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          storeId: product.storeId,
          unit: product.unit,
        }
        setOrders((prevOrders) => [...prevOrders, newOrder])
      }
      return
    }

    // Check if product already exists in orders
    const existingOrder = orders.find((order) => order.productId === product.id)

    if (existingOrder) {
      // Update existing order
      const newQuantity = existingOrder.quantity + quantity
      const success = await updateOrder(existingOrder.id, newQuantity)

      if (success) {
        setOrders(orders.map((order) => (order.id === existingOrder.id ? { ...order, quantity: newQuantity } : order)))
      }
    } else {
      // Add new order
      const newOrder = await addOrder(user.id, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        storeId: product.storeId,
        unit: product.unit,
      })

      if (newOrder) {
        setOrders((prevOrders) => [...prevOrders, newOrder])
      }
    }
  }

  const removeFromOrder = async (orderId: string) => {
    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      setOrders(orders.filter((order) => order.id !== orderId))
      return
    }

    const success = await deleteOrder(orderId)

    if (success) {
      setOrders(orders.filter((order) => order.id !== orderId))
    }
  }

  const updateOrderQuantity = async (orderId: string, quantity: number) => {
    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      if (quantity <= 0) {
        setOrders(orders.filter((order) => order.id !== orderId))
        return
      }

      setOrders(orders.map((order) => (order.id === orderId ? { ...order, quantity } : order)))
      return
    }

    if (quantity <= 0) {
      await removeFromOrder(orderId)
      return
    }

    const success = await updateOrder(orderId, quantity)

    if (success) {
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, quantity } : order)))
    }
  }

  const confirmOrder = async () => {
    if (orders.length === 0) return

    if (!user || !supabaseConfigured || !databaseSchemaSetup) {
      // If not using Supabase, just update the local state
      const today = new Date()
      const newIngredients: Ingredient[] = []

      orders.forEach((order) => {
        const existingIngredientIndex = ingredients.findIndex((ing) => ing.productId === order.productId)

        if (existingIngredientIndex >= 0) {
          const updatedIngredients = [...ingredients]
          updatedIngredients[existingIngredientIndex].quantity += order.quantity
          setIngredients(updatedIngredients)
        } else {
          const product = products.find((p) => p.id === order.productId)
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + (product?.category.toLowerCase() === "meat" ? 5 : 14))

          newIngredients.push({
            id: `ing-${Date.now()}-${order.productId}`,
            productId: order.productId,
            name: order.name,
            quantity: order.quantity,
            unit: order.unit,
            addedDate: new Date(),
            expiryDate,
          })
        }
      })

      if (newIngredients.length > 0) {
        setIngredients((prev) => [...prev, ...newIngredients])
      }

      // Clear orders
      setOrders([])
      return
    }

    // Add ordered items to ingredients
    const newIngredients: Omit<Ingredient, "id">[] = []

    for (const order of orders) {
      const existingIngredient = ingredients.find((ing) => ing.productId === order.productId)

      if (existingIngredient) {
        // Update existing ingredient
        await addIngredient(user.id, {
          ...existingIngredient,
          quantity: existingIngredient.quantity + order.quantity,
        })
      } else {
        // Add new ingredient
        const product = products.find((p) => p.id === order.productId)
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + (product?.category.toLowerCase() === "meat" ? 5 : 14))

        newIngredients.push({
          productId: order.productId,
          name: order.name,
          quantity: order.quantity,
          unit: order.unit,
          addedDate: new Date(),
          expiryDate,
        })
      }
    }

    // Add all new ingredients
    await addMultipleIngredients(newIngredients)

    // Clear orders
    for (const order of orders) {
      await deleteOrder(order.id)
    }

    setOrders([])

    // Refresh ingredients
    if (user) {
      const updatedIngredients = await fetchIngredients(user.id)
      setIngredients(updatedIngredients)
    }
  }

  return (
    <SmartFridgeContext.Provider
      value={{
        stores,
        products,
        recommendations,
        orders,
        ingredients,
        loading,
        isSupabaseConfigured: supabaseConfigured,
        databaseSchemaSetup,
        addToOrder,
        removeFromOrder,
        updateOrderQuantity,
        confirmOrder,
        getProductsByStore,
        getStoreById,
        getProductById,
        getIngredientExpiryStatus,
        updateIngredientExpiryDate,
        removeIngredient,
        addIngredientDirectly,
        addMultipleIngredients,
      }}
    >
      {children}
    </SmartFridgeContext.Provider>
  )
}

export function useSmartFridge() {
  const context = useContext(SmartFridgeContext)
  if (context === undefined) {
    throw new Error("useSmartFridge must be used within a SmartFridgeProvider")
  }
  return context
}
