import type { Store, Product, Recipe } from "./types"

// Mock data for stores
const mockStores: Store[] = [
  { id: "s1", name: "Makro", logoUrl: "/placeholder.svg?height=50&width=50", location: "Bangkok" },
  { id: "s2", name: "Lotus", logoUrl: "/placeholder.svg?height=50&width=50", location: "Chiang Mai" },
  { id: "s3", name: "BigC", logoUrl: "/placeholder.svg?height=50&width=50", location: "Phuket" },
  { id: "s4", name: "Villa Market", logoUrl: "/placeholder.svg?height=50&width=50", location: "Pattaya" },
  { id: "s5", name: "Tops", logoUrl: "/placeholder.svg?height=50&width=50", location: "Hua Hin" },
  { id: "s6", name: "Foodland", logoUrl: "/placeholder.svg?height=50&width=50", location: "Bangkok" },
  { id: "s7", name: "Gourmet Market", logoUrl: "/placeholder.svg?height=50&width=50", location: "Bangkok" },
  { id: "s8", name: "7-Eleven", logoUrl: "/placeholder.svg?height=50&width=50", location: "Nationwide" },
  { id: "s9", name: "Tesco", logoUrl: "/placeholder.svg?height=50&width=50", location: "Bangkok" },
  { id: "s10", name: "CJ Express", logoUrl: "/placeholder.svg?height=50&width=50", location: "Chiang Rai" },
]

