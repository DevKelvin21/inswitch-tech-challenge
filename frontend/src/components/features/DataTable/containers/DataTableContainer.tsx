import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { LoadingSkeleton } from '../../../shared/LoadingSkeleton'
import { ErrorState } from '../../../shared/ErrorState'
import { defaultTableConfig, type User } from '../config/tableConfig'
import type { TableConfig } from '../../../../types/table.types'
import type { DataTableSearch } from '../../../../routes/data-table.index'
import { useDebounce } from '../../../../hooks/useDebounce'

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

  const { data, isLoading, isError, error, refetch } = useTableData<User>(
    config.dataSource.endpoint
  )

  const parseSortingFromURL = useCallback((sortString?: string): SortingState => {
    if (!sortString) return config.defaultSorting?.map((s) => ({ id: s.id, desc: s.desc })) ?? []
    try {
      return JSON.parse(sortString)
    } catch {
      return []
    }
  }, [config.defaultSorting])

  const parseFiltersFromURL = useCallback((filtersString?: string): ColumnFiltersState => {
    if (!filtersString) return []
    try {
      return JSON.parse(filtersString)
    } catch {
      return []
    }
  }, [])

  const [sorting, setSorting] = useState<SortingState>(() =>
    parseSortingFromURL(searchParams.sort)
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    parseFiltersFromURL(searchParams.filters)
  )
  const [globalFilter, setGlobalFilter] = useState(searchParams.search ?? '')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: searchParams.page ?? 0,
    pageSize: searchParams.pageSize ?? config.defaultPageSize ?? 10,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})

  const debouncedGlobalFilter = useDebounce(globalFilter, 300)
  const debouncedColumnFilters = useDebounce(columnFilters, 300)

  useEffect(() => {
    const newSearch: DataTableSearch = {
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sort: sorting.length > 0 ? JSON.stringify(sorting) : undefined,
      filters: debouncedColumnFilters.length > 0 ? JSON.stringify(debouncedColumnFilters) : undefined,
      search: debouncedGlobalFilter || undefined,
    }

    navigate({
      search: newSearch,
      replace: true,
    })
  }, [pagination, sorting, debouncedColumnFilters, debouncedGlobalFilter, navigate])
  const columns = useTableColumns(
    config.columns,
    config.features.selection !== false
  )

  const { exportData } = useTableExport(data, config.columns)

  const handleClearFilters = useCallback(() => {
    setColumnFilters([])
    setGlobalFilter('')
  }, [])

  const handleClearSorting = useCallback(() => {
    setSorting([])
  }, [])

  const handlePageChange = useCallback((pageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex }))
  }, [])

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination({ pageIndex: 0, pageSize })
  }, [])

  const handleNextPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))
  }, [])

  const handlePreviousPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1),
    }))
  }, [])

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  const selectedCount = Object.keys(rowSelection).length
  const totalPages = useMemo(
    () => Math.ceil(data.length / pagination.pageSize),
    [data.length, pagination.pageSize]
  )
  if (isLoading) {
    return <LoadingSkeleton variant="table" rows={5} />
  }

  if (isError) {
    return <ErrorState error={error as Error} onRetry={handleRetry} />
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
