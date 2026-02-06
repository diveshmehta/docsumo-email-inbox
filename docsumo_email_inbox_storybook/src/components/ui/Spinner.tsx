import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Spinner component matching Docsumo Storybook
 * Sizes: sm, md, lg
 */

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label,
  className,
}) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full border-primary-200 border-t-primary-500 animate-spin',
          sizes[size]
        )}
      />
      {label && (
        <span className="text-sm text-neutral-500">{label}</span>
      )}
    </div>
  )
}

// Page Loader variant
export const PageLoader: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  )
}
