interface EmptyStateProps {
  message?: string
}

/**
 * Empty state component for when no results are found
 *
 * @description Pure presentational component that displays a centered message
 * with an icon when the filtered dataset is empty. Provides user feedback
 * with actionable suggestions.
 */
export function EmptyState({ message = 'Try adjusting your search or filters.' }: EmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 2 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  )
}
