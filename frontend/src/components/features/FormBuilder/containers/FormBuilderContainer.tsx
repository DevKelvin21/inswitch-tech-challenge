import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { mockApiClient } from '../../../../services/mockApi'
import type { FormConfig } from '../../../../types/form.types'
import { defaultFormConfig } from '../config/formConfig'
import { useConditionalLogic } from '../hooks/useConditionalLogic'
import { useFormConfig } from '../hooks/useFormConfig'
import { useFormPersistence } from '../hooks/useFormPersistence'
import { FormActions } from '../presentational/FormActions'
import { FormField } from '../presentational/FormField'
import { FormPreview } from '../presentational/FormPreview'

interface FormBuilderContainerProps {
  config?: FormConfig
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

/**
 * Container component for FormBuilder feature
 * Integrates React Hook Form, conditional logic, persistence, and submission
 */
export function FormBuilderContainer({
  config = defaultFormConfig,
  onSuccess,
  onError,
}: FormBuilderContainerProps) {
  const { config: processedConfig, getAllFields } = useFormConfig(config)
  const [showPreview, setShowPreview] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Build Zod schema from field configurations
  const validationSchema = useMemo(() => {
    const schemaShape: Record<string, z.ZodType<unknown>> = {}

    getAllFields.forEach((field) => {
      if (field.validation) {
        schemaShape[field.name] = field.validation
      }
    })

    return z.object(schemaShape)
  }, [getAllFields])


  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
    defaultValues: getAllFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? ''
      return acc
    }, {} as Record<string, unknown>),
  })

  // Watch all form values for conditional logic
  const formValues = useWatch({ control })

  // Conditional visibility
  const { isFieldVisible } = useConditionalLogic(getAllFields, formValues)

  // Persistence
  const { loadFromStorage, clearStorage, getStorageInfo } = useFormPersistence(
    processedConfig.persistence!,
    formValues,
    isDirty
  )

  // Load saved data on mount
  useEffect(() => {
    if (processedConfig.persistence?.enabled) {
      const savedData = loadFromStorage()
      if (savedData) {
        reset(savedData)
      }
    }
  }, [processedConfig.persistence?.enabled, loadFromStorage, reset])

  // Form submission mutation
  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (processedConfig.submit?.endpoint) {
        return await mockApiClient.post(processedConfig.submit.endpoint, data)
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return data
    },
    onSuccess: (data) => {
      setSuccessMessage(processedConfig.submit?.successMessage ?? 'Form submitted successfully!')
      setErrorMessage(null)

      if (processedConfig.persistence?.clearOnSubmit) {
        clearStorage()
      }

      onSuccess?.(data)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000)
    },
    onError: (error: Error) => {
      setErrorMessage(processedConfig.submit?.errorMessage ?? 'Failed to submit form. Please try again.')
      setSuccessMessage(null)
      onError?.(error)

      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000)
    },
  })

  const onSubmit = (data: Record<string, unknown>) => {
    mutation.mutate(data)
  }

  const handleReset = () => {
    reset()
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleClear = () => {
    reset(
      getAllFields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue ?? ''
        return acc
      }, {} as Record<string, unknown>)
    )
    clearStorage()
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const storageInfo = getStorageInfo()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{processedConfig.title}</h2>
        {processedConfig.description && (
          <p className="mt-2 text-gray-600">{processedConfig.description}</p>
        )}
      </div>

      {/* Storage info (if data was loaded) */}
      {storageInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Draft restored from {storageInfo.ageMinutes < 1 ? 'moments' : `${storageInfo.ageMinutes} minute(s)`} ago
          </p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Field count and preview toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="text-sm text-gray-500">
            {processedConfig.styling?.showFieldCount && (
              <span>
                {getAllFields.filter((f) => isFieldVisible(f.id)).length} / {getAllFields.length} fields visible
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* Preview panel */}
        {showPreview && <FormPreview values={formValues} />}

        {/* Form fields */}
        <div
          className={`grid gap-6 ${
            processedConfig.styling?.layout === 'grid'
              ? `grid-cols-${processedConfig.styling.gridColumns ?? 12}`
              : 'grid-cols-1'
          }`}
          style={{
            gridTemplateColumns: `repeat(${processedConfig.styling?.gridColumns ?? 12}, minmax(0, 1fr))`,
          }}
        >
          {getAllFields.map((field) => (
            <FormField key={field.id} field={field} control={control} isVisible={isFieldVisible(field.id)} />
          ))}
        </div>

        {/* Form actions */}
        <FormActions
          config={processedConfig.submit!}
          isSubmitting={isSubmitting}
          onReset={handleReset}
          onClear={processedConfig.submit?.showClearButton ? handleClear : undefined}
        />
      </form>

      {/* Auto-save indicator */}
      {processedConfig.persistence?.enabled && isDirty && (
        <div className="text-xs text-gray-500 text-right">
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Auto-saving...
          </span>
        </div>
      )}
    </div>
  )
}
