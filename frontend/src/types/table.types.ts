/**
 * Shared TypeScript types for Data Table feature
 */
import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'
export type ExportFormat = 'csv' | 'json'
export type SelectionMode = 'single' | 'multiple'

export interface SortConfig {
  id: string
  desc: boolean
}

export interface FilterConfig {
  id: string
  value: unknown
  type: 'text' | 'number' | 'date' | 'select'
}

export interface PaginationConfig {
  enabled: boolean
  pageSize: number
  pageSizeOptions?: number[]
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface ColumnConfig<T = unknown> {
  id: string
  header: string
  accessorKey: keyof T
  type: 'text' | 'number' | 'date' | 'boolean' | 'custom'
  sortable?: boolean
  filterable?: boolean
  width?: number
  minWidth?: number
  maxWidth?: number
  cell?: (value: unknown) => ReactNode
}

export interface TableFeatures {
  sorting: boolean | 'single' | 'multi'
  filtering: boolean
  pagination: boolean | PaginationConfig
  selection: boolean | SelectionMode
  export: boolean | ExportFormat[]
  virtualScroll: boolean
  columnResize: boolean
  columnReorder: boolean
}

export interface TableConfig<T = unknown> {
  id: string
  features: TableFeatures
  columns: ColumnConfig<T>[]
  dataSource: {
    endpoint: string
    headers?: Record<string, string>
  }
  defaultPageSize?: number
  defaultSorting?: SortConfig[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
