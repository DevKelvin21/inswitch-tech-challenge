import { useMemo, useRef, useEffect } from 'react'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import type { User } from '../config/tableConfig'
import type { ColumnConfig } from '../../../../types/table.types'

const columnHelper = createColumnHelper<User>()

// Helper component for indeterminate checkbox
function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return <input type="checkbox" ref={ref} {...rest} />
}

/**
 * Hook to convert our config-based columns to TanStack Table column definitions
 */
export function useTableColumns(
  configColumns: ColumnConfig<User>[],
  enableSelection: boolean
) {
  return useMemo(() => {
    const columns: ColumnDef<User>[] = []

    // Add selection column if enabled
    if (enableSelection) {
      columns.push(
        columnHelper.display({
          id: 'select',
          header: ({ table }) => (
            <IndeterminateCheckbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          ),
          size: 50,
          enableSorting: false,
          enableColumnFilter: false,
        })
      )
    }

    // Convert config columns to TanStack columns
    configColumns.forEach((col) => {
      columns.push(
        columnHelper.accessor(col.accessorKey as any, {
          id: col.id,
          header: col.header,
          cell: (info) => {
            const value = info.getValue()

            // Use custom cell renderer if provided
            if (col.cell) {
              return col.cell(value)
            }

            // Default renderers based on type
            if (value == null) return '-'

            switch (col.type) {
              case 'date':
                try {
                  return format(new Date(value as string), 'MMM dd, yyyy')
                } catch {
                  return String(value)
                }

              case 'number':
                return typeof value === 'number' ? value.toLocaleString() : value

              case 'boolean':
                return value ? 'Yes' : 'No'

              default:
                return String(value)
            }
          },
          enableSorting: col.sortable ?? true,
          enableColumnFilter: col.filterable ?? true,
          size: col.width,
          minSize: col.minWidth,
          maxSize: col.maxWidth,
        }) as ColumnDef<User>
      )
    })

    return columns
  }, [configColumns, enableSelection])
}
