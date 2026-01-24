'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface ActionDropdownProps {
  actions: {
    label: string
    id: string
    disabled?: boolean
  }[]
  onAction?: (actionId: string) => void
  label?: string
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
  disabled?: boolean
}

export function ActionDropdown({ actions, onAction, label = "Actions", size = "default", disabled = false }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (actionId: string) => {
    if (disabled) return
    onAction?.(actionId)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size} className="gap-2" disabled={disabled}>
          {label}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => handleAction(action.id)}
            disabled={disabled || action.disabled}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
