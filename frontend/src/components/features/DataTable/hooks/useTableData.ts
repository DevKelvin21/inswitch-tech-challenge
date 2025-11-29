import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../../services/apiClient'
import type { TableConfig } from '../config/tableConfig'

export function useTableData<T>(
  config: TableConfig<T>,
  pagination: { pageIndex: number; pageSize: number },
  sorting: Array<{ id: string; desc: boolean }>,
  filters: Record<string, unknown>,
  globalFilter: string,
) {
  return useQuery({
    queryKey: ['table-data', config.id, pagination, sorting, filters, globalFilter],
    queryFn: async () => {
      const params: Record<string, unknown> = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }

      if (sorting.length > 0) {
        params.sort = sorting
          .map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`)
          .join(',')
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params[key] = value
        }
      })

      if (globalFilter) {
        params.search = globalFilter
      }

      const response = await apiClient.get<T>(config.dataSource.endpoint, params)

      return {
        data: response.data,
        totalCount: response.meta.total,
        pageCount: response.meta.totalPages,
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
