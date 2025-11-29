import { useEffect } from 'react'
import type { VirtualItem } from '@tanstack/react-virtual'

/**
 * Hook to trigger infinite scroll pagination
 *
 * @description Implements intersection observer pattern to automatically fetch
 * the next page when user scrolls near the bottom of the list. Prevents
 * duplicate fetches and only triggers when conditions are met.
 *
 * @param virtualItems - Array of currently visible virtual items
 * @param allItemsLength - Total number of loaded items
 * @param hasNextPage - Whether more pages are available
 * @param isFetchingNextPage - Whether currently fetching next page
 * @param fetchNextPage - Function to fetch next page
 *
 * @remarks
 * Triggers when:
 * - User scrolled to last visible item
 * - More pages are available (hasNextPage = true)
 * - Not currently fetching (prevents duplicates)
 *
 * @example
 * ```tsx
 * useInfiniteScrollTrigger(
 *   virtualizer.getVirtualItems(),
 *   allItems.length,
 *   hasNextPage,
 *   isFetchingNextPage,
 *   fetchNextPage
 * )
 * ```
 */
export function useInfiniteScrollTrigger(
  virtualItems: VirtualItem[],
  allItemsLength: number,
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void
) {
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse()

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= allItemsLength - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [virtualItems, allItemsLength, hasNextPage, isFetchingNextPage, fetchNextPage])
}
