import { useMemo, useCallback } from 'react'
import type { ConditionalRule, FieldConfig } from '../../../../types/form.types'

/**
 * Evaluates a single conditional rule against a field value
 */
function evaluateRule(rule: ConditionalRule, value: unknown): boolean {
  const { operator, value: ruleValue } = rule

  switch (operator) {
    case 'equals':
      return value === ruleValue

    case 'notEquals':
      return value !== ruleValue

    case 'contains':
      if (typeof value === 'string' && typeof ruleValue === 'string') {
        return value.toLowerCase().includes(ruleValue.toLowerCase())
      }
      if (Array.isArray(value)) {
        return value.includes(ruleValue)
      }
      return false

    case 'notContains':
      if (typeof value === 'string' && typeof ruleValue === 'string') {
        return !value.toLowerCase().includes(ruleValue.toLowerCase())
      }
      if (Array.isArray(value)) {
        return !value.includes(ruleValue)
      }
      return true

    case 'greaterThan':
      if (typeof value === 'number' && typeof ruleValue === 'number') {
        return value > ruleValue
      }
      return false

    case 'lessThan':
      if (typeof value === 'number' && typeof ruleValue === 'number') {
        return value < ruleValue
      }
      return false

    case 'greaterThanOrEqual':
      if (typeof value === 'number' && typeof ruleValue === 'number') {
        return value >= ruleValue
      }
      return false

    case 'lessThanOrEqual':
      if (typeof value === 'number' && typeof ruleValue === 'number') {
        return value <= ruleValue
      }
      return false

    case 'isEmpty':
      if (value === null || value === undefined || value === '') {
        return true
      }
      if (Array.isArray(value)) {
        return value.length === 0
      }
      return false

    case 'isNotEmpty':
      if (value === null || value === undefined || value === '') {
        return false
      }
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return true

    default:
      return false
  }
}

/**
 * Hook to evaluate conditional logic for field visibility
 * Returns a map of field IDs to their visibility status
 */
export function useConditionalLogic(fields: FieldConfig[], formValues: Record<string, unknown>) {
  const fieldVisibility = useMemo(() => {
    const visibility = new Map<string, boolean>()

    fields.forEach((field) => {
      if (!field.conditional) {
        visibility.set(field.id, true)
        return
      }

      const { mode, rules } = field.conditional

      const ruleResults = rules.map((rule) => {
        const watchedFieldValue = formValues[rule.field]
        return evaluateRule(rule, watchedFieldValue)
      })

      /* Combine results based on mode (any = OR, all = AND) */
      const isVisible = mode === 'any'
        ? ruleResults.some((result) => result)
        : ruleResults.every((result) => result)

      visibility.set(field.id, isVisible)
    })

    return visibility
  }, [fields, formValues])

  /**
   * Check if a specific field is visible
   */
  const isFieldVisible = useCallback((fieldId: string): boolean => {
    return fieldVisibility.get(fieldId) ?? true
  }, [fieldVisibility])

  /**
   * Get all visible fields
   */
  const visibleFields = useMemo(() => {
    return fields.filter((field) => isFieldVisible(field.id))
  }, [fields, isFieldVisible])

  /**
   * Get all hidden fields
   */
  const hiddenFields = useMemo(() => {
    return fields.filter((field) => !isFieldVisible(field.id))
  }, [fields, isFieldVisible])

  /**
   * Get count of visible fields
   */
  const visibleFieldCount = visibleFields.length

  return {
    isFieldVisible,
    visibleFields,
    hiddenFields,
    visibleFieldCount,
    fieldVisibility,
  }
}
