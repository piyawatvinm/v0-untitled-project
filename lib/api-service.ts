import { supabase } from "./supabase"
import type { Store, Product, Recipe, Order, Ingredient, RecipeIngredient } from "./types"

// Stores
export async function fetchStores(): Promise<Store[]> {
  try {
    const { data, error } = await supabase.from("stores").select("*").order("name")

    if (error) {
      console.error("Error fetching stores:", error)
      return []
    }

    return data.map((store) => ({
      id: store.id,
      name: store.name,
      logoUrl: store.logo_url || "/placeholder.svg?height=50&width=50",
      location: store.location,
    }))
  } catch (error) {
    console.error("Exception fetching stores:", error)
    return []
  }
}

// Products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from("products").select("*").order("name")

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      storeId: product.store_id,
    }))
  } catch (error) {
    console.error("Exception fetching products:", error)
    return []
  }
}

// Recipes
export async function fetchRecommendations(): Promise<Recipe[]> {
  try {
    const { data: recipesData, error: recipesError } = await supabase.from("recipes").select("*").order("name")

    if (recipesError) {
      console.error("Error fetching recipes:", recipesError)
      return []
    }

    const recipes: Recipe[] = []

    for (const recipe of recipesData) {
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from("recipe_ingredients")
        .select("*")
        .eq("recipe_id", recipe.id)

      if (ingredientsError) {
        console.error("Error fetching recipe ingredients:", ingredientsError)
        continue
      }

      const ingredients: RecipeIngredient[] = ingredientsData.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      }))

      recipes.push({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        imageUrl: recipe.image_url || "/placeholder.svg?height=200&width=300",
        ingredients,
      })
    }

    return recipes
  } catch (error) {
    console.error("Exception fetching recommendations:", error)
    return []
  }
}

// Orders
export async function fetchOrders(userId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase.from("orders").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching orders:", error)
      return []
    }

    return data.map((order) => ({
      id: order.id,
      productId: order.product_id,
      name: order.name,
      price: order.price,
      quantity: order.quantity,
      storeId: order.store_id,
      unit: order.unit,
    }))
  } catch (error) {
    console.error("Exception fetching orders:", error)
    return []
  }
}

export async function addOrder(userId: string, order: Omit<Order, "id">): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        product_id: order.productId,
        name: order.name,
        price: order.price,
        quantity: order.quantity,
        store_id: order.storeId,
        unit: order.unit,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding order:", error)
      return null
    }

    return {
      id: data.id,
      productId: data.product_id,
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      storeId: data.store_id,
      unit: data.unit,
    }
  } catch (error) {
    console.error("Exception adding order:", error)
    return null
  }
}

export async function updateOrder(orderId: string, quantity: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").update({ quantity }).eq("id", orderId)

    if (error) {
      console.error("Error updating order:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception updating order:", error)
    return false
  }
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").delete().eq("id", orderId)

    if (error) {
      console.error("Error deleting order:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception deleting order:", error)
    return false
  }
}

// Ingredients
export async function fetchIngredients(userId: string): Promise<Ingredient[]> {
  try {
    const { data, error } = await supabase.from("ingredients").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching ingredients:", error)
      return []
    }

    return data.map((ingredient) => ({
      id: ingredient.id,
      productId: ingredient.product_id || undefined,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      expiryDate: ingredient.expiry_date ? new Date(ingredient.expiry_date) : undefined,
      addedDate: ingredient.added_date ? new Date(ingredient.added_date) : undefined,
    }))
  } catch (error) {
    console.error("Exception fetching ingredients:", error)
    return []
  }
}

export async function addIngredient(userId: string, ingredient: Omit<Ingredient, "id">): Promise<Ingredient | null> {
  try {
    const { data, error } = await supabase
      .from("ingredients")
      .insert({
        user_id: userId,
        product_id: ingredient.productId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        expiry_date: ingredient.expiryDate?.toISOString().split("T")[0],
        added_date: ingredient.addedDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding ingredient:", error)
      return null
    }

    return {
      id: data.id,
      productId: data.product_id || undefined,
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      expiryDate: data.expiry_date ? new Date(data.expiry_date) : undefined,
      addedDate: data.added_date ? new Date(data.added_date) : undefined,
    }
  } catch (error) {
    console.error("Exception adding ingredient:", error)
    return null
  }
}

export async function updateIngredientExpiryDate(ingredientId: string, expiryDate: Date): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("ingredients")
      .update({ expiry_date: expiryDate.toISOString().split("T")[0] })
      .eq("id", ingredientId)

    if (error) {
      console.error("Error updating ingredient expiry date:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception updating ingredient expiry date:", error)
    return false
  }
}

