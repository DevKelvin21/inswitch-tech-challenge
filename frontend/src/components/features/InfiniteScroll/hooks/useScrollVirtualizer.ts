import { useVirtualizer } from '@tanstack/react-virtual'
import type { InfiniteScrollConfig, ScrollItem } from '../../../../types/infiniteScroll.types'

/**
 * Hook to set up virtual scrolling
 *
 * @description Configures TanStack Virtual's useVirtualizer for optimal performance.
 * Only renders visible items in the viewport, significantly improving performance
 * for large lists (1000+ items).
 *
 * @template T - Type of items extending ScrollItem
 * @param allItems - All loaded items to virtualize
 * @param hasNextPage - Whether more pages are available (adds loader row)
 * @param config - Infinite scroll configuration with virtualization settings
 * @param parentRef - Ref to scroll container element
 *
 * @returns Virtualizer instance with methods:
 * - getVirtualItems(): Array of visible virtual items
 * - getTotalSize(): Total height of all items
 * - scrollToIndex(index): Scroll to specific item
 *
 * @example
 * ```tsx
 * const virtualizer = useScrollVirtualizer(allItems, hasNextPage, config, parentRef)
 * virtualizer.getVirtualItems().map(item => ...)
 * ```
 */
export function useScrollVirtualizer<T extends ScrollItem>(
  allItems: T[],
  hasNextPage: boolean | undefined,
  config: InfiniteScrollConfig<T>,
  parentRef: React.RefObject<HTMLDivElement | null>
) {
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => config.virtualization.estimateSize,
    overscan: config.virtualization.overscan ?? 5,
  })

  return rowVirtualizer
}
