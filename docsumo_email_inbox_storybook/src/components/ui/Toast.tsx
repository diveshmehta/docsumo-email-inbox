import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

/**
 * Toast component matching Docsumo Storybook
 * Types: success, error, warning, info
 */

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  action,
  className,
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconColor: 'text-success-500',
      titleColor: 'text-success-800',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200',
      iconColor: 'text-error-500',
      titleColor: 'text-error-800',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      iconColor: 'text-warning-500',
      titleColor: 'text-warning-800',
    },
    info: {
      icon: Info,
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      iconColor: 'text-primary-500',
      titleColor: 'text-primary-800',
    },
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in-right',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', config.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn('text-sm font-medium', config.titleColor)}>{title}</p>
        )}
        <p className="text-sm text-neutral-600">{message}</p>
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'mt-2 text-sm font-medium hover:underline',
              config.iconColor
            )}
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Toast Container for positioning
export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {children}
    </div>
  )
}
