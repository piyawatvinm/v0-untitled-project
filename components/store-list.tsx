"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Store {
  id: string
  name: string
  logo_url: string | null
  location: string
}

export default function StoreList() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStores() {
      try {
        setLoading(true)

        // Fetch stores from Supabase
        const { data, error } = await supabase.from("stores").select("*").order("name")

        if (error) {
          throw error
        }

        setStores(data || [])
      } catch (err) {
        console.error("Error fetching stores:", err)
        setError("Failed to load stores. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  if (loading) {
    return (
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
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
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
                src={store.logo_url || "/placeholder.svg?height=50&width=50"}
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

      {stores.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">No stores found. Please add stores to your database.</p>
        </div>
      )}
    </div>
  )
}
