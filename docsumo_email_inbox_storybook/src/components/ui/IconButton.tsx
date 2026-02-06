import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

/**
 * IconButton component matching Docsumo Storybook
 * Variants: contained, outlined, text
 * Sizes: xs, sm, md, lg
 */

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  icon: React.ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'text',
      color = 'primary',
      size = 'md',
      loading = false,
      disabled,
      icon,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center transition-all duration-150 focus-ring rounded-md disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      contained: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
      },
      outlined: {
        primary: 'border border-neutral-300 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-400',
        danger: 'border border-error-300 text-error-500 hover:bg-error-50',
      },
      text: {
        primary: 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700',
        danger: 'text-error-500 hover:bg-error-50',
      },
    }

    const sizes = {
      xs: 'h-6 w-6 [&_svg]:h-3.5 [&_svg]:w-3.5',
      sm: 'h-8 w-8 [&_svg]:h-4 [&_svg]:w-4',
      md: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
      lg: 'h-12 w-12 [&_svg]:h-6 [&_svg]:w-6',
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant][color],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" /> : icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
