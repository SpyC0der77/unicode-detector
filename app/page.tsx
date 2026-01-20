"use client"

import { useState, useEffect, useMemo } from "react"
import { CategoryFilter } from "@/components/category-sidebar"
import { SearchHeader } from "@/components/search-header"
import { CharacterGrid } from "@/components/character-grid"
import { CharacterModal } from "@/components/character-modal"
import { DrawingModal } from "@/components/drawing-modal"
import {
  UNICODE_CATEGORIES,
  generateCharactersForCategory,
  searchCharacters,
  getCommonName,
  type UnicodeCharacter,
} from "@/lib/unicode-data"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCharacter, setSelectedCharacter] = useState<UnicodeCharacter | null>(null)
  const [characterModalOpen, setCharacterModalOpen] = useState(false)
  const [drawingModalOpen, setDrawingModalOpen] = useState(false)
  const [drawnCharacters, setDrawnCharacters] = useState<string[]>([])
  const searchParams = useSearchParams()

  const characters = useMemo(() => {
    let result: UnicodeCharacter[] = []
    
    // If we have drawn characters, show those
    if (drawnCharacters.length > 0) {
      result = drawnCharacters.map((char) => {
        const codePoint = char.codePointAt(0) || 0
        const category = UNICODE_CATEGORIES.find(
          (c) => codePoint >= c.range[0] && codePoint <= c.range[1]
        )
        return {
          char,
          codePoint,
          name: `Unicode U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`,
          commonName: getCommonName(codePoint),
          category: category?.name || "Unknown",
          htmlEntity: `&#${codePoint};`,
          cssCode: `\\${codePoint.toString(16).toUpperCase()}`,
        }
      })
    }
    // If there's a search query, search across selected categories (or all if none selected)
    else if (searchQuery.trim()) {
      result = searchCharacters(searchQuery, selectedCategories.length > 0 ? selectedCategories : null)
    }
    // Otherwise show characters from selected categories, or all categories if none selected
    else {
      const categoriesToShow = selectedCategories.length > 0 
        ? UNICODE_CATEGORIES.filter(c => selectedCategories.includes(c.id))
        : UNICODE_CATEGORIES
      
      for (const category of categoriesToShow) {
        result = result.concat(generateCharactersForCategory(category))
      }
    }
    
    return result
  }, [selectedCategories, searchQuery, drawnCharacters])

  const handleSelectCharacter = (character: UnicodeCharacter) => {
    setSelectedCharacter(character)
    setCharacterModalOpen(true)
  }

  const handleDrawSearch = (chars: string[]) => {
    setDrawnCharacters(chars)
    setSearchQuery("")
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setDrawnCharacters([])
  }

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
    setDrawnCharacters([])
  }

  const handleSelectAll = () => {
    setSelectedCategories(UNICODE_CATEGORIES.map((c) => c.id))
    setDrawnCharacters([])
  }

  const handleClearAll = () => {
    setSelectedCategories([])
    setDrawnCharacters([])
  }

  useEffect(() => {
    const query = searchParams?.get("query")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  return (
    <main className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Unicode Explorer</h1>
        {drawnCharacters.length > 0 && (
          <button
            onClick={() => setDrawnCharacters([])}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear drawing results
          </button>
        )}
      </div>
      
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onDrawClick={() => setDrawingModalOpen(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <CategoryFilter
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <CharacterGrid
            characters={characters}
            onSelectCharacter={handleSelectCharacter}
            isLoading={false}
          />
        </div>
      </div>
      
      <CharacterModal
        character={selectedCharacter}
        open={characterModalOpen}
        onOpenChange={setCharacterModalOpen}
      />
      
      <DrawingModal
        open={drawingModalOpen}
        onOpenChange={setDrawingModalOpen}
        onSearch={handleDrawSearch}
      />
    </main>
  )
}
