import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  InSwitch React Playground
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  activeProps={{
                    className: 'border-indigo-500 text-gray-900',
                  }}
                  inactiveProps={{
                    className: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/data-table"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  activeProps={{
                    className: 'border-indigo-500 text-gray-900',
                  }}
                  inactiveProps={{
                    className: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  }}
                >
                  Data Table
                </Link>
                <Link
                  to="/form-builder"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  activeProps={{
                    className: 'border-indigo-500 text-gray-900',
                  }}
                  inactiveProps={{
                    className: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  }}
                >
                  Form Builder
                </Link>
                <Link
                  to="/infinite-scroll"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  activeProps={{
                    className: 'border-indigo-500 text-gray-900',
                  }}
                  inactiveProps={{
                    className: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  }}
                >
                  Infinite Scroll
                </Link>
                <Link
                  to="/wizard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  activeProps={{
                    className: 'border-indigo-500 text-gray-900',
                  }}
                  inactiveProps={{
                    className: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  }}
                >
                  Wizard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Router Devtools - only in development */}
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
