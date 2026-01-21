"use client"

import { useState } from "react"
import { Copy, Download, Check, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { UnicodeCharacter } from "@/lib/unicode-data"

interface CharacterModalProps {
  character: UnicodeCharacter | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface InfoRow {
  label: string
  value: string
  copyable: boolean
  link?: boolean
  displayValue?: string
}

export function CharacterModal({ character, open, onOpenChange }: CharacterModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!character) return null

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const downloadSvg = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <text x="50" y="70" fontSize="60" textAnchor="middle" fill="white">${character.char}</text>
</svg>`
    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `unicode-${character.codePoint.toString(16).toUpperCase()}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPng = (transparent: boolean) => {
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
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
    
    const url = canvas.toDataURL("image/png")
    const a = document.createElement("a")
    a.href = url
    const suffix = transparent ? "-transparent" : ""
    a.download = `unicode-${character.codePoint.toString(16).toUpperCase()}${suffix}.png`
    a.click()
  }

  const codePointHex = character.codePoint.toString(16).toUpperCase().padStart(4, "0")
  const wikipediaUrl = `https://en.wikipedia.org/wiki/U+${codePointHex}`

  const infoRows: InfoRow[] = [
    { label: "Character", value: character.char, copyable: true },
    ...(character.commonName ? [{ label: "Common Name", value: character.commonName, copyable: false }] : []),
    { label: "Code Point", value: `U+${codePointHex}`, copyable: true },
    { label: "Decimal", value: character.codePoint.toString(), copyable: true },
    { label: "Category", value: character.category, copyable: false },
    { label: "Wikipedia", value: wikipediaUrl, displayValue: `U+${codePointHex}`, copyable: false, link: true },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Character Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex items-center justify-center w-32 h-32 rounded-lg bg-muted">
            <span className="text-7xl text-foreground">{character.char}</span>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            <Button variant="outline" size="sm" onClick={downloadSvg}>
              <Download className="w-4 h-4 mr-2" />
              SVG
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadPng(false)}>
              <Download className="w-4 h-4 mr-2" />
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadPng(true)}>
              <Download className="w-4 h-4 mr-2" />
              PNG (Transparent)
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {infoRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
            >
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <div className="flex items-center gap-2">
                {row.link ? (
                  <a
                    href={row.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-foreground hover:underline flex items-center gap-1"
                  >
                    <code>{row.displayValue || row.value}</code>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <>
                    <code className="text-sm font-mono text-foreground">{row.value}</code>
                    {row.copyable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(row.value, row.label)}
                      >
                        {copiedField === row.label ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
