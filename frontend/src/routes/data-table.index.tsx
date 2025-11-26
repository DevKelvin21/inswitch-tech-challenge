import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { DataTableContainer } from '../components/features/DataTable/containers/DataTableContainer'
const dataTableSearchSchema = z.object({
  page: z.number().int().min(0).catch(0),
  pageSize: z.number().int().min(5).max(100).catch(10),
  sort: z.string().optional().catch(undefined),
  filters: z.string().optional().catch(undefined),
  search: z.string().optional().catch(undefined),
})

export type DataTableSearch = z.infer<typeof dataTableSearchSchema>

export const Route = createFileRoute('/data-table/')({
  validateSearch: (search) => dataTableSearchSchema.parse(search),
  component: DataTablePage,
})

function DataTablePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Data Table</h2>
        <p className="mt-2 text-gray-600">
          TanStack Table with multi-column sorting, filtering, pagination, selection, column resizing, and export
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-800">
            TanStack Table
          </span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
            Multi-Sort
          </span>
          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-0.5 text-xs font-medium text-purple-800">
            Column Filters
          </span>
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-xs font-medium text-yellow-800">
            Pagination
          </span>
          <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-0.5 text-xs font-medium text-pink-800">
            Row Selection
          </span>
          <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-xs font-medium text-orange-800">
            CSV/JSON Export
          </span>
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-800">
            Column Resize
          </span>
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-xs font-medium text-yellow-800">
            Config-Driven
          </span>
          <span className="inline-flex items-center rounded-full bg-teal-100 px-3 py-0.5 text-xs font-medium text-teal-800">
            URL State Sync
          </span>
        </div>
      </div>

      <DataTableContainer />
    </div>
  )
}
