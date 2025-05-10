"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SchemaPage() {
  const router = useRouter()
  const { toast } = useToast()

  const schemaSQL = `-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables for ChefMate app

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table (user's shopping cart)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  unit TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredients table (user's inventory)
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  expiry_date DATE,
  added_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Public access policies for stores, products, recipes, and recipe_ingredients
CREATE POLICY "Allow public read access to stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to stores" ON stores FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to products" ON products FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to recipe_ingredients" ON recipe_ingredients FOR SELECT USING (true);

-- User-specific policies for orders and ingredients
CREATE POLICY "Users can only see their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own orders" ON orders FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own ingredients" ON ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ingredients" ON ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ingredients" ON ingredients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ingredients" ON ingredients FOR DELETE USING (auth.uid() = user_id);`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaSQL)
    toast({
      title: "Copied to clipboard",
      description: "The SQL schema has been copied to your clipboard.",
    })
  }

  const downloadSchema = () => {
    const blob = new Blob([schemaSQL], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "schema.sql"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Database Schema SQL</CardTitle>
          <CardDescription>
            Run this SQL in your Supabase SQL Editor to create the necessary tables for the ChefMate app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md overflow-auto max-h-[60vh]">
            <pre className="text-sm whitespace-pre-wrap">{schemaSQL}</pre>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button variant="outline" onClick={downloadSchema}>
              <Download className="mr-2 h-4 w-4" />
              Download SQL
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Run This SQL</CardTitle>
          <CardDescription>Follow these steps to set up your database schema in Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <p className="font-medium">Log in to your Supabase dashboard</p>
              <p className="text-sm text-muted-foreground">
                Go to https://app.supabase.io and sign in to your account.
              </p>
            </li>
            <li>
              <p className="font-medium">Select your project</p>
              <p className="text-sm text-muted-foreground">Click on the project where you want to set up ChefMate.</p>
            </li>
            <li>
              <p className="font-medium">Open the SQL Editor</p>
              <p className="text-sm text-muted-foreground">
                In the left sidebar, click on "SQL Editor" to open the SQL editor.
              </p>
            </li>
            <li>
              <p className="font-medium">Create a new query</p>
              <p className="text-sm text-muted-foreground">Click on "New Query" to create a new SQL query.</p>
            </li>
            <li>
              <p className="font-medium">Paste the SQL</p>
              <p className="text-sm text-muted-foreground">
                Copy the SQL schema above and paste it into the SQL editor.
              </p>
            </li>
            <li>
              <p className="font-medium">Run the query</p>
              <p className="text-sm text-muted-foreground">
                Click the "Run" button to execute the SQL and create the database schema.
              </p>
            </li>
            <li>
              <p className="font-medium">Refresh the app</p>
              <p className="text-sm text-muted-foreground">
                After running the SQL, refresh the ChefMate app to connect to your newly created database schema.
              </p>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
