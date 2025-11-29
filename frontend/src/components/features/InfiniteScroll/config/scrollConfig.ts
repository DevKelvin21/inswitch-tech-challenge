import type { InfiniteScrollConfig, ScrollItem } from '../../../../types/infiniteScroll.types'

/**
 * Product item interface
 *
 * @description Extends ScrollItem base interface with product-specific properties.
 * Used as the data model for the products infinite scroll demonstration.
 */
export interface Product extends ScrollItem {
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  inStock: boolean
  createdAt: string
}

/**
 * Default infinite scroll configuration for products
 *
 * @description Configuration object demonstrating infinite scroll features
 * with product catalog data. Includes search, category/availability filters,
 * and optimized virtualization settings.
 */
export const defaultScrollConfig: InfiniteScrollConfig<Product> = {
  id: 'products-scroll',
  title: 'Products Catalog',
  description: 'Browse our extensive product catalog with infinite scroll',

  dataSource: {
    endpoint: 'https://6926097d26e7e41498f92830.mockapi.io/api/v1/products',
    headers: {
      'Content-Type': 'application/json',
    },
  },

  pageSize: 20,

  enableSearch: true,
  searchPlaceholder: 'Search products...',
  searchDebounce: 300,

  filters: [
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'All Categories',
      options: [
        { label: 'All Categories', value: '' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Books', value: 'books' },
        { label: 'Home & Garden', value: 'home' },
        { label: 'Sports', value: 'sports' },
      ],
    },
    {
      id: 'inStock',
      label: 'Availability',
      type: 'select',
      placeholder: 'All',
      options: [
        { label: 'All', value: '' },
        { label: 'In Stock', value: 'true' },
        { label: 'Out of Stock', value: 'false' },
      ],
    },
  ],

  virtualization: {
    enabled: true,
    estimateSize: 120, // Estimated height per item in pixels
    overscan: 5, // Render 5 items outside viewport for smoother scrolling
  },

  emptyMessage: 'No products found. Try adjusting your search or filters.',
  loadingMessage: 'Loading products...',
}
