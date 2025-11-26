import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          React Advanced Playground
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Configuration-driven components with advanced React patterns
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {/* Data Table Card */}
        <Link
          to="/data-table"
          search={{ page: 0, pageSize: 10 }}
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Advanced Data Table
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Multi-column sorting, filtering, pagination, export, and virtual scrolling with @tanstack/react-table
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                React Query
              </span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                TanStack Table
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                Virtual Scroll
              </span>
            </div>
          </div>
        </Link>

        {/* Form Builder Card */}
        <Link
          to="/form-builder"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Dynamic Form Builder
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Config-driven forms with conditional logic, validation, and auto-save using React Hook Form + Zod
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                React Hook Form
              </span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                Zod
              </span>
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                Config-Driven
              </span>
            </div>
          </div>
        </Link>

        {/* Infinite Scroll Card */}
        <Link
          to="/infinite-scroll"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Infinite Scroll with Virtualization
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Optimized infinite scrolling with virtual windowing, search, and filters using @tanstack/react-virtual
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                React Query
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                Virtual Scroll
              </span>
              <span className="inline-flex items-center rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                Performance
              </span>
            </div>
          </div>
        </Link>

        {/* Wizard Card */}
        <Link
          to="/wizard"
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Multi-Step Wizard
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              State machine-driven wizard with progress persistence, validation, and flexible navigation using Zustand
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                Zustand
              </span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                State Machine
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                Persistence
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
