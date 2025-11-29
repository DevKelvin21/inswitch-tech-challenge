import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { InfiniteScrollConfig, ScrollItem, FilterState } from '../../../../types/infiniteScroll.types'
import { mockApiClient } from '../../../../services/mockApi'

/**
 * Hook to manage infinite scroll data fetching
 *
 * @description Wraps TanStack Query's useInfiniteQuery with project-specific logic.
 * Handles data fetching, client-side filtering, pagination, and page flattening.
 *
 * @template T - Type of items extending ScrollItem
 * @param config - Infinite scroll configuration
 * @param filterState - Current filter state (search + filters)
 * @param filterData - Function to apply filters client-side
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
 *   filterState,
 *   filterData
 * )
 * ```
 */
export function useInfiniteScrollData<T extends ScrollItem>(
  config: InfiniteScrollConfig<T>,
  filterState: FilterState,
  filterData: (data: T[]) => T[]
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
      const allData = await mockApiClient.get<T>(config.dataSource.endpoint)
      const filteredData = filterData(allData)

      const start = (pageParam - 1) * config.pageSize
      const end = start + config.pageSize
      const pageData = filteredData.slice(start, end)

      return {
        data: pageData,
        nextCursor: pageParam + 1,
        hasMore: end < filteredData.length,
        total: filteredData.length,
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
