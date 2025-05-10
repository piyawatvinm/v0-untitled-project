"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReceiptUploaderProps {
  onFileUpload: (file: File) => void
  isUploading: boolean
  setIsUploading: (isUploading: boolean) => void
}

export function ReceiptUploader({ onFileUpload, isUploading, setIsUploading }: ReceiptUploaderProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        setIsUploading(true)
        // Simulate a brief upload delay for UX
        setTimeout(() => {
          onFileUpload(acceptedFiles[0])
        }, 1000)
      }
    },
    [onFileUpload, setIsUploading],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".heic"],
    },
    maxFiles: 1,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
        dragActive || isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Uploading receipt...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="mb-2 text-sm text-center">
              <span className="font-semibold">Drag and drop</span> your receipt image here or{" "}
              <span className="font-semibold">click to browse</span> for a file
            </p>
            <p className="text-xs text-muted-foreground text-center">Supported formats: JPEG, PNG, WebP</p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={open} type="button">
              Browse Files
            </Button>
            {/* For mobile devices with camera */}
            <Button variant="outline" onClick={open} type="button">
              <Camera className="mr-2 h-4 w-4" />
              New Photo
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
