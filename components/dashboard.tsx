"use client"

import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Store, Pizza, Utensils, AlertTriangle, Calendar, ChefHat } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { stores, products, recommendations, orders, ingredients, loading, getIngredientExpiryStatus } =
    useSmartFridge()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardSkeleton />
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  // Calculate metrics
  const totalIngredients = ingredients.length
  const totalOrders = orders.length
  const totalStores = stores.length
  const totalRecipes = recommendations.length
  const totalProducts = products.length

  // Calculate the percentage of ingredients available for recipes
  const allRecipeIngredients = new Set(
    recommendations.flatMap((recipe) => recipe.ingredients.map((ing) => ing.name.toLowerCase())),
  )

  const availableIngredients = new Set(ingredients.map((ing) => ing.name.toLowerCase()))

  const ingredientCoverage =
    allRecipeIngredients.size > 0
      ? Math.round(
          (Array.from(allRecipeIngredients).filter((ing) => availableIngredients.has(ing)).length /
            allRecipeIngredients.size) *
            100,
        )
      : 0

  // Calculate product coverage for recipes
  const productIngredientNames = new Set(products.map((p) => p.name.toLowerCase()))
  const recipeIngredientNames = new Set(recommendations.flatMap((r) => r.ingredients.map((i) => i.name.toLowerCase())))

  const missingIngredients = Array.from(recipeIngredientNames).filter((name) => !productIngredientNames.has(name))
  const productCoverage =
    recipeIngredientNames.size > 0
      ? Math.round(((recipeIngredientNames.size - missingIngredients.length) / recipeIngredientNames.size) * 100)
      : 100

  // Calculate expiry metrics
  const expiryStatusCounts = ingredients.reduce(
    (acc, ingredient) => {
      const status = getIngredientExpiryStatus(ingredient)
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const expiredCount = expiryStatusCounts.expired || 0
  const expiringSoonCount = expiryStatusCounts.expiring_soon || 0
  const freshCount = expiryStatusCounts.fresh || 0

  // Calculate most common category
  const categoryCounts = products.reduce(
    (acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const mostCommonCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ChefHat className="h-4 w-4 mr-2 text-purple-500" />
              Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIngredients}</div>
            <p className="text-xs text-muted-foreground">items in your kitchen</p>
            <Progress className="h-2 mt-2" value={totalIngredients > 0 ? 100 : 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2 text-blue-500" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">pending orders</p>
            <Progress className="h-2 mt-2" value={totalOrders > 0 ? 100 : 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Store className="h-4 w-4 mr-2 text-emerald-500" />
              Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStores}</div>
            <p className="text-xs text-muted-foreground">available stores</p>
            <Progress className="h-2 mt-2" value={100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Pizza className="h-4 w-4 mr-2 text-orange-500" />
              Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipes}</div>
            <p className="text-xs text-muted-foreground">recipe suggestions</p>
            <Progress className="h-2 mt-2" value={100} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recipe Ingredient Coverage</CardTitle>
            <CardDescription>Percentage of recipe ingredients available in your fridge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{ingredientCoverage}% Coverage</span>
              <span className="text-sm text-muted-foreground">
                {Array.from(availableIngredients).filter((ing) => allRecipeIngredients.has(ing)).length} /{" "}
                {allRecipeIngredients.size} ingredients
              </span>
            </div>
            <Progress value={ingredientCoverage} className="h-2" />
            <div className="flex items-center mt-4 text-sm text-muted-foreground">
              <Utensils className="h-4 w-4 mr-2" />
              {ingredientCoverage < 50
                ? "You need more ingredients to make most recipes"
                : ingredientCoverage < 80
                  ? "You have ingredients for some recipes"
                  : "You're well-stocked for most recipes!"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ingredient Freshness</CardTitle>
            <CardDescription>Status of ingredients in your fridge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                    Expired
                  </span>
                  <span className="text-sm">{expiredCount} items</span>
                </div>
                <Progress
                  value={expiredCount > 0 ? (expiredCount / totalIngredients) * 100 : 0}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-red-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                    Expiring Soon
                  </span>
                  <span className="text-sm">{expiringSoonCount} items</span>
                </div>
                <Progress
                  value={expiringSoonCount > 0 ? (expiringSoonCount / totalIngredients) * 100 : 0}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center">
                    <ChefHat className="h-4 w-4 mr-1 text-green-500" />
                    Fresh
                  </span>
                  <span className="text-sm">{freshCount} items</span>
                </div>
                <Progress
                  value={freshCount > 0 ? (freshCount / totalIngredients) * 100 : 0}
                  className="h-2 bg-muted"
                  indicatorClassName="bg-green-500"
                />
              </div>
            </div>

            {expiredCount > 0 && (
              <div className="mt-4">
                <Link href="/ingredients">
                  <Button variant="outline" size="sm" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Expiry Dates
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-40 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40 mb-1" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-2 w-full mb-4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