// Mock data for products
const mockProducts: Product[] = [
  // Makro products
  { id: "p1", name: "Eggs", category: "Dairy", price: 60, unit: "dozen", storeId: "s1" },
  { id: "p2", name: "Milk", category: "Dairy", price: 55, unit: "liter", storeId: "s1" },
  { id: "p3", name: "Chicken Breast", category: "Meat", price: 120, unit: "kg", storeId: "s1" },
  { id: "p4", name: "Broccoli", category: "Vegetables", price: 40, unit: "kg", storeId: "s1" },
  { id: "p41", name: "Rice Noodles", category: "Grains", price: 45, unit: "pack", storeId: "s1" },
  { id: "p42", name: "Bean Sprouts", category: "Vegetables", price: 20, unit: "pack", storeId: "s1" },

  // Lotus products
  { id: "p5", name: "Milk", category: "Dairy", price: 50, unit: "liter", storeId: "s2" },
  { id: "p6", name: "Tofu", category: "Protein", price: 25, unit: "pack", storeId: "s2" },
  { id: "p7", name: "Rice", category: "Grains", price: 150, unit: "5kg", storeId: "s2" },
  { id: "p8", name: "Carrots", category: "Vegetables", price: 30, unit: "kg", storeId: "s2" },
  { id: "p43", name: "Peanuts", category: "Nuts", price: 60, unit: "pack", storeId: "s2" },
  { id: "p44", name: "Garlic", category: "Vegetables", price: 15, unit: "pack", storeId: "s2" },

  // BigC products
  { id: "p9", name: "Cheese", category: "Dairy", price: 180, unit: "pack", storeId: "s3" },
  { id: "p10", name: "Onion", category: "Vegetables", price: 35, unit: "kg", storeId: "s3" },
  { id: "p11", name: "Pork", category: "Meat", price: 140, unit: "kg", storeId: "s3" },
  { id: "p12", name: "Pasta", category: "Grains", price: 45, unit: "pack", storeId: "s3" },
  { id: "p45", name: "Mushrooms", category: "Vegetables", price: 70, unit: "pack", storeId: "s3" },
  { id: "p46", name: "Chili", category: "Vegetables", price: 25, unit: "pack", storeId: "s3" },

  // Villa Market products
  { id: "p13", name: "Olive Oil", category: "Condiments", price: 350, unit: "bottle", storeId: "s4" },
  { id: "p14", name: "Cheese", category: "Dairy", price: 220, unit: "pack", storeId: "s4" },
  { id: "p15", name: "Salmon", category: "Seafood", price: 300, unit: "kg", storeId: "s4" },
  { id: "p16", name: "Avocado", category: "Fruits", price: 80, unit: "piece", storeId: "s4" },
  { id: "p47", name: "Shrimp", category: "Seafood", price: 250, unit: "kg", storeId: "s4" },
  { id: "p48", name: "Lemongrass", category: "Herbs", price: 30, unit: "bunch", storeId: "s4" },

  // Tops products
  { id: "p17", name: "Beef", category: "Meat", price: 280, unit: "kg", storeId: "s5" },
  { id: "p18", name: "Spinach", category: "Vegetables", price: 45, unit: "bunch", storeId: "s5" },
  { id: "p19", name: "Yogurt", category: "Dairy", price: 65, unit: "pack", storeId: "s5" },
  { id: "p20", name: "Eggs", category: "Dairy", price: 65, unit: "dozen", storeId: "s5" },
  { id: "p49", name: "Lime", category: "Fruits", price: 15, unit: "piece", storeId: "s5" },
  { id: "p50", name: "Basil", category: "Herbs", price: 20, unit: "bunch", storeId: "s5" },

  // Foodland products
  { id: "p21", name: "Shrimp", category: "Seafood", price: 250, unit: "kg", storeId: "s6" },
  { id: "p22", name: "Bell Pepper", category: "Vegetables", price: 70, unit: "kg", storeId: "s6" },
  { id: "p23", name: "Butter", category: "Dairy", price: 95, unit: "pack", storeId: "s6" },
  { id: "p24", name: "Chicken", category: "Meat", price: 90, unit: "kg", storeId: "s6" },
  { id: "p51", name: "Coconut Milk", category: "Dairy", price: 65, unit: "can", storeId: "s6" },
  { id: "p52", name: "Eggplant", category: "Vegetables", price: 40, unit: "kg", storeId: "s6" },

  // Gourmet Market products
  { id: "p25", name: "Truffle Oil", category: "Condiments", price: 650, unit: "bottle", storeId: "s7" },
  { id: "p26", name: "Wagyu Beef", category: "Meat", price: 1200, unit: "kg", storeId: "s7" },
  { id: "p27", name: "Asparagus", category: "Vegetables", price: 180, unit: "bunch", storeId: "s7" },
  { id: "p28", name: "Goat Cheese", category: "Dairy", price: 320, unit: "pack", storeId: "s7" },
  { id: "p53", name: "Green Curry Paste", category: "Condiments", price: 85, unit: "jar", storeId: "s7" },
  { id: "p54", name: "Soy Sauce", category: "Condiments", price: 75, unit: "bottle", storeId: "s7" },

  // 7-Eleven products
  { id: "p29", name: "Milk", category: "Dairy", price: 60, unit: "liter", storeId: "s8" },
  { id: "p30", name: "Bread", category: "Bakery", price: 40, unit: "loaf", storeId: "s8" },
  { id: "p31", name: "Eggs", category: "Dairy", price: 70, unit: "half-dozen", storeId: "s8" },
  { id: "p32", name: "Banana", category: "Fruits", price: 15, unit: "piece", storeId: "s8" },
  { id: "p55", name: "Green Papaya", category: "Fruits", price: 45, unit: "piece", storeId: "s8" },
  { id: "p56", name: "Chili", category: "Vegetables", price: 10, unit: "piece", storeId: "s8" },

  // Tesco products
  { id: "p33", name: "Pasta Sauce", category: "Condiments", price: 85, unit: "jar", storeId: "s9" },
  { id: "p34", name: "Ground Beef", category: "Meat", price: 150, unit: "kg", storeId: "s9" },
  { id: "p35", name: "Tomatoes", category: "Vegetables", price: 50, unit: "kg", storeId: "s9" },
  { id: "p36", name: "Cheddar Cheese", category: "Dairy", price: 160, unit: "pack", storeId: "s9" },
  { id: "p57", name: "Lime", category: "Fruits", price: 12, unit: "piece", storeId: "s9" },
  { id: "p58", name: "Peanuts", category: "Nuts", price: 55, unit: "pack", storeId: "s9" },

  // CJ Express products
  { id: "p37", name: "Instant Noodles", category: "Packaged", price: 15, unit: "pack", storeId: "s10" },
  { id: "p38", name: "Soy Milk", category: "Dairy", price: 25, unit: "bottle", storeId: "s10" },
  { id: "p39", name: "Rice", category: "Grains", price: 140, unit: "5kg", storeId: "s10" },
  { id: "p40", name: "Tofu", category: "Protein", price: 20, unit: "pack", storeId: "s10" },
  { id: "p59", name: "Garlic", category: "Vegetables", price: 12, unit: "pack", storeId: "s10" },
  { id: "p60", name: "Basil", category: "Herbs", price: 15, unit: "bunch", storeId: "s10" },
]

