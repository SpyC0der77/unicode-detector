"use client"

import { Search, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onDrawClick: () => void
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  onDrawClick,
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
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
