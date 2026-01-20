"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { UNICODE_CATEGORIES } from "@/lib/unicode-data"

interface CategoryFilterProps {
  selectedCategories: string[]
  onToggleCategory: (categoryId: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export function CategoryFilter({ 
  selectedCategories, 
  onToggleCategory,
  onSelectAll,
  onClearAll,
}: CategoryFilterProps) {
  const allSelected = selectedCategories.length === UNICODE_CATEGORIES.length
  const noneSelected = selectedCategories.length === 0

  return (
    <div className="w-1/5 min-w-48 shrink-0 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-medium text-sm text-foreground">Filters</h2>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={allSelected}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            All
          </button>
          <span className="text-muted-foreground">/</span>
          <button
            onClick={onClearAll}
            disabled={noneSelected}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            None
          </button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {UNICODE_CATEGORIES.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onToggleCategory(category.id)}
                className="border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
              />
              <span className="text-sm text-foreground">{category.name}</span>
            </label>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
