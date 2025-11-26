import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onNextPage: () => void
  onPreviousPage: () => void
  pageSizeOptions: number[]
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
  onNextPage,
  onPreviousPage,
  pageSizeOptions,
}: TablePaginationProps) {
  const startRow = currentPage * pageSize + 1
  const endRow = Math.min((currentPage + 1) * pageSize, totalRows)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(0)

      if (currentPage > 2) {
        pages.push('...')
      }

      const start = Math.max(1, currentPage - 1)
      const end = Math.min(totalPages - 2, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 3) {
        pages.push('...')
      }

      if (totalPages > 1) {
        pages.push(totalPages - 1)
      }
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Showing <span className="font-medium">{startRow}</span> to{' '}
          <span className="font-medium">{endRow}</span> of{' '}
          <span className="font-medium">{totalRows}</span> results
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 py-1 px-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 0}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex gap-1">
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {(page as number) + 1}
              </button>
            )
          )}
        </div>

        <span className="sm:hidden text-sm text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages - 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
