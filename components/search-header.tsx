"use client"

import { Search, Pencil, CheckSquare, Square } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onDrawClick: () => void
  selectionMode?: boolean
  onToggleSelectionMode?: () => void
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  onDrawClick,
  selectionMode = false,
  onToggleSelectionMode,
}: SearchHeaderProps) {
  return (
    <header className="border-b border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search characters, code points..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onDrawClick}
            title="Draw to search"
            disabled={selectionMode}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          
          {onToggleSelectionMode && (
            <Button
              variant={selectionMode ? "default" : "outline"}
              size="icon"
              onClick={onToggleSelectionMode}
              title={selectionMode ? "Exit selection mode" : "Select multiple characters"}
            >
              {selectionMode ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
