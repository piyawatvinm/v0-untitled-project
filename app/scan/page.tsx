"use client"

import { useState } from "react"
import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CalendarIcon, Camera, X, Check, Barcode, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { BarcodeScanner } from "@/components/barcode-scanner"
import { mockBarcodeDatabase } from "@/lib/barcode-database"
import type { Product } from "@/lib/types"

export default function ScanPage() {
  const { products, addIngredientDirectly } = useSmartFridge()
  const { toast } = useToast()
  const router = useRouter()

  const [isScanning, setIsScanning] = useState(false)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [manualBarcode, setManualBarcode] = useState("")
  const [matchedProduct, setMatchedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [expiryDate, setExpiryDate] = useState<Date>(addDays(new Date(), 7))
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle barcode scan result
  const handleScan = (result: string) => {
    setScannedBarcode(result)
    setIsScanning(false)
    findProductByBarcode(result)
  }

  // Handle manual barcode entry
  const handleManualEntry = () => {
    if (manualBarcode.trim()) {
      findProductByBarcode(manualBarcode.trim())
    }
  }

  // Find product by barcode
  const findProductByBarcode = (barcode: string) => {
    // Look up the barcode in our mock database
    const productId = mockBarcodeDatabase[barcode]

    if (productId) {
      const product = products.find((p) => p.id === productId)
      if (product) {
        setMatchedProduct(product)
        // Set a default expiry date based on product category
        setDefaultExpiryDate(product.category)
        toast({
          title: "Product found",
          description: `Found: ${product.name}`,
        })
      } else {
        toast({
          title: "Product not found",
          description: "The product for this barcode is not in our database.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Barcode not recognized",
        description: "This barcode is not in our database.",
        variant: "destructive",
      })
    }
  }

  // Set default expiry date based on product category
  const setDefaultExpiryDate = (category: string) => {
    const today = new Date()
    let daysToAdd = 7 // default

    switch (category.toLowerCase()) {
      case "meat":
      case "seafood":
        daysToAdd = 5
        break
      case "dairy":
        daysToAdd = 10
        break
      case "vegetables":
      case "fruits":
        daysToAdd = 7
        break
      case "herbs":
        daysToAdd = 5
        break
      default:
        daysToAdd = 30
    }

    setExpiryDate(addDays(today, daysToAdd))
  }

  // Add product to ingredients
  const addToIngredients = async () => {
    if (!matchedProduct) return

    setIsProcessing(true)

    try {
      await addIngredientDirectly({
        productId: matchedProduct.id,
        name: matchedProduct.name,
        quantity,
        unit: matchedProduct.unit,
        expiryDate,
        addedDate: new Date(),
      })

      toast({
        title: "Added to kitchen",
        description: `${quantity} ${matchedProduct.unit} of ${matchedProduct.name} added to your kitchen.`,
      })

      // Reset form
      setScannedBarcode(null)
      setManualBarcode("")
      setMatchedProduct(null)
      setQuantity(1)
      setExpiryDate(addDays(new Date(), 7))

      // Redirect to ingredients page
      router.push("/ingredients")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add ingredient to your fridge.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Reset scan
  const resetScan = () => {
    setScannedBarcode(null)
    setManualBarcode("")
    setMatchedProduct(null)
    setQuantity(1)
    setExpiryDate(addDays(new Date(), 7))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Scan Product</h1>

      {!isScanning && !matchedProduct && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Barcode</CardTitle>
              <CardDescription>Scan a product barcode to add it to your fridge</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <Button size="lg" className="w-full mb-4" onClick={() => setIsScanning(true)}>
                <Camera className="mr-2 h-5 w-5" />
                Start Camera
              </Button>

              <div className="w-full mt-4">
                <div className="text-center text-sm text-muted-foreground mb-4">Or enter a barcode manually</div>
                <div className="flex w-full max-w-sm items-center space-x-2 mx-auto">
                  <Input
                    type="text"
                    placeholder="Enter barcode number"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                  />
                  <Button type="submit" onClick={handleManualEntry}>
                    <Barcode className="mr-2 h-4 w-4" />
                    Enter
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-sm text-muted-foreground mb-2">Try these sample barcodes:</div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" onClick={() => setManualBarcode("5901234123457")}>
                  Eggs (5901234123457)
                </Button>
                <Button variant="outline" onClick={() => setManualBarcode("4003994155486")}>
                  Milk (4003994155486)
                </Button>
                <Button variant="outline" onClick={() => setManualBarcode("8901234567893")}>
                  Chicken (8901234567893)
                </Button>
                <Button variant="outline" onClick={() => setManualBarcode("7501234567893")}>
                  Broccoli (7501234567893)
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {isScanning && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Scanning...</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsScanning(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Position the barcode in the center of the camera</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg border border-dashed border-muted-foreground/50 aspect-video">
              <BarcodeScanner onDetected={handleScan} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-primary/50 rounded-lg"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {matchedProduct && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Product Found</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetScan}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{scannedBarcode || manualBarcode}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium text-lg">{matchedProduct.name}</h3>
                <p className="text-sm text-muted-foreground">{matchedProduct.category}</p>
                <p className="text-sm">
                  ฿{matchedProduct.price} per {matchedProduct.unit}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    className="mx-2 text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  />
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="expiry-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={(date) => date && setExpiryDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={addToIngredients} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Add to Kitchen
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
