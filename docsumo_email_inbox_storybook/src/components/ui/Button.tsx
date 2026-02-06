import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

/**
 * Button component matching Docsumo Storybook
 * Variants: contained, outlined, text, ghost
 * Colors: primary, danger
 * Sizes: sm, md, lg
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text' | 'ghost'
  color?: 'primary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'contained',
      color = 'primary',
      size = 'md',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-ring rounded-md disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      contained: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
      },
      outlined: {
        primary: 'border border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
        danger: 'border border-error-500 text-error-500 hover:bg-error-50 active:bg-error-100',
      },
      text: {
        primary: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
        danger: 'text-error-500 hover:bg-error-50 active:bg-error-100',
      },
      ghost: {
        primary: 'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
        danger: 'text-error-500 hover:bg-error-50 active:bg-error-100',
      },
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
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
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
