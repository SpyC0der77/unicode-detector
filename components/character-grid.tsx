"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { UnicodeCharacter } from "@/lib/unicode-data"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

interface CharacterGridProps {
  characters: UnicodeCharacter[]
  onSelectCharacter: (character: UnicodeCharacter) => void
  isLoading?: boolean
  selectionMode?: boolean
  selectedCodePoints?: Set<number>
  onToggleSelect?: (codePoint: number) => void
}

const BATCH_SIZE = 200
const LOAD_THRESHOLD = 300

export function CharacterGrid({ 
  characters, 
  onSelectCharacter, 
  isLoading,
  selectionMode = false,
  selectedCodePoints = new Set(),
  onToggleSelect,
}: CharacterGridProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  // Reset visible count when characters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE)
  }, [characters])

  const handleScroll = useCallback(() => {
    if (loadingRef.current) return
    
    const container = containerRef.current
    if (!container) return
    
    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    
    if (distanceFromBottom < LOAD_THRESHOLD && visibleCount < characters.length) {
      loadingRef.current = true
      setVisibleCount(prev => Math.min(prev + BATCH_SIZE, characters.length))
      setTimeout(() => {
        loadingRef.current = false
      }, 100)
    }
  }, [visibleCount, characters.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading characters...</div>
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No characters found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Try a different search or select some filters
          </p>
        </div>
      </div>
    )
  }

  const visibleCharacters = characters.slice(0, visibleCount)
  const hasMore = visibleCount < characters.length

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">
          {characters.length.toLocaleString()} characters {hasMore && `(showing ${visibleCount.toLocaleString()})`}
        </p>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2">
          {visibleCharacters.map((character, index) => {
            const isSelected = selectedCodePoints.has(character.codePoint)
            return (
              <div
                key={`${character.codePoint}-${index}`}
                className={cn(
                  "relative aspect-square rounded-md",
                  "bg-muted hover:bg-accent transition-colors",
                  selectionMode && isSelected && "!bg-primary/20"
                )}
              >
                {selectionMode && !isSelected && (
                  <div className="absolute top-1 left-1 z-10">
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => onToggleSelect?.(character.codePoint)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-background/90"
                    />
                  </div>
                )}
                <button
                  onClick={() => onSelectCharacter(character)}
                  className={cn(
                    "w-full h-full flex items-center justify-center rounded-md",
                    "text-2xl text-foreground",
                    !selectionMode && "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                  )}
                  title={`U+${character.codePoint.toString(16).toUpperCase().padStart(4, "0")}`}
                >
                  {character.char}
                </button>
              </div>
            )
          })}
        </div>
        {hasMore && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Scroll down to load more...
          </p>
        )}
      </div>
    </div>
  )
}
