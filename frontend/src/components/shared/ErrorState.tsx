import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  error?: Error | null
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * Shared error state component for consistent error handling
 * across all features. Includes optional retry functionality.
 */
export function ErrorState({
  error,
  message,
  onRetry,
  className = ''
}: ErrorStateProps) {
  const displayMessage = message || error?.message || 'An unexpected error occurred'

  return (
    <div className={`rounded-lg bg-red-50 border border-red-200 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error Loading Data
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{displayMessage}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
