import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/wizard')({
  component: WizardPage,
})

function WizardPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Multi-Step Wizard</h2>
        <p className="mt-2 text-gray-600">
          State machine-driven wizard with progress persistence and flexible navigation
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Wizard implementation coming soon...</p>
      </div>
    </div>
  )
}
