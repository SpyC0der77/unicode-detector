"use client"

import React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { X, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DrawingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: (characters: string[]) => void
}

function removeBackgroundColor(
  imageData: ImageData,
  ctx: CanvasRenderingContext2D
): ImageData {
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  // Sample corners to detect background color
  const corners = [
    { x: 0, y: 0 },
    { x: width - 1, y: 0 },
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 },
  ]

  // Get colors at corners
  const cornerColors = corners.map(({ x, y }) => {
    const idx = (y * width + x) * 4
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: data[idx + 3],
    }
  })

  // Check if corners are similar (likely a solid background)
  const tolerance = 30
  const referenceColor = cornerColors[0]
  const allSimilar = cornerColors.every(
    (c) =>
      Math.abs(c.r - referenceColor.r) < tolerance &&
      Math.abs(c.g - referenceColor.g) < tolerance &&
      Math.abs(c.b - referenceColor.b) < tolerance
  )

  if (!allSimilar) {
    // No uniform background detected, return original
    return imageData
  }

  // Create new image data with white background and black foreground
  const newImageData = ctx.createImageData(width, height)
  const newData = newImageData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Check if this pixel is similar to background color
    const isBg =
      Math.abs(r - referenceColor.r) < tolerance &&
      Math.abs(g - referenceColor.g) < tolerance &&
      Math.abs(b - referenceColor.b) < tolerance

    if (isBg) {
      // Make background white
      newData[i] = 255
      newData[i + 1] = 255
      newData[i + 2] = 255
      newData[i + 3] = 255
    } else {
      // Make foreground black
      newData[i] = 0
      newData[i + 1] = 0
      newData[i + 2] = 0
      newData[i + 3] = 255
    }
  }

  return newImageData
}

export function DrawingModal({ open, onOpenChange, onSearch }: DrawingModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!open) return
    
    const timer = setTimeout(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }, 50)

    return () => clearTimeout(timer)
  }, [open])

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in e) {
      const touch = e.touches[0]
      if (!touch) return null
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoordinates(e)
    if (!coords) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
    setIsDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return

    const coords = getCoordinates(e)
    if (!coords) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const img = new Image()
    img.onload = () => {
      // Clear and draw uploaded image
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calculate scaling to fit the image in canvas while maintaining aspect ratio
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      // Get image data and remove background
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const processedData = removeBackgroundColor(imageData, ctx)
      ctx.putImageData(processedData, 0, 0)

      setHasDrawn(true)
    }

    img.src = URL.createObjectURL(file)

    // Reset input so same file can be uploaded again
    e.target.value = ""
  }

  const handleAnalyze = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsAnalyzing(true)

    try {
      const imageData = canvas.toDataURL("image/png")
      const response = await fetch("/api/recognize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze")
      }

      onSearch(data.characters)
      onOpenChange(false)
      clearCanvas()
    } catch (err) {
      console.error("Analysis failed:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-foreground">Draw a Character</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Draw a character or upload an image to find matching Unicode symbols
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-[400px] aspect-square border border-border rounded-lg cursor-crosshair touch-none bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              className="flex-1 bg-transparent" 
              onClick={clearCanvas} 
              disabled={isAnalyzing}
            >
              Clear
            </Button>
            <Button 
              variant="outline"
              className="flex-1 bg-transparent" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isAnalyzing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleAnalyze} 
              disabled={!hasDrawn || isAnalyzing}
            >
              {isAnalyzing ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
