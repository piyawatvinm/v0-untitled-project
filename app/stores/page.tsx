"use client"

import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function StoresPage() {
  const { stores, loading } = useSmartFridge()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Stores</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[100px] w-full rounded-md" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Stores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{store.name}</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {store.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-[100px] bg-muted rounded-md">
                <Image
                  src={store.logoUrl || "/placeholder.svg"}
                  alt={`${store.name} logo`}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/stores/${store.id}`} className="w-full">
                <Button className="w-full">View Products</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
