"use client"

import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, ShoppingCart, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function RecommendationsPage() {
  const { recommendations, ingredients, addToOrder, products, loading } = useSmartFridge()
  const [addedToOrder, setAddedToOrder] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  // Check if an ingredient is available in the user's ingredients
  const isIngredientAvailable = (ingredientName: string) => {
    return ingredients.some((ing) => ing.name.toLowerCase() === ingredientName.toLowerCase())
  }

  // Find a matching product for an ingredient
  const findMatchingProduct = (ingredientName: string) => {
    const normalizedName = ingredientName.toLowerCase().trim()

    // First try exact match
    const exactMatch = products.find((p) => p.name.toLowerCase() === normalizedName)
    if (exactMatch) return exactMatch

    // Then try partial match (e.g., "Chicken" should match "Chicken Breast")
    const partialMatch = products.find(
      (p) => p.name.toLowerCase().includes(normalizedName) || normalizedName.includes(p.name.toLowerCase()),
    )

    return partialMatch
  }

  // Add missing ingredients to order
  const addMissingIngredientsToOrder = (recipeId: string) => {
    const recipe = recommendations.find((r) => r.id === recipeId)
    if (!recipe) return

    let allIngredientsFound = true
    let addedIngredients = 0
    const missingIngredients = []
    const notFoundIngredients = []

    recipe.ingredients.forEach((ingredient) => {
      if (!isIngredientAvailable(ingredient.name)) {
        // Find a matching product
        const matchingProduct = findMatchingProduct(ingredient.name)

        if (matchingProduct) {
          addToOrder(matchingProduct, 1)
          addedIngredients++
          missingIngredients.push(ingredient.name)
        } else {
          allIngredientsFound = false
          notFoundIngredients.push(ingredient.name)
        }
      }
    })

    setAddedToOrder({
      ...addedToOrder,
      [recipeId]: true,
    })

    // Show toast notification
    if (addedIngredients > 0) {
      toast({
        title: `Added ${addedIngredients} ingredient${addedIngredients > 1 ? "s" : ""} to your order`,
        description: `Added: ${missingIngredients.join(", ")}${
          notFoundIngredients.length > 0 ? `. Could not find: ${notFoundIngredients.join(", ")}` : ""
        }`,
      })
    } else if (notFoundIngredients.length > 0) {
      toast({
        title: "Could not add ingredients",
        description: `Could not find: ${notFoundIngredients.join(", ")}`,
        variant: "destructive",
      })
    }

    return allIngredientsFound
  }

  // Count missing ingredients for a recipe
  const countMissingIngredients = (recipe) => {
    return recipe.ingredients.filter((ingredient) => !isIngredientAvailable(ingredient.name)).length
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recipe Recommendations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((recipe) => {
          const missingCount = countMissingIngredients(recipe)
          const totalIngredients = recipe.ingredients.length
          const availableCount = totalIngredients - missingCount

          return (
            <Card key={recipe.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={missingCount === 0 ? "default" : "outline"}
                    className="bg-background/80 backdrop-blur-sm"
                  >
                    {availableCount}/{totalIngredients} ingredients available
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-2">Ingredients:</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient) => {
                    const isAvailable = isIngredientAvailable(ingredient.name)
                    const matchingProduct = findMatchingProduct(ingredient.name)

                    return (
                      <li key={ingredient.id} className="flex items-center justify-between">
                        <span className="flex items-center">
                          {isAvailable ? (
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                          ) : matchingProduct ? (
                            <X className="h-4 w-4 mr-2 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          )}
                          <span className={!matchingProduct && !isAvailable ? "text-amber-500" : ""}>
                            {ingredient.name}
                          </span>
                          {!isAvailable && matchingProduct && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Available at{" "}
                              {products.find((p) => p.id === matchingProduct.id)?.storeId.replace("s", "Store ")})
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {recipe.ingredients.some(
                  (ing) => !isIngredientAvailable(ing.name) && !findMatchingProduct(ing.name),
                ) && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Some ingredients not available in stores</AlertTitle>
                    <AlertDescription>
                      Some ingredients for this recipe are not available in any store.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => addMissingIngredientsToOrder(recipe.id)}
                  disabled={missingCount === 0 || addedToOrder[recipe.id]}
                  variant={addedToOrder[recipe.id] ? "outline" : "default"}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {addedToOrder[recipe.id]
                    ? "Added to Order"
                    : missingCount === 0
                      ? "All Ingredients Available"
                      : `Add ${missingCount} Missing Ingredient${missingCount > 1 ? "s" : ""} to Order`}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
