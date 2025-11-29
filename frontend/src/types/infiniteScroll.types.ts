/**
 * Item to be displayed in the infinite scroll list
 */
export interface ScrollItem {
  id: string
  [key: string]: unknown
}

/**
 * Filter configuration
 */
export interface ScrollFilter {
  id: string
  label: string
  type: 'select' | 'multiselect' | 'text'
  options?: Array<{ label: string; value: string }>
  placeholder?: string
}

/**
 * Infinite scroll configuration
 */
export interface InfiniteScrollConfig<T extends ScrollItem = ScrollItem> {
  /** Unique identifier */
  id: string
  /** Title for the scroll list */
  title: string
  /** Description */
  description?: string
  /** Data source endpoint */
  dataSource: {
    endpoint: string
    headers?: Record<string, string>
  }
  /** Items per page */
  pageSize: number
  /** Enable search? */
  enableSearch: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Debounce delay for search (ms) */
  searchDebounce?: number
  /** Available filters */
  filters?: ScrollFilter[]
  /** Virtual scroll configuration */
  virtualization: {
    /** Enable virtual scrolling */
    enabled: boolean
    /** Estimated item height in px */
    estimateSize: number
    /** Overscan count (items rendered outside viewport) */
    overscan?: number
  }
  /** Item renderer component */
  itemRenderer?: (item: T) => React.ReactNode
  /** Empty state message */
  emptyMessage?: string
  /** Loading message */
  loadingMessage?: string
}

/**
 * Filter state
 */
export interface FilterState {
  search: string
  filters: Record<string, string | string[]>
}

/**
 * Paginated response from API
 */
export interface PaginatedScrollResponse<T> {
  data: T[]
  nextCursor?: number
  hasMore: boolean
  total?: number
}
