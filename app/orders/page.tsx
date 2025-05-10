"use client"

import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash, Plus, Minus, Store, ShoppingCart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function OrdersPage() {
  const { orders, stores, removeFromOrder, updateOrderQuantity, confirmOrder, loading } = useSmartFridge()

  // Group orders by store
  const ordersByStore = orders.reduce(
    (acc, order) => {
      if (!acc[order.storeId]) {
        acc[order.storeId] = []
      }
      acc[order.storeId].push(order)
      return acc
    },
    {} as Record<string, typeof orders>,
  )

  // Calculate total price
  const totalPrice = orders.reduce((sum, order) => sum + order.price * order.quantity, 0)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>
        <Alert>
          <ShoppingCart className="h-4 w-4" />
          <AlertTitle>Your order is empty</AlertTitle>
          <AlertDescription>Browse stores or products to add items to your order.</AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-4">
          <Link href="/stores">
            <Button variant="outline">Browse Stores</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {Object.entries(ordersByStore).map(([storeId, storeOrders]) => {
            const store = stores.find((s) => s.id === storeId)

            return (
              <Card key={storeId} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    {store?.name}
                  </CardTitle>
                  <CardDescription>{store?.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {storeOrders.map((order) => (
                      <li key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ฿{order.price} per {order.unit}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateOrderQuantity(order.id, order.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{order.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateOrderQuantity(order.id, order.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => removeFromOrder(order.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(ordersByStore).map(([storeId, storeOrders]) => {
                  const store = stores.find((s) => s.id === storeId)
                  const storeTotal = storeOrders.reduce((sum, order) => sum + order.price * order.quantity, 0)

                  return (
                    <div key={storeId}>
                      <div className="flex justify-between">
                        <span>{store?.name}</span>
                        <span>฿{storeTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  )
                })}

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <Badge variant="outline" className="text-lg">
                    ฿{totalPrice.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={confirmOrder}>
                Confirm Purchase
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
