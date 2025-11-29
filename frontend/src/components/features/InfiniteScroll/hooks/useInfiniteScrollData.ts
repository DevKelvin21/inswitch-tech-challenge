import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { InfiniteScrollConfig, ScrollItem, FilterState } from '../../../../types/infiniteScroll.types'
import { apiClient } from '../../../../services/apiClient'

/**
 * Hook to manage infinite scroll data fetching
 *
 * @description Wraps TanStack Query's useInfiniteQuery with project-specific logic.
 * Handles data fetching with server-side filtering, pagination, and page flattening.
 *
 * @template T - Type of items extending ScrollItem
 * @param config - Infinite scroll configuration
 * @param filterState - Current filter state (search + filters)
 *
 * @returns Object containing:
 * - allItems: Flattened array of all loaded items
 * - totalCount: Total number of filtered items
 * - fetchNextPage: Function to load next page
 * - hasNextPage: Whether more pages are available
 * - isFetchingNextPage: Loading state for pagination
 * - isLoading: Initial loading state
 * - isError: Error state
 * - error: Error object if any
 * - refetch: Function to refetch all data
 *
 * @example
 * ```tsx
 * const { allItems, fetchNextPage, hasNextPage } = useInfiniteScrollData(
 *   config,
 *   filterState
 * )
 * ```
 */
export function useInfiniteScrollData<T extends ScrollItem>(
  config: InfiniteScrollConfig<T>,
  filterState: FilterState,
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['infinite-scroll', config.id, filterState],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, unknown> = {
        page: pageParam,
        limit: config.pageSize,
      }

      if (filterState.search) {
        params.search = filterState.search
      }

      Object.entries(filterState.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' &&
            !(Array.isArray(value) && value.length === 0)) {
          params[key] = Array.isArray(value) ? value.join(',') : value
        }
      })

      const response = await apiClient.get<T>(config.dataSource.endpoint, params)

      return {
        data: response.data,
        nextCursor: pageParam + 1,
        hasMore: response.meta.page < response.meta.totalPages,
        total: response.meta.total,
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined
    },
    initialPageParam: 1,
  })

  const allItems = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.total ?? 0

  return {
    allItems,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  }
}
