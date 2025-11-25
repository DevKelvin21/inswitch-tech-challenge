import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/form-builder')({
  component: FormBuilderPage,
})

function FormBuilderPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dynamic Form Builder</h2>
        <p className="mt-2 text-gray-600">
          Config-driven forms with conditional logic, validation, and auto-save
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Form builder implementation coming soon...</p>
      </div>
    </div>
  )
}
