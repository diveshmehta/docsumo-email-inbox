import React from 'react'
import { cn } from '@/lib/utils'
import { Check, Minus } from 'lucide-react'

/**
 * Checkbox component matching Docsumo Storybook
 * States: normal, checked, partial, disabled
 */

export interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  label?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  className,
  label,
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'h-4 w-4 rounded border-2 flex items-center justify-center transition-all duration-150',
          checked || indeterminate
            ? 'bg-primary-500 border-primary-500'
            : 'bg-white border-neutral-300 hover:border-neutral-400',
          !disabled && 'focus:ring-2 focus:ring-primary-100 focus:ring-offset-1'
        )}
      >
        {checked && !indeterminate && (
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        )}
        {indeterminate && (
          <Minus className="h-3 w-3 text-white" strokeWidth={3} />
        )}
      </div>
      {label && (
        <span className="text-sm text-neutral-700">{label}</span>
      )}
    </label>
  )
}
