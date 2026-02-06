import React from 'react'
import { cn } from '@/lib/utils'
import { Checkbox } from './Checkbox'

/**
 * Table component matching Docsumo Storybook
 * Features: checkbox selection, row click, custom columns
 */

export interface Column<T> {
  key: string
  header: string
  width?: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  rowKey: keyof T
  checkedRows?: string[]
  setCheckedRows?: (rows: string[]) => void
  showCheckbox?: boolean
  onRowClick?: (row: T) => void
  selectedRowKey?: string
  rowClassName?: string | ((row: T) => string)
  emptyMessage?: string
  className?: string
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  checkedRows = [],
  setCheckedRows,
  showCheckbox = false,
  onRowClick,
  selectedRowKey,
  rowClassName,
  emptyMessage = 'No data available',
  className,
}: TableProps<T>) {
  const allChecked = data.length > 0 && checkedRows.length === data.length
  const someChecked = checkedRows.length > 0 && checkedRows.length < data.length

  const handleHeaderCheckboxChange = () => {
    if (allChecked) {
      setCheckedRows?.([])
    } else {
      setCheckedRows?.(data.map((row) => String(row[rowKey])))
    }
  }

  const handleRowCheckboxChange = (rowId: string) => {
    if (checkedRows.includes(rowId)) {
      setCheckedRows?.(checkedRows.filter((id) => id !== rowId))
    } else {
      setCheckedRows?.([...checkedRows, rowId])
    }
  }

  const getRowClassName = (row: T) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row)
    }
    return rowClassName
  }

  return (
    <div className={cn('overflow-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            {showCheckbox && (
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={handleHeaderCheckboxChange}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider',
                  column.className
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (showCheckbox ? 1 : 0)}
                className="px-4 py-8 text-center text-sm text-neutral-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const rowId = String(row[rowKey])
              const isSelected = selectedRowKey === rowId
              const isChecked = checkedRows.includes(rowId)

              return (
                <tr
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-neutral-100 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-neutral-50',
                    isSelected && 'bg-primary-50',
                    isChecked && 'bg-primary-50/50',
                    getRowClassName(row)
                  )}
                >
                  {showCheckbox && (
                    <td
                      className="w-12 px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleRowCheckboxChange(rowId)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-sm text-neutral-700',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
