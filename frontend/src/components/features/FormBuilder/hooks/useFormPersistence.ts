import { useEffect, useCallback, useRef } from 'react'
import type { FormPersistenceConfig } from '../../../../types/form.types'
import { useDebounce } from '../../../../hooks/useDebounce'

/**
 * Hook to handle form data persistence to localStorage
 * Provides auto-save functionality with debouncing
 */
export function useFormPersistence(
  config: FormPersistenceConfig,
  formValues: Record<string, unknown>,
  isDirty: boolean
) {
  const { enabled, storageKey, debounceMs = 1000, clearOnSubmit } = config
  const debouncedValues = useDebounce(formValues, debounceMs)
  const isFirstRender = useRef(true)

  /**
   * Save form data to localStorage
   */
  const saveToStorage = useCallback(
    (data: Record<string, unknown>) => {
      if (!enabled) return

      try {
        const serializedData = JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
        })
        localStorage.setItem(storageKey, serializedData)
      } catch (error) {
        console.error('Failed to save form data to localStorage:', error)
      }
    },
    [enabled, storageKey]
  )

  /**
   * Clear form data from localStorage
   */
  const clearStorage = useCallback(() => {
    if (!enabled) return

    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('Failed to clear form data from localStorage:', error)
    }
  }, [enabled, storageKey])
  
  /**
   * Load form data from localStorage
   */
  const loadFromStorage = useCallback((): Record<string, unknown> | null => {
    if (!enabled) return null

    try {
      const serializedData = localStorage.getItem(storageKey)
      if (!serializedData) return null

      const { data, timestamp } = JSON.parse(serializedData)

      // Optionally check if data is too old (e.g., 7 days)
      const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
      const age = Date.now() - new Date(timestamp).getTime()

      if (age > MAX_AGE_MS) {
        clearStorage()
        return null
      }

      return data
    } catch (error) {
      console.error('Failed to load form data from localStorage:', error)
      return null
    }
  }, [enabled, storageKey, clearStorage])



  /**
   * Get storage info (exists, timestamp, age)
   */
  const getStorageInfo = useCallback(() => {
    if (!enabled) return null

    try {
      const serializedData = localStorage.getItem(storageKey)
      if (!serializedData) return null

      const { timestamp } = JSON.parse(serializedData)
      const age = Date.now() - new Date(timestamp).getTime()

      return {
        exists: true,
        timestamp: new Date(timestamp),
        ageMs: age,
        ageMinutes: Math.floor(age / (60 * 1000)),
        ageHours: Math.floor(age / (60 * 60 * 1000)),
        ageDays: Math.floor(age / (24 * 60 * 60 * 1000)),
      }
    } catch {
      return null
    }
  }, [enabled, storageKey])

  /**
   * Auto-save when form values change (debounced)
   * Skip on first render to avoid overwriting loaded data
   */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (enabled && isDirty) {
      saveToStorage(debouncedValues)
    }
  }, [debouncedValues, isDirty, enabled, saveToStorage])

  /**
   * Clear storage on unmount if configured
   */
  useEffect(() => {
    return () => {
      if (enabled && !clearOnSubmit) {
        /* Keep data in localStorage for next session */
      }
    }
  }, [enabled, clearOnSubmit])

  return {
    saveToStorage,
    loadFromStorage,
    clearStorage,
    getStorageInfo,
  }
}
