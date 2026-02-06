import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Check, Search } from 'lucide-react'

/**
 * Dropdown component matching Docsumo Storybook
 * Variants: normal, search, multi-select
 */

export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  searchable?: boolean
  multiple?: boolean
  disabled?: boolean
  className?: string
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  multiple = false,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedValues = Array.isArray(value) ? value : value ? [value] : []

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder
    if (multiple) {
      return `${selectedValues.length} selected`
    }
    return options.find((o) => o.value === selectedValues[0])?.label || placeholder
  }

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange?.(newValues)
    } else {
      onChange?.(optionValue)
      setIsOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border text-sm',
          'bg-white border-neutral-300 hover:border-neutral-400 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500',
          disabled && 'opacity-50 cursor-not-allowed bg-neutral-50',
          isOpen && 'border-primary-500 ring-2 ring-primary-100'
        )}
      >
        <span className={cn(selectedValues.length === 0 && 'text-neutral-400')}>
          {getDisplayValue()}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-neutral-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-neutral-200 rounded-md shadow-lg animate-fade-in">
          {searchable && (
            <div className="p-2 border-b border-neutral-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-neutral-200 rounded focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          )}
          <ul className="max-h-60 overflow-auto py-1">
            {filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-neutral-50',
                    selectedValues.includes(option.value) && 'bg-primary-50 text-primary-600'
                  )}
                >
                  {multiple && (
                    <div
                      className={cn(
                        'h-4 w-4 rounded border flex items-center justify-center',
                        selectedValues.includes(option.value)
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-neutral-300'
                      )}
                    >
                      {selectedValues.includes(option.value) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  )}
                  {option.icon}
                  <span>{option.label}</span>
                  {!multiple && selectedValues.includes(option.value) && (
                    <Check className="ml-auto h-4 w-4 text-primary-500" />
                  )}
                </button>
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-sm text-neutral-400">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
