import axios, { type AxiosInstance } from 'axios'
import type { PaginatedResponse, SortConfig, FilterConfig } from '../types/table.types'

/**
 * MockAPI Client for data fetching
 * Handles CRUD operations and client-side data manipulation
 * since MockAPI has limited server-side capabilities
 */
export class MockApiClient {
  private client: AxiosInstance

  constructor(baseURL?: string, headers?: Record<string, string>) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  }

  /**
   * Fetch all records from an endpoint
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T[]> {
    const response = await this.client.get<T[]>(endpoint, { params })
    return response.data
  }

  /**
   * Fetch a single record by ID
   */
  async getById<T>(endpoint: string, id: string): Promise<T> {
    const response = await this.client.get<T>(`${endpoint}/${id}`)
    return response.data
  }

  /**
   * Create a new record
   */
  async post<T>(endpoint: string, data: Partial<T>): Promise<T> {
    const response = await this.client.post<T>(endpoint, data)
    return response.data
  }

  /**
   * Update a record by ID
   */
  async put<T>(endpoint: string, id: string, data: Partial<T>): Promise<T> {
    const response = await this.client.put<T>(`${endpoint}/${id}`, data)
    return response.data
  }

  /**
   * Delete a record by ID
   */
  async delete(endpoint: string, id: string): Promise<void> {
    await this.client.delete(`${endpoint}/${id}`)
  }

  /**
   * Client-side pagination helper
   * MockAPI has limited pagination support, so we do it client-side
   */
  paginateData<T>(data: T[], page: number, pageSize: number): PaginatedResponse<T> {
    const start = page * pageSize
    const end = start + pageSize
    const paginatedData = data.slice(start, end)

    return {
      data: paginatedData,
      total: data.length,
      page,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize),
    }
  }

  /**
   * Client-side sorting helper
   * Supports multi-column sorting
   */
  sortData<T>(data: T[], sortConfig: SortConfig[]): T[] {
    if (sortConfig.length === 0) return data

    return [...data].sort((a, b) => {
      for (const sort of sortConfig) {
        const aValue = a[sort.id as keyof T]
        const bValue = b[sort.id as keyof T]

        if (aValue == null && bValue == null) continue
        if (aValue == null) return sort.desc ? -1 : 1
        if (bValue == null) return sort.desc ? 1 : -1

        let comparison = 0
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue)
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime()
        } else {
          comparison = String(aValue).localeCompare(String(bValue))
        }

        if (comparison !== 0) {
          return sort.desc ? -comparison : comparison
        }
      }
      return 0
    })
  }

  /**
   * Client-side filtering helper
   * Supports text, number, and date filters
   */
  filterData<T>(data: T[], filters: FilterConfig[]): T[] {
    if (filters.length === 0) return data

    return data.filter((row) => {
      return filters.every((filter) => {
        const value = row[filter.id as keyof T]
        const filterValue = filter.value

        if (filterValue == null || filterValue === '') return true

        switch (filter.type) {
          case 'text':
            return String(value)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase())

          case 'number':
            return Number(value) === Number(filterValue)

          case 'date':
            return new Date(value as string).toDateString() === new Date(filterValue as string).toDateString()

          case 'select':
            return value === filterValue

          default:
            return true
        }
      })
    })
  }

  /**
   * Search across multiple fields
   */
  searchData<T>(data: T[], searchTerm: string, searchFields: (keyof T)[]): T[] {
    if (!searchTerm) return data

    const lowerSearchTerm = searchTerm.toLowerCase()

    return data.filter((row) => {
      return searchFields.some((field) => {
        const value = row[field]
        return String(value).toLowerCase().includes(lowerSearchTerm)
      })
    })
  }
}

/**
 * Default client instance
 */
export const mockApiClient = new MockApiClient()
