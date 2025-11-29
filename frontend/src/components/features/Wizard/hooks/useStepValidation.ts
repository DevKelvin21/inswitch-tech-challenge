import { useCallback, useState } from 'react'
import type { WizardStep } from '../../../../types/wizard.types'
import { z } from 'zod'

/**
 * Hook to validate wizard step data
 * @param step Current step configuration
 * @param data Current step data
 * @param onValidationChange Callback when validation state changes
 * @returns Validation utilities
 */
export function useStepValidation(
  step: WizardStep | undefined,
  data: unknown,
  onValidationChange?: (errors: Record<string, string>) => void
) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

  /**
   * Validate step data against schema
   */
  const validate = useCallback(
    async (dataToValidate: unknown = data): Promise<boolean> => {
      if (!step?.validationSchema) {
        setErrors({})
        onValidationChange?.({})
        return true
      }

      setIsValidating(true)

      try {
        await step.validationSchema.parseAsync(dataToValidate)
        setErrors({})
        onValidationChange?.({})
        setIsValidating(false)
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors: Record<string, string> = {}
          const fieldErrors = error.flatten().fieldErrors as Record<string, string[] | undefined>

          Object.entries(fieldErrors).forEach(([key, messages]) => {
            validationErrors[key] = messages?.[0] ?? ''
          })

          setErrors(validationErrors)
          onValidationChange?.(validationErrors)
        }
        setIsValidating(false)
        return false
      }
    },
    [step, data, onValidationChange]
  )

  /**
   * Validate a specific field
   */
  const validateField = useCallback(
    async (fieldName: string, fieldValue: unknown): Promise<boolean> => {
      if (!step?.validationSchema) return true

      // For field-level validation, we need to validate in the context of full data
      const fullData = { ...(data as object), [fieldName]: fieldValue }

      try {
        await step.validationSchema.parseAsync(fullData)
        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
        return true
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = error.flatten().fieldErrors as Record<string, string[] | undefined>
          const fieldError = fieldErrors[fieldName]?.[0]

          if (fieldError) {
            setErrors((prev) => ({
              ...prev,
              [fieldName]: fieldError,
            }))
            return false
          }
        }
        return false
      }
    },
    [step, data]
  )

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
    onValidationChange?.({})
  }, [onValidationChange])

  /**
   * Clear error for specific field
   */
  const clearFieldError = useCallback(
    (fieldName: string) => {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        const updated = { ...newErrors }
        onValidationChange?.(updated)
        return updated
      })
    },
    [onValidationChange]
  )

  /**
   * Set custom error
   */
  const setFieldError = useCallback(
    (fieldName: string, message: string) => {
      setErrors((prev) => {
        const updated = { ...prev, [fieldName]: message }
        onValidationChange?.(updated)
        return updated
      })
    },
    [onValidationChange]
  )

  /**
   * Check if step is valid
   */
  const isValid = Object.keys(errors).length === 0

  /**
   * Check if step can be completed
   */
  const canComplete = useCallback(() => {
    // Optional steps can always be completed
    if (step?.optional) return true

    // Required steps need to be valid
    return isValid
  }, [step, isValid])

  return {
    errors,
    isValidating,
    isValid,
    canComplete,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
  }
}

/**
 * Return type of useStepValidation hook
 */
export type UseStepValidationReturn = ReturnType<typeof useStepValidation>
