import type { ScrollFilter } from '../../../../types/infiniteScroll.types'

interface ScrollFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters: ScrollFilter[]
  filterValues: Record<string, string | string[]>
  onFilterChange: (filterId: string, value: string | string[]) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
}

/**
 * Search and filter controls for infinite scroll
 *
 * @description Pure presentational component that renders search input and
 * dynamic filter controls. Supports text search with clear button, select/multiselect
 * filters, and displays active filter count with clear all functionality.
 */
export function ScrollFilters({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  filterValues,
  onFilterChange,
  onClearAll,
  hasActiveFilters,
  activeFilterCount,
}: ScrollFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {filters && filters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map((filter) => (
            <div key={filter.id}>
              <label htmlFor={filter.id} className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>

              {filter.type === 'select' && (
                <select
                  id={filter.id}
                  value={(filterValues[filter.id] as string) ?? ''}
                  onChange={(e) => onFilterChange(filter.id, e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === 'multiselect' && (
                <select
                  id={filter.id}
                  multiple
                  value={(filterValues[filter.id] as string[]) ?? []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
                    onFilterChange(filter.id, selectedOptions)
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  size={Math.min(filter.options?.length ?? 3, 5)}
                >
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {filter.type === 'text' && (
                <input
                  id={filter.id}
                  type="text"
                  value={(filterValues[filter.id] as string) ?? ''}
                  onChange={(e) => onFilterChange(filter.id, e.target.value)}
                  placeholder={filter.placeholder}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
          </span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
