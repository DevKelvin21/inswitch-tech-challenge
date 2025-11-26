interface LoadingSkeletonProps {
  variant?: 'table' | 'list' | 'card' | 'form'
  rows?: number
  className?: string
}

/**
 * Shared loading skeleton component for consistent loading states
 * across all features. Supports multiple variants for different layouts.
 */
export function LoadingSkeleton({
  variant = 'table',
  rows = 5,
  className = ''
}: LoadingSkeletonProps) {
  if (variant === 'table') {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {/* Table toolbar skeleton */}
        <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
          <div className="h-10 bg-gray-200 rounded w-64"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Table rows */}
          <div className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="p-4">
                <div className="grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, colIndex) => (
                    <div key={colIndex} className="h-4 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'form') {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-100 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return null
}
