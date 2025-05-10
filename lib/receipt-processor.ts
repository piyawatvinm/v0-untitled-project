import type { ExtractedItem } from "./types"

// Mock function to simulate OCR processing of a receipt image
export async function processReceiptImage(file: File): Promise<ExtractedItem[]> {
  // In a real application, this would send the image to a backend API
  // that would use OCR to extract the items from the receipt

  // For demo purposes, we'll simulate a delay and return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random set of items based on the filename
      // This is just to make the demo more interesting
      const mockItems = generateMockItems(file.name)
      resolve(mockItems)
    }, 2000) // Simulate a 2-second processing time
  })
}

// Generate mock items based on the filename
function generateMockItems(filename: string): ExtractedItem[] {
  // Base set of common grocery items
  const commonItems: ExtractedItem[] = [
    { name: "Milk", quantity: 1, unit: "bottle" },
    { name: "Eggs", quantity: 12, unit: "piece" },
    { name: "Bread", quantity: 1, unit: "loaf" },
    { name: "Chicken Breast", quantity: 500, unit: "g" },
    { name: "Bananas", quantity: 6, unit: "piece" },
    { name: "Tomatoes", quantity: 4, unit: "piece" },
    { name: "Rice", quantity: 1, unit: "kg" },
    { name: "Pasta", quantity: 1, unit: "pack" },
    { name: "Cheese", quantity: 200, unit: "g" },
    { name: "Yogurt", quantity: 4, unit: "pack" },
    { name: "Apples", quantity: 5, unit: "piece" },
    { name: "Potatoes", quantity: 1, unit: "kg" },
    { name: "Onions", quantity: 3, unit: "piece" },
    { name: "Cereal", quantity: 1, unit: "box" },
    { name: "Orange Juice", quantity: 1, unit: "bottle" },
    { name: "Coffee", quantity: 1, unit: "pack" },
    { name: "Tea", quantity: 1, unit: "box" },
    { name: "Sugar", quantity: 1, unit: "kg" },
    { name: "Salt", quantity: 1, unit: "pack" },
    { name: "Pepper", quantity: 1, unit: "pack" },
    { name: "Olive Oil", quantity: 1, unit: "bottle" },
    { name: "Butter", quantity: 1, unit: "pack" },
    { name: "Carrots", quantity: 1, unit: "pack" },
    { name: "Spinach", quantity: 1, unit: "bag" },
    { name: "Garlic", quantity: 1, unit: "pack" },
    { name: "Tofu", quantity: 1, unit: "pack" },
    { name: "Soy Sauce", quantity: 1, unit: "bottle" },
    { name: "Honey", quantity: 1, unit: "jar" },
    { name: "Peanut Butter", quantity: 1, unit: "jar" },
    { name: "Jam", quantity: 1, unit: "jar" },
  ]

  // Use the filename to seed the random number generator
  // This ensures the same filename always produces the same items
  const seed = filename.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const rng = seedRandom(seed)

  // Determine how many items to include (between 3 and 8)
  const numItems = Math.floor(rng() * 6) + 3

  // Randomly select items from the common items list
  const selectedItems: ExtractedItem[] = []
  const usedIndices = new Set<number>()

  while (selectedItems.length < numItems) {
    const index = Math.floor(rng() * commonItems.length)
    if (!usedIndices.has(index)) {
      usedIndices.add(index)

      // Randomly adjust quantities for variety
      const item = { ...commonItems[index] }
      if (rng() > 0.7) {
        item.quantity = Math.max(1, Math.floor(item.quantity * (0.5 + rng())))
      }

      selectedItems.push(item)
    }
  }

  return selectedItems
}

// Simple seeded random number generator
function seedRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}