export async function deleteIngredient(ingredientId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("ingredients").delete().eq("id", ingredientId)

    if (error) {
      console.error("Error deleting ingredient:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Exception deleting ingredient:", error)
    return false
  }
}

// Check if database tables exist
export async function checkTablesExist(): Promise<boolean> {
  try {
    // Try to query the stores table directly
    const { data, error } = await supabase.from("stores").select("id").limit(1)

    if (error) {
      // If there's an error about the relation not existing, the tables don't exist
      if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
        console.log("Tables don't exist yet:", error.message)
        return false
      }

      // For other errors, log but don't immediately fail
      console.error("Error checking if tables exist:", error)
      // Be more lenient - the tables might exist but we might have permission issues
      return true
    }

    return true
  } catch (error) {
    console.error("Exception checking if tables exist:", error)
    // Be more lenient with exceptions too
    return true
  }
}

// Seed data function (for development)
export async function seedData() {
  try {
    console.log("Starting data seeding process...")

    // Check if tables exist first
    console.log("Checking if database tables exist...")

    // Try a simple query to see if the stores table exists
    const { data: tableCheck, error: tableCheckError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "stores")
      .limit(1)

    if (tableCheckError || !tableCheck || tableCheck.length === 0) {
      // If we get an error or no results, the table doesn't exist
      console.log("Tables don't exist yet. Falling back to mock data.")
      console.log("Please run the schema.sql file in your Supabase SQL editor to create the necessary tables.")
      return false
    }

    console.log("Database tables exist, proceeding with data check")

    // Check if data already exists by counting stores
    const { count: storesCount, error: countError } = await supabase
      .from("stores")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error checking if stores exist:", countError)
      return false
    }

    if (storesCount && storesCount > 0) {
      console.log(`Data already seeded (${storesCount} stores found)`)
      return true
    }

    // Seed stores one by one for better error handling
    const stores = [
      { name: "Makro", logo_url: "/placeholder.svg?height=50&width=50", location: "Bangkok" },
      { name: "Lotus", logo_url: "/placeholder.svg?height=50&width=50", location: "Chiang Mai" },
      { name: "BigC", logo_url: "/placeholder.svg?height=50&width=50", location: "Phuket" },
      { name: "Villa Market", logo_url: "/placeholder.svg?height=50&width=50", location: "Pattaya" },
      { name: "Tops", logo_url: "/placeholder.svg?height=50&width=50", location: "Hua Hin" },
    ]

    console.log(`Attempting to seed ${stores.length} stores...`)

    // Insert stores one by one
    const storeIds = []
    for (const store of stores) {
      try {
        const { data: storeData, error: storeError } = await supabase.from("stores").insert(store).select().single()

        if (storeError) {
          console.error(`Error inserting store ${store.name}:`, storeError)
          continue
        }

        console.log(`Successfully inserted store: ${store.name}`)
        storeIds.push(storeData.id)
      } catch (error) {
        console.error(`Exception when inserting store ${store.name}:`, error)
      }
    }

    if (storeIds.length === 0) {
      console.error("Failed to insert any stores")
      return false
    }

    console.log(`Successfully inserted ${storeIds.length} stores`)

    // Seed a few products for the first store
    if (storeIds.length > 0) {
      const firstStoreId = storeIds[0]
      const products = [
        { name: "Eggs", category: "Dairy", price: 60, unit: "dozen", store_id: firstStoreId },
        { name: "Milk", category: "Dairy", price: 55, unit: "liter", store_id: firstStoreId },
      ]

      console.log(`Attempting to seed ${products.length} products for store ${firstStoreId}...`)

      for (const product of products) {
        try {
          const { error: productError } = await supabase.from("products").insert(product)

          if (productError) {
            console.error(`Error inserting product ${product.name}:`, productError)
          } else {
            console.log(`Successfully inserted product: ${product.name}`)
          }
        } catch (error) {
          console.error(`Exception when inserting product ${product.name}:`, error)
        }
      }
    }

    console.log("Data seeding completed successfully")
    return true
  } catch (error) {
    console.error("Error in seedData function:", error)
    return false
  }
}
