import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  type SortingState,
  type ColumnFiltersState,
  type ColumnSizingState,
  type PaginationState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { useTableData } from '../hooks/useTableData'
import { useTableColumns } from '../hooks/useTableColumns'
import { useTableExport } from '../hooks/useTableExport'
import { TableWithTanStack } from '../presentational/TableWithTanStack'
import { TableToolbar } from '../presentational/TableToolbar'
import { TablePagination } from '../presentational/TablePagination'
import { defaultTableConfig, type User } from '../config/tableConfig'
import type { TableConfig } from '../../../../types/table.types'
import type { DataTableSearch } from '../../../../routes/data-table.index'

interface DataTableContainerProps {
  config?: TableConfig<User>
}

/**
 * Container component for Data Table feature
 * Uses TanStack Table and syncs state with URL search params
 */
export function DataTableContainer({ config = defaultTableConfig }: DataTableContainerProps) {
  const navigate = useNavigate({ from: '/data-table' })
  const searchParams = useSearch({ from: '/data-table/' }) as DataTableSearch

  const { data, isLoading, isError, error } = useTableData<User>(
    config.dataSource.endpoint
  )
  const parseSortingFromURL = (sortString?: string): SortingState => {
    if (!sortString) return config.defaultSorting?.map((s) => ({ id: s.id, desc: s.desc })) ?? []
    try {
      return JSON.parse(sortString)
    } catch {
      return []
    }
  }

  const parseFiltersFromURL = (filtersString?: string): ColumnFiltersState => {
    if (!filtersString) return []
    try {
      return JSON.parse(filtersString)
    } catch {
      return []
    }
  }
  const [sorting, setSorting] = useState<SortingState>(
    parseSortingFromURL(searchParams.sort)
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    parseFiltersFromURL(searchParams.filters)
  )
  const [globalFilter, setGlobalFilter] = useState(searchParams.search ?? '')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: searchParams.page ?? 0,
    pageSize: searchParams.pageSize ?? config.defaultPageSize ?? 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
  useEffect(() => {
    const newSearch: Partial<DataTableSearch> = {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }

    if (sorting.length > 0) {
      newSearch.sort = JSON.stringify(sorting)
    }

    if (columnFilters.length > 0) {
      newSearch.filters = JSON.stringify(columnFilters)
    }

    if (globalFilter) {
      newSearch.search = globalFilter
    }

    navigate({
      search: (prev) => ({ ...prev, ...newSearch }),
      replace: true,
    })
  }, [pagination, sorting, columnFilters, globalFilter, navigate])
  const columns = useTableColumns(
    config.columns,
    config.features.selection !== false
  )

  const { exportData } = useTableExport(data, config.columns)
  const handleClearFilters = () => {
    setColumnFilters([])
    setGlobalFilter('')
  }

  const handleClearSorting = () => {
    setSorting([])
  }

  const handlePageChange = (pageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex }))
  }

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ pageIndex: 0, pageSize })
  }

  const handleNextPage = () => {
    setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
  }

  const handlePreviousPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1),
    }))
  }
  const selectedCount = Object.keys(rowSelection).length
  const totalPages = Math.ceil(data.length / pagination.pageSize)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }
  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        onClearFilters={handleClearFilters}
        onClearSorting={handleClearSorting}
        onExport={exportData}
        selectedCount={selectedCount}
        totalCount={data.length}
        exportFormats={
          Array.isArray(config.features.export) ? config.features.export : []
        }
        hasActiveFilters={columnFilters.length > 0 || globalFilter.length > 0}
        hasActiveSorting={sorting.length > 0}
      />

      <TableWithTanStack
        data={data}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        pagination={pagination}
        onPaginationChange={setPagination}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        columnSizing={columnSizing}
        onColumnSizingChange={setColumnSizing}
        features={config.features}
      />

      {config.features.pagination && (
        <TablePagination
          currentPage={pagination.pageIndex}
          totalPages={totalPages}
          pageSize={pagination.pageSize}
          totalRows={data.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          pageSizeOptions={
            typeof config.features.pagination === 'object'
              ? config.features.pagination.pageSizeOptions || [10, 25, 50, 100]
              : [10, 25, 50, 100]
          }
        />
      )}
    </div>
  )
}
