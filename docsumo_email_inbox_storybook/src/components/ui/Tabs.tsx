import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Tabs component matching Docsumo Storybook
 */

export interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

export interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
  variant?: 'default' | 'pills'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'default',
}) => {
  if (variant === 'pills') {
    return (
      <div className={cn('flex gap-1 p-1 bg-neutral-100 rounded-lg', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
              activeTab === tab.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'min-w-[20px] px-1.5 py-0.5 text-xs rounded-full',
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-200 text-neutral-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('border-b border-neutral-200', className)}>
      <nav className="flex gap-6 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'min-w-[20px] px-1.5 py-0.5 text-xs rounded-full',
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-100 text-neutral-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
