import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

/**
 * Accordion component matching Docsumo Storybook
 */

export interface AccordionItem {
  id: string
  title: React.ReactNode
  content: React.ReactNode
  defaultOpen?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className,
}) => {
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter((item) => item.defaultOpen).map((item) => item.id)
  )

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className={cn('divide-y divide-neutral-200 border border-neutral-200 rounded-lg', className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
            >
              <span className="text-sm font-medium text-neutral-800">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-neutral-400 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 animate-fade-in">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Single Accordion Item variant
export interface AccordionPanelProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export const AccordionPanel: React.FC<AccordionPanelProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border border-neutral-200 rounded-lg', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
      >
        <span className="text-sm font-medium text-neutral-800">{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-neutral-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in border-t border-neutral-100">
          {children}
        </div>
      )}
    </div>
  )
}
