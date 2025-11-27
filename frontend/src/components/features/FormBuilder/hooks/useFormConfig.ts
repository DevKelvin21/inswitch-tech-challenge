import { useMemo } from 'react'
import type { FormConfig } from '../../../../types/form.types'

/**
 * Hook to manage and process form configuration
 * Validates and normalizes form config for use in components
 */
export function useFormConfig(config: FormConfig) {
  const processedConfig = useMemo(() => {
    const processed: FormConfig = {
      ...config,
      styling: {
        layout: 'vertical',
        spacing: 'normal',
        labelPosition: 'top',
        showRequiredIndicator: true,
        showFieldCount: false,
        gridColumns: 12,
        ...config.styling,
      },
      submit: {
        submitButtonText: 'Submit',
        resetButtonText: 'Reset',
        showResetButton: false,
        showClearButton: false,
        clearButtonText: 'Clear',
        successMessage: 'Form submitted successfully!',
        errorMessage: 'Failed to submit form. Please try again.',
        method: 'POST',
        ...config.submit,
      },
      persistence: {
        enabled: false,
        storageKey: config.id,
        debounceMs: 1000,
        clearOnSubmit: false,
        ...config.persistence,
      },
    }

    if (processed.fields) {
      processed.fields = processed.fields.map((field) => ({
        colSpan: 12,
        required: false,
        disabled: false,
        readOnly: false,
        ...field,
      }))
    }

    if (processed.sections) {
      processed.sections = processed.sections.map((section) => ({
        ...section,
        collapsible: section.collapsible ?? false,
        defaultCollapsed: section.defaultCollapsed ?? false,
        fields: section.fields.map((field) => ({
          colSpan: 12,
          required: false,
          disabled: false,
          readOnly: false,
          ...field,
        })),
      }))
    }

    return processed
  }, [config])

  /**
   * Get all fields from the config (flat or sectioned)
   */
  const getAllFields = useMemo(() => {
    if (processedConfig.fields) {
      return processedConfig.fields
    }
    if (processedConfig.sections) {
      return processedConfig.sections.flatMap((section) => section.fields)
    }
    return []
  }, [processedConfig])

  /**
   * Get field by ID
   */
  const getFieldById = useMemo(() => {
    const fieldsMap = new Map(getAllFields.map((field) => [field.id, field]))
    return (id: string) => fieldsMap.get(id)
  }, [getAllFields])

  /**
   * Get required field IDs
   */
  const requiredFields = useMemo(() => {
    return getAllFields.filter((field) => field.required).map((field) => field.id)
  }, [getAllFields])

  return {
    config: processedConfig,
    getAllFields,
    getFieldById,
    requiredFields,
  }
}