// Mock data for recipes
const mockRecipes: Recipe[] = [
  {
    id: "r1",
    name: "Pad Thai",
    description: "Classic Thai stir-fried noodles with eggs, tofu, and vegetables.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    ingredients: [
      { id: "ri1", name: "Rice Noodles", quantity: 200, unit: "g" },
      { id: "ri2", name: "Eggs", quantity: 2, unit: "pcs" },
      { id: "ri3", name: "Tofu", quantity: 100, unit: "g" },
      { id: "ri4", name: "Bean Sprouts", quantity: 50, unit: "g" },
      { id: "ri5", name: "Peanuts", quantity: 30, unit: "g" },
    ],
  },
  {
    id: "r2",
    name: "Tom Yum Soup",
    description: "Spicy and sour Thai soup with shrimp and mushrooms.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    ingredients: [
      { id: "ri6", name: "Shrimp", quantity: 200, unit: "g" },
      { id: "ri7", name: "Mushrooms", quantity: 100, unit: "g" },
      { id: "ri8", name: "Lemongrass", quantity: 2, unit: "stalks" },
      { id: "ri9", name: "Lime", quantity: 1, unit: "pc" },
      { id: "ri10", name: "Chili", quantity: 3, unit: "pcs" },
    ],
  },
  {
    id: "r3",
    name: "Green Curry",
    description: "Aromatic Thai curry with chicken and vegetables.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    ingredients: [
      { id: "ri11", name: "Chicken", quantity: 300, unit: "g" },
      { id: "ri12", name: "Coconut Milk", quantity: 400, unit: "ml" },
      { id: "ri13", name: "Eggplant", quantity: 100, unit: "g" },
      { id: "ri14", name: "Green Curry Paste", quantity: 2, unit: "tbsp" },
      { id: "ri15", name: "Basil", quantity: 10, unit: "leaves" },
    ],
  },
  {
    id: "r4",
    name: "Fried Rice",
    description: "Simple and delicious Thai-style fried rice.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    ingredients: [
      { id: "ri16", name: "Rice", quantity: 300, unit: "g" },
      { id: "ri17", name: "Eggs", quantity: 2, unit: "pcs" },
      { id: "ri18", name: "Onion", quantity: 1, unit: "pc" },
      { id: "ri19", name: "Garlic", quantity: 3, unit: "cloves" },
      { id: "ri20", name: "Soy Sauce", quantity: 2, unit: "tbsp" },
    ],
  },
  {
    id: "r5",
    name: "Papaya Salad",
    description: "Spicy and tangy green papaya salad.",
    imageUrl: "/placeholder.svg?height=200&width=300",
    ingredients: [
      { id: "ri21", name: "Green Papaya", quantity: 200, unit: "g" },
      { id: "ri22", name: "Tomatoes", quantity: 2, unit: "pcs" },
      { id: "ri23", name: "Lime", quantity: 1, unit: "pc" },
      { id: "ri24", name: "Peanuts", quantity: 30, unit: "g" },
      { id: "ri25", name: "Chili", quantity: 2, unit: "pcs" },
    ],
  },
]

// API functions to simulate backend calls
export async function fetchStores(): Promise<Store[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockStores
}

export async function fetchProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))
  return mockProducts
}

export async function fetchRecommendations(): Promise<Recipe[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockRecipes
}
