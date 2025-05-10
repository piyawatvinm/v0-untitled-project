"use client"

import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function StorePage() {
  const params = useParams()
  const storeId = params.id as string
  const { getStoreById, getProductsByStore, addToOrder, loading } = useSmartFridge()

  const store = getStoreById(storeId)
  const products = getProductsByStore(storeId)

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0
      const newQuantity = Math.max(0, current + delta)
      return { ...prev, [productId]: newQuantity }
    })
  }

  const handleAddToOrder = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product && quantities[productId] > 0) {
      addToOrder(product, quantities[productId])
      setQuantities((prev) => ({ ...prev, [productId]: 0 }))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!store) {
    return <div className="container mx-auto px-4 py-8">Store not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
      <p className="text-muted-foreground mb-6">{store.location}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </div>
                <Badge variant="outline">฿{product.price}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{product.unit}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(product.id, -1)}
                  disabled={!quantities[product.id]}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{quantities[product.id] || 0}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(product.id, 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => handleAddToOrder(product.id)} disabled={!quantities[product.id]}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
