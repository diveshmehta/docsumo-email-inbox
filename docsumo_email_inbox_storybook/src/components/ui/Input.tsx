import React from 'react'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

/**
 * Input component matching Docsumo Storybook
 * Variants: default, filled, error, disabled
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'error'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', leftIcon, rightIcon, error, disabled, ...props }, ref) => {
    const baseStyles = 'w-full rounded-md border transition-all duration-150 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-0'

    const variants = {
      default: 'border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-100',
      filled: 'border-neutral-200 bg-neutral-50 focus:border-primary-500 focus:ring-primary-100 focus:bg-white',
      error: 'border-error-500 bg-white focus:border-error-500 focus:ring-error-100',
    }

    const disabledStyles = 'opacity-50 cursor-not-allowed bg-neutral-50'

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            baseStyles,
            variants[error ? 'error' : variant],
            disabled && disabledStyles,
            leftIcon ? 'pl-10' : 'pl-3',
            rightIcon ? 'pr-10' : 'pr-3',
            'py-2.5',
            className
          )}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-error-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Search Input - specific variant for search functionality
export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onSearch?.(e.target.value)
    }

    return (
      <Input
        ref={ref}
        variant="filled"
        leftIcon={<Search className="h-4 w-4" />}
        placeholder="Search emails..."
        onChange={handleChange}
        className={cn('w-64', className)}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'
