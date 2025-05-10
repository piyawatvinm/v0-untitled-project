import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ShoppingCart, ChefHat, Store, Pizza, ClipboardList, Receipt } from "lucide-react"
import Dashboard from "@/components/dashboard"
import { SupabaseWarning } from "@/components/supabase-warning"
import SupabaseStatus from "@/components/supabase-status"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SupabaseWarning />
      <SupabaseStatus />

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">ChefMate</h1>
        <p className="text-muted-foreground">Your intelligent kitchen companion</p>
      </div>

      {/* Dashboard Section */}
      <Dashboard />

      <h2 className="text-2xl font-semibold mt-12 mb-6">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Store className="h-8 w-8 mb-2 text-emerald-500" />
            <CardTitle>Stores</CardTitle>
            <CardDescription>Browse stores and their products</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Explore 10 different stores and see what products they offer.</p>
          </CardContent>
          <CardFooter>
            <Link href="/stores" className="w-full">
              <Button className="w-full">
                View Stores
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Pizza className="h-8 w-8 mb-2 text-orange-500" />
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Get recipe suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Discover new recipes based on your available ingredients.</p>
          </CardContent>
          <CardFooter>
            <Link href="/recommendations" className="w-full">
              <Button className="w-full">
                View Recommendations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <ShoppingCart className="h-8 w-8 mb-2 text-blue-500" />
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage your shopping list</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and edit your current orders grouped by store.</p>
          </CardContent>
          <CardFooter>
            <Link href="/orders" className="w-full">
              <Button className="w-full">
                View Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <ChefHat className="h-8 w-8 mb-2 text-purple-500" />
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>Check your kitchen inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p>See what ingredients you currently have in your kitchen.</p>
          </CardContent>
          <CardFooter>
            <Link href="/ingredients" className="w-full">
              <Button className="w-full">
                View Ingredients
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <ClipboardList className="h-8 w-8 mb-2 text-amber-500" />
            <CardTitle>Products</CardTitle>
            <CardDescription>Browse all available products</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Explore all products across different stores.</p>
          </CardContent>
          <CardFooter>
            <Link href="/products" className="w-full">
              <Button className="w-full">
                View Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Receipt className="h-8 w-8 mb-2 text-indigo-500" />
            <CardTitle>Upload Receipt</CardTitle>
            <CardDescription>Add items from your grocery receipt</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Quickly add multiple items to your kitchen by uploading your grocery receipt.</p>
          </CardContent>
          <CardFooter>
            <Link href="/receipt" className="w-full">
              <Button className="w-full">
                Upload Receipt
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
