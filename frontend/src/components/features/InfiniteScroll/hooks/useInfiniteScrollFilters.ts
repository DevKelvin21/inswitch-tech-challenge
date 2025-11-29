import { useState, useCallback, useMemo } from 'react'
import { useDebounce } from '../../../../hooks/useDebounce'
import type { FilterState, ScrollItem } from '../../../../types/infiniteScroll.types'

/**
 * Hook to manage infinite scroll filters and search
 *
 * @description Manages filter state, search input, and provides client-side
 * filtering capabilities. Search is automatically debounced to prevent excessive
 * API calls during typing.
 *
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 *
 * @returns Object containing:
 * - State: search, debouncedSearch, filters, filterState
 * - Actions: handleSearchChange, handleFilterChange, clearAll, clearSearch, clearFilter
 * - Computed: hasActiveFilters, activeFilterCount, filterData
 *
 * @example
 * ```tsx
 * const { search, filters, filterData, handleSearchChange } = useInfiniteScrollFilters(300)
 * ```
 */
export function useInfiniteScrollFilters(debounceMs = 300) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string | string[]>>({})

  const debouncedSearch = useDebounce(search, debounceMs)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const handleFilterChange = useCallback((filterId: string, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
  }, [])

  const clearAll = useCallback(() => {
    setSearch('')
    setFilters({})
  }, [])

  const clearSearch = useCallback(() => {
    setSearch('')
  }, [])

  const clearFilter = useCallback((filterId: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[filterId]
      return newFilters
    })
  }, [])

  const hasActiveFilters = useMemo(() => {
    return search.length > 0 || Object.keys(filters).length > 0
  }, [search, filters])

  const activeFilterCount = useMemo(() => {
    let count = search.length > 0 ? 1 : 0
    count += Object.values(filters).filter((value) => {
      if (Array.isArray(value)) return value.length > 0
      return value !== ''
    }).length
    return count
  }, [search, filters])

  const filterData = useCallback(
    <T extends ScrollItem>(data: T[]): T[] => {
      let filtered = data

      if (debouncedSearch) {
        filtered = filtered.filter((item) => {
          return Object.values(item).some((value) =>
            String(value).toLowerCase().includes(debouncedSearch.toLowerCase())
          )
        })
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return

        filtered = filtered.filter((item) => {
          const itemValue = item[key]

          if (Array.isArray(value)) {
            return value.includes(String(itemValue))
          }

          return String(itemValue) === String(value)
        })
      })

      return filtered
    },
    [debouncedSearch, filters]
  )

  const filterState: FilterState = {
    search: debouncedSearch,
    filters,
  }

  return {
    // State
    search,
    debouncedSearch,
    filters,
    filterState,

    // Actions
    handleSearchChange,
    handleFilterChange,
    clearAll,
    clearSearch,
    clearFilter,

    // Computed
    hasActiveFilters,
    activeFilterCount,
    filterData,
  }
}
