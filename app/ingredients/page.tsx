"use client"

import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertTriangle, Calendar, Trash2, Receipt, Scan, ChefHat } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { ExpiryStatus } from "@/lib/types"

export default function IngredientsPage() {
  const { ingredients, loading, getIngredientExpiryStatus, updateIngredientExpiryDate, removeIngredient } =
    useSmartFridge()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<ExpiryStatus | "all">("all")

  // Filter ingredients
  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const status = getIngredientExpiryStatus(ingredient)
    const matchesFilter = filterStatus === "all" || status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Group ingredients by category
  const groupedIngredients = filteredIngredients.reduce(
    (acc, ingredient) => {
      // For simplicity, we're using the first letter as a group
      const firstLetter = ingredient.name[0].toUpperCase()
      if (!acc[firstLetter]) {
        acc[firstLetter] = []
      }
      acc[firstLetter].push(ingredient)
      return acc
    },
    {} as Record<string, typeof ingredients>,
  )

  // Sort the groups alphabetically
  const sortedGroups = Object.keys(groupedIngredients).sort()

  // Get status counts
  const statusCounts = ingredients.reduce(
    (acc, ingredient) => {
      const status = getIngredientExpiryStatus(ingredient)
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (ingredients.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Ingredients</h1>
        <Alert>
          <ChefHat className="h-4 w-4" />
          <AlertTitle>Your kitchen is empty</AlertTitle>
          <AlertDescription>Add items to your order and confirm purchase to stock your kitchen.</AlertDescription>
        </Alert>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/stores">
            <Button>Browse Stores</Button>
          </Link>
          <Link href="/receipt">
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              Upload Receipt
            </Button>
          </Link>
          <Link href="/scan">
            <Button variant="outline">
              <Scan className="mr-2 h-4 w-4" />
              Scan Barcode
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Ingredients</h1>
          <p className="text-muted-foreground mb-6">You have {ingredients.length} ingredients in your kitchen</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <Link href="/receipt">
            <Button variant="outline" size="sm">
              <Receipt className="mr-2 h-4 w-4" />
              Upload Receipt
            </Button>
          </Link>
          <Link href="/scan">
            <Button variant="outline" size="sm">
              <Scan className="mr-2 h-4 w-4" />
              Scan Barcode
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className={cn("border-l-4", statusCounts.expired ? "border-l-red-500" : "border-l-transparent")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Expired
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.expired || 0}</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs mt-1 h-7 px-2"
              onClick={() => setFilterStatus(filterStatus === "expired" ? "all" : "expired")}
            >
              {filterStatus === "expired" ? "Show All" : "Show Only"}
            </Button>
          </CardContent>
        </Card>

        <Card className={cn("border-l-4", statusCounts.expiring_soon ? "border-l-amber-500" : "border-l-transparent")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.expiring_soon || 0}</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs mt-1 h-7 px-2"
              onClick={() => setFilterStatus(filterStatus === "expiring_soon" ? "all" : "expiring_soon")}
            >
              {filterStatus === "expiring_soon" ? "Show All" : "Show Only"}
            </Button>
          </CardContent>
        </Card>

        <Card className={cn("border-l-4", statusCounts.fresh ? "border-l-green-500" : "border-l-transparent")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ChefHat className="h-4 w-4 mr-2 text-green-500" />
              Fresh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.fresh || 0}</div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs mt-1 h-7 px-2"
              onClick={() => setFilterStatus(filterStatus === "fresh" ? "all" : "fresh")}
            >
              {filterStatus === "fresh" ? "Show All" : "Show Only"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Label htmlFor="search">Search Ingredients</Label>
        <Input
          id="search"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No ingredients found matching your search or filter.</p>
          {filterStatus !== "all" && (
            <Button variant="outline" className="mt-2" onClick={() => setFilterStatus("all")}>
              Clear Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroups.map((group) => (
            <div key={group}>
              <h2 className="text-xl font-semibold mb-3">{group}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedIngredients[group].map((ingredient) => {
                  const expiryStatus = getIngredientExpiryStatus(ingredient)

                  return (
                    <Card
                      key={ingredient.id}
                      className={cn(
                        "border-l-4",
                        expiryStatus === "expired"
                          ? "border-l-red-500"
                          : expiryStatus === "expiring_soon"
                            ? "border-l-amber-500"
                            : "border-l-green-500",
                      )}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                          <Badge>
                            {ingredient.quantity} {ingredient.unit}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            {expiryStatus === "expired" ? (
                              <span className="text-xs text-red-500 font-medium flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Expired{" "}
                                {ingredient.expiryDate && format(new Date(ingredient.expiryDate), "MMM d, yyyy")}
                              </span>
                            ) : expiryStatus === "expiring_soon" ? (
                              <span className="text-xs text-amber-500 font-medium flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Expires{" "}
                                {ingredient.expiryDate && format(new Date(ingredient.expiryDate), "MMM d, yyyy")}
                              </span>
                            ) : (
                              <span className="text-xs text-green-500 font-medium flex items-center">
                                <ChefHat className="h-3 w-3 mr-1" />
                                Fresh until{" "}
                                {ingredient.expiryDate && format(new Date(ingredient.expiryDate), "MMM d, yyyy")}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7">
                                  <Calendar className="h-4 w-4" />
                                  <span className="sr-only">Update expiry date</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="end">
                                <CalendarComponent
                                  mode="single"
                                  selected={ingredient.expiryDate ? new Date(ingredient.expiryDate) : undefined}
                                  onSelect={(date) => date && updateIngredientExpiryDate(ingredient.id, date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => removeIngredient(ingredient.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove ingredient</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
