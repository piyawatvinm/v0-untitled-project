"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from "@zxing/library"
import { Loader2 } from "lucide-react"

interface BarcodeScannerProps {
  onDetected: (result: string) => void
}

export function BarcodeScanner({ onDetected }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hints = new Map()
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_128,
    ])

    const codeReader = new BrowserMultiFormatReader(hints)
    let mounted = true

    const startScanner = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if camera permissions are available
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === "videoinput")

        if (videoDevices.length === 0) {
          throw new Error("No camera found on this device")
        }

        if (videoRef.current) {
          await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
            if (result && mounted) {
              // Play a success sound
              const audio = new Audio("/beep.mp3")
              audio.play().catch(() => {
                // Ignore audio play errors
              })

              onDetected(result.getText())
            }
          })
        }
      } catch (err) {
        if (mounted) {
          console.error("Error starting barcode scanner:", err)
          setError(err instanceof Error ? err.message : "Failed to access camera")
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    startScanner()

    return () => {
      mounted = false
      codeReader.reset()
    }
  }, [onDetected])

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Accessing camera...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center p-4">
            <p className="text-destructive font-medium mb-2">Camera Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs mt-4">Please ensure you've granted camera permissions and try again.</p>
          </div>
        </div>
      )}

      <video ref={videoRef} className="w-full h-full object-cover" />
    </div>
  )
}
