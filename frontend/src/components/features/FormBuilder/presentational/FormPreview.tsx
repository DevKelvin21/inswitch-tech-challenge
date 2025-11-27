import { useState } from 'react'

interface FormPreviewProps {
  values: Record<string, unknown>
  title?: string
}

export function FormPreview({ values, title = 'Form Data Preview' }: FormPreviewProps) {
  const [showJson, setShowJson] = useState(false)

  const nonEmptyValues = Object.entries(values).filter(([, value]) => {
    if (value === null || value === undefined || value === '') return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  })

  if (nonEmptyValues.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => setShowJson(!showJson)}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {showJson ? 'Show Formatted' : 'Show JSON'}
        </button>
      </div>

      {showJson ? (
        <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-auto max-h-96">
          {JSON.stringify(values, null, 2)}
        </pre>
      ) : (
        <dl className="space-y-2">
          {nonEmptyValues.map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <dt className="text-xs font-medium text-gray-500 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </dt>
              <dd className="text-sm text-gray-900 mt-1">
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
