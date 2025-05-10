"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSmartFridge } from "@/context/smart-fridge-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Upload, Camera, FileText, Loader2, CalendarIcon, Plus, X, Check, ArrowLeft, Trash2 } from "lucide-react"
import { ReceiptUploader } from "@/components/receipt-uploader"
import { processReceiptImage } from "@/lib/receipt-processor"
import type { ExtractedItem } from "@/lib/types"

export default function ReceiptPage() {
  const { addMultipleIngredients } = useSmartFridge()
  const { toast } = useToast()
  const router = useRouter()

  // State for file upload
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([])

  // State for manual entry
  const [manualItem, setManualItem] = useState({
    name: "",
    quantity: 1,
    unit: "piece",
    expiryDate: addDays(new Date(), 7),
  })

  // Handle file upload
  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file)
    setIsUploading(false)
  }, [])

  // Process receipt
  const processReceipt = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a receipt image first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // In a real app, we would send the file to a backend API
      // For demo purposes, we'll use a mock function
      const items = await processReceiptImage(uploadedFile)
      setExtractedItems(items)

      toast({
        title: "Receipt processed",
        description: `Found ${items.length} items on your receipt.`,
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to process the receipt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Reset upload
  const resetUpload = () => {
    setUploadedFile(null)
    setExtractedItems([])
  }

  // Add extracted items to ingredients
  const addExtractedItems = async () => {
    if (extractedItems.length === 0) {
      toast({
        title: "No items to add",
        description: "There are no items to add to your ingredients.",
        variant: "destructive",
      })
      return
    }

    try {
      await addMultipleIngredients(
        extractedItems.map((item) => ({
          ...item,
          addedDate: new Date(),
          expiryDate: addDays(new Date(), 7), // Default expiry date
        })),
      )

      toast({
        title: "Items added",
        description: `${extractedItems.length} items added to your kitchen.`,
      })

      // Reset form and redirect to ingredients page
      resetUpload()
      router.push("/ingredients")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add items to your kitchen.",
        variant: "destructive",
      })
    }
  }

  // Handle manual item input change
  const handleManualInputChange = (field: string, value: any) => {
    setManualItem((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Add manual item
  const addManualItem = async () => {
    if (!manualItem.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter an item name.",
        variant: "destructive",
      })
      return
    }

    try {
      await addMultipleIngredients([
        {
          name: manualItem.name,
          quantity: manualItem.quantity,
          unit: manualItem.unit,
          addedDate: new Date(),
          expiryDate: manualItem.expiryDate,
        },
      ])

      toast({
        title: "Item added",
        description: `${manualItem.name} added to your kitchen.`,
      })

      // Reset form
      setManualItem({
        name: "",
        quantity: 1,
        unit: "piece",
        expiryDate: addDays(new Date(), 7),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to your kitchen.",
        variant: "destructive",
      })
    }
  }

  // Remove an item from extracted items
  const removeExtractedItem = (index: number) => {
    setExtractedItems((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Upload Receipt</h1>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload Receipt
          </TabsTrigger>
          <TabsTrigger value="manual">
            <FileText className="mr-2 h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Receipt</CardTitle>
              <CardDescription>
                Upload a photo of your receipt to automatically add items to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <ReceiptUploader
                  onFileUpload={handleFileUpload}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={resetUpload}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button className="w-full" onClick={processReceipt} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Receipt...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Process Receipt
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {extractedItems.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Extracted Items</CardTitle>
                <CardDescription>Review the items extracted from your receipt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {extractedItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeExtractedItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={addExtractedItems}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Kitchen
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manual" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Entry</CardTitle>
              <CardDescription>Manually add items to your ingredients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g., Milk"
                    value={manualItem.name}
                    onChange={(e) => handleManualInputChange("name", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={manualItem.quantity}
                      onChange={(e) => handleManualInputChange("quantity", Number(e.target.value) || 1)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={manualItem.unit} onValueChange={(value) => handleManualInputChange("unit", value)}>
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="bottle">Bottle</SelectItem>
                        <SelectItem value="can">Can</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="l">Liter</SelectItem>
                        <SelectItem value="ml">Milliliter</SelectItem>
                        <SelectItem value="dozen">Dozen</SelectItem>
                        <SelectItem value="bag">Bag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="expiry-date" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {manualItem.expiryDate ? format(manualItem.expiryDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={manualItem.expiryDate}
                        onSelect={(date) => date && handleManualInputChange("expiryDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={addManualItem}>
                <Check className="mr-2 h-4 w-4" />
                Add to Kitchen
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
