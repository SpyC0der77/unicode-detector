"use client"

import { useState } from "react"
import JSZip from "jszip"
import { Button } from "@/components/ui/button"
import { ActionDropdown } from "@/components/action-dropdown"
import type { UnicodeCharacter } from "@/lib/unicode-data"

interface BulkExportToolbarProps {
  selectedCharacters: UnicodeCharacter[]
  onClearSelection: () => void
  totalCount: number
}

export function BulkExportToolbar({
  selectedCharacters,
  onClearSelection,
  totalCount,
}: BulkExportToolbarProps) {
  const selectedCount = selectedCharacters.length
  const hasSelection = selectedCount > 0
  const [isExporting, setIsExporting] = useState(false)

  const generateSvg = (character: UnicodeCharacter): string => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <text x="50" y="70" fontSize="60" textAnchor="middle" fill="white">${character.char}</text>
</svg>`
  }

  const generatePng = async (character: UnicodeCharacter, transparent: boolean): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(new Blob())
        return
      }
      
      if (!transparent) {
        ctx.fillStyle = "#18181b"
        ctx.fillRect(0, 0, 200, 200)
        ctx.fillStyle = "#ffffff"
      } else {
        ctx.fillStyle = "#000000"
      }
      
      ctx.font = "120px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(character.char, 100, 100)
      
      canvas.toBlob((blob) => {
        resolve(blob || new Blob())
      }, "image/png")
    })
  }

  const downloadZip = async (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsSvgZip = async () => {
    if (!hasSelection) return
    
    setIsExporting(true)
    try {
      const zip = new JSZip()
      
      for (const character of selectedCharacters) {
        const svg = generateSvg(character)
        const codePointHex = character.codePoint.toString(16).toUpperCase().padStart(4, "0")
        zip.file(`unicode-${codePointHex}.svg`, svg)
      }
      
      const blob = await zip.generateAsync({ type: "blob" })
      await downloadZip(blob, `unicode-characters-svg-${Date.now()}.zip`)
    } catch (error) {
      console.error("Failed to export SVG zip:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsPngZip = async (transparent: boolean) => {
    if (!hasSelection) return
    
    setIsExporting(true)
    try {
      const zip = new JSZip()
      
      // Generate PNGs in batches to avoid blocking
      const batchSize = 10
      for (let i = 0; i < selectedCharacters.length; i += batchSize) {
        const batch = selectedCharacters.slice(i, i + batchSize)
        const promises = batch.map(async (character) => {
          const pngBlob = await generatePng(character, transparent)
          const codePointHex = character.codePoint.toString(16).toUpperCase().padStart(4, "0")
          const suffix = transparent ? "-transparent" : ""
          zip.file(`unicode-${codePointHex}${suffix}.png`, pngBlob)
        })
        await Promise.all(promises)
      }
      
      const blob = await zip.generateAsync({ type: "blob" })
      const suffix = transparent ? "-transparent" : ""
      await downloadZip(blob, `unicode-characters-png${suffix}-${Date.now()}.zip`)
    } catch (error) {
      console.error("Failed to export PNG zip:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="border-b border-border bg-card px-4 py-2 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">
          {selectedCount.toLocaleString()} of {totalCount.toLocaleString()} selected
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
          disabled={!hasSelection}
        >
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ActionDropdown
          label={isExporting ? "Exporting..." : "Download"}
          size="sm"
          disabled={!hasSelection || isExporting}
          actions={[
            { label: "PNG (Solid Background)", id: "download-png" },
            { label: "PNG (Transparent)", id: "download-png-transparent" },
            { label: "SVG", id: "download-svg" },
          ]}
          onAction={(actionId) => {
            if (!hasSelection || isExporting) return
            switch (actionId) {
              case "download-png":
                exportAsPngZip(false)
                break
              case "download-png-transparent":
                exportAsPngZip(true)
                break
              case "download-svg":
                exportAsSvgZip()
                break
            }
          }}
        />
      </div>
    </div>
  )
}
