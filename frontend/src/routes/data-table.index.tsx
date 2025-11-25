import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/data-table/')({
  component: DataTablePage,
})

function DataTablePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Data Table</h2>
        <p className="mt-2 text-gray-600">
          Configuration-driven table with sorting, filtering, pagination, export, and virtualization
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Data table implementation coming soon...</p>
      </div>
    </div>
  )
}
