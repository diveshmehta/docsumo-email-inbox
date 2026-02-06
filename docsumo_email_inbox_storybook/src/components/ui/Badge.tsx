import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Badge component matching Docsumo Storybook
 * Types: default, custom, large, icon
 */

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'bol' | 'tender' | 'lumper' | 'other'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full'

  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    info: 'bg-primary-100 text-primary-700',
    // Document type specific colors
    bol: 'bg-blue-100 text-blue-700',
    tender: 'bg-purple-100 text-purple-700',
    lumper: 'bg-amber-100 text-amber-700',
    other: 'bg-neutral-100 text-neutral-600',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

// Classification Badge - specific for document types
export interface ClassificationBadgeProps {
  type: 'BOL' | 'Tender' | 'LumperReceipt' | 'Other'
  confidence?: number
  size?: 'sm' | 'md'
}

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  type,
  confidence,
  size = 'md',
}) => {
  const typeConfig = {
    BOL: { label: 'BOL', variant: 'bol' as const, icon: '📦' },
    Tender: { label: 'Tender', variant: 'tender' as const, icon: '📋' },
    LumperReceipt: { label: 'Lumper', variant: 'lumper' as const, icon: '🧾' },
    Other: { label: 'Other', variant: 'other' as const, icon: '📄' },
  }

  const config = typeConfig[type]

  return (
    <Badge variant={config.variant} size={size}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {confidence !== undefined && (
        <span className="opacity-70">({Math.round(confidence * 100)}%)</span>
      )}
    </Badge>
  )
}

// Status Badge for workflow status
export interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  size?: 'sm' | 'md'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'default' as const },
    in_progress: { label: 'Processing', variant: 'info' as const },
    completed: { label: 'Complete', variant: 'success' as const },
    failed: { label: 'Failed', variant: 'error' as const },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  )
}
