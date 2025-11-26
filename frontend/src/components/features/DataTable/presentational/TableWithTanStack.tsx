import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnSizingState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, GripVertical } from 'lucide-react'
import type { TableFeatures } from '../../../../types/table.types'
import type { User } from '../config/tableConfig'

interface TableWithTanStackProps {
  data: User[]
  columns: ColumnDef<User>[]
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  globalFilter: string
  onGlobalFilterChange: OnChangeFn<string>
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  rowSelection: RowSelectionState
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  columnSizing: ColumnSizingState
  onColumnSizingChange: OnChangeFn<ColumnSizingState>
  features: TableFeatures
}

export function TableWithTanStack({
  data,
  columns,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  globalFilter,
  onGlobalFilterChange,
  pagination,
  onPaginationChange,
  rowSelection,
  onRowSelectionChange,
  columnSizing,
  onColumnSizingChange,
  features,
}: TableWithTanStackProps) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
      columnSizing,
    },
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
    onRowSelectionChange,
    onColumnSizingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: features.selection !== false,
    enableMultiRowSelection: features.selection === 'multiple',
    enableSorting: features.sorting !== false,
    enableMultiSort: features.sorting === 'multi',
    enableFilters: features.filtering,
    enableGlobalFilter: features.filtering,
    enableColumnResizing: features.columnResize,
    columnResizeMode: 'onChange',
  })

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200" style={{ width: table.getCenterTotalSize() }}>
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative"
                  style={{
                    width: header.getSize(),
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center space-x-2">
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {header.column.getCanSort() && (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:bg-gray-100 rounded p-1"
                        >
                          {{
                            asc: <ArrowUp className="w-4 h-4 text-indigo-600" />,
                            desc: <ArrowDown className="w-4 h-4 text-indigo-600" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  {features.columnResize && header.column.getCanResize() && (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-indigo-500 ${
                        header.column.getIsResizing() ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                      style={{
                        transform: header.column.getIsResizing()
                          ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
                          : '',
                      }}
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 absolute -left-1 top-1/2 -translate-y-1/2" />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}

          {features.filtering && (
            <tr className="bg-white">
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th key={`filter-${header.id}`} className="px-6 py-2">
                  {header.column.getCanFilter() ? (
                    <input
                      type="text"
                      value={(header.column.getFilterValue() ?? '') as string}
                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                      placeholder={`Filter...`}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : null}
                </th>
              ))}
            </tr>
          )}
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 ${
                  row.getIsSelected() ? 'bg-indigo-50' : ''
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
