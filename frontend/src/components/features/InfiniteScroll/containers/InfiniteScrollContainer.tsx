import { useRef, useCallback } from 'react'
import type { InfiniteScrollConfig, ScrollItem } from '../../../../types/infiniteScroll.types'
import { useInfiniteScrollFilters } from '../hooks/useInfiniteScrollFilters'
import { useInfiniteScrollData } from '../hooks/useInfiniteScrollData'
import { useScrollVirtualizer } from '../hooks/useScrollVirtualizer'
import { useInfiniteScrollTrigger } from '../hooks/useInfiniteScrollTrigger'
import { ScrollFilters } from '../presentational/ScrollFilters'
import { ProductCard } from '../presentational/ProductCard'
import { EmptyState } from '../presentational/EmptyState'
import { LoadingRow } from '../presentational/LoadingRow'
import { LoadingSkeleton } from '../../../shared/LoadingSkeleton'
import { ErrorState } from '../../../shared/ErrorState'
import { defaultScrollConfig, type Product } from '../config/scrollConfig'

interface InfiniteScrollContainerProps<T extends ScrollItem = ScrollItem> {
  config?: InfiniteScrollConfig<T>
}

/**
 * Container component for Infinite Scroll feature
 *
 * @description Implements infinite scrolling with virtual windowing for optimal performance.
 * Uses composable hooks for business logic and presentational components for UI.
 *
 * @features
 * - Infinite pagination with TanStack Query
 * - Virtual scrolling with TanStack Virtual (renders only visible items)
 * - Debounced search and filters
 * - Client-side filtering support
 * - Configurable item renderer
 *
 * @example
 * ```tsx
 * <InfiniteScrollContainer config={productsConfig} />
 * ```
 */
export function InfiniteScrollContainer<T extends ScrollItem = Product>({
  config = defaultScrollConfig as unknown as InfiniteScrollConfig<T>,
}: InfiniteScrollContainerProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const {
    search,
    filters,
    filterState,
    handleSearchChange,
    handleFilterChange,
    clearAll,
    hasActiveFilters,
    activeFilterCount,
    filterData,
  } = useInfiniteScrollFilters(config.searchDebounce)

  const {
    allItems,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteScrollData(config, filterState, filterData)

  const rowVirtualizer = useScrollVirtualizer(
    allItems,
    hasNextPage,
    config,
    parentRef
  )

  useInfiniteScrollTrigger(
    rowVirtualizer.getVirtualItems(),
    allItems.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  )

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  if (isLoading) {
    return <LoadingSkeleton variant="list" rows={5} />
  }

  if (isError) {
    return <ErrorState error={error as Error} onRetry={handleRetry} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
        {config.description && <p className="mt-2 text-gray-600">{config.description}</p>}
      </div>

      {(config.enableSearch || (config.filters && config.filters.length > 0)) && (
        <ScrollFilters
          search={search}
          onSearchChange={handleSearchChange}
          searchPlaceholder={config.searchPlaceholder}
          filters={config.filters ?? []}
          filterValues={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAll}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{allItems.length}</span> of{' '}
          <span className="font-medium">{totalCount}</span> results
        </p>
        {config.virtualization.enabled && (
          <p className="text-xs text-gray-500">Virtual scrolling enabled</p>
        )}
      </div>

      {allItems.length === 0 ? (
        <EmptyState message={config.emptyMessage} />
      ) : (
        <div
          ref={parentRef}
          className="border border-gray-200 rounded-lg overflow-auto"
          style={{ height: '600px' }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > allItems.length - 1
              const item = allItems[virtualRow.index]

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="p-2"
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <LoadingRow message={config.loadingMessage} />
                    ) : null
                  ) : (
                    <>
                      {config.itemRenderer ? (
                        config.itemRenderer(item)
                      ) : (
                        <ProductCard product={item as unknown as Product} />
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isFetchingNextPage && (
        <div className="text-center text-sm text-gray-500">Loading more items...</div>
      )}

      {!hasNextPage && allItems.length > 0 && (
        <div className="text-center text-sm text-gray-500 pb-4">
          You've reached the end of the list
        </div>
      )}
    </div>
  )
}
