import { Search, X, RotateCcw } from 'lucide-react'
import type { ExportFormat } from '../../../../types/table.types'

interface TableToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  onClearFilters: () => void
  onClearSorting: () => void
  onExport: (format: ExportFormat) => void
  selectedCount: number
  totalCount: number
  exportFormats: ExportFormat[]
  hasActiveFilters: boolean
  hasActiveSorting: boolean
}

export function TableToolbar({
  globalFilter,
  onGlobalFilterChange,
  onClearFilters,
  onClearSorting,
  onExport,
  selectedCount,
  totalCount,
  exportFormats,
  hasActiveFilters,
  hasActiveSorting,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {globalFilter && (
            <button
              onClick={() => onGlobalFilterChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <span className="text-sm text-gray-600">
            {selectedCount} of {totalCount} selected
          </span>
        )}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}

        {hasActiveSorting && (
          <button
            onClick={onClearSorting}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Sorting
          </button>
        )}

        {exportFormats.length > 0 && (
          <div className="relative inline-block">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onExport(e.target.value as ExportFormat)
                  e.target.value = ''
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="">Export Data</option>
              {exportFormats.includes('csv') && (
                <option value="csv">Export as CSV</option>
              )}
              {exportFormats.includes('json') && (
                <option value="json">Export as JSON</option>
              )}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
