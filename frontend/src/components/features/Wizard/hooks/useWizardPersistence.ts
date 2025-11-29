import { useEffect, useCallback } from 'react'
import type { WizardPersistenceConfig } from '../../../../types/wizard.types'

/**
 * Hook to handle wizard state persistence
 * @param config Persistence configuration
 * @param state State to persist
 * @param onRestore Callback when state is restored
 * @returns Persistence utilities
 */
export function useWizardPersistence<T>(
  config: WizardPersistenceConfig | undefined,
  state: T,
  onRestore?: (restored: Partial<T>) => void
) {
  const storage =
    config?.storageType === 'sessionStorage' ? sessionStorage : localStorage

  /**
   * Save state to storage
   */
  const save = useCallback(() => {
    if (!config?.enabled || !config.storageKey) return

    try {
      storage.setItem(config.storageKey, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save wizard state:', error)
    }
  }, [config, state, storage])

  /**
   * Load state from storage
   */
  const load = useCallback((): Partial<T> | null => {
    if (!config?.enabled || !config.storageKey) return null

    try {
      const saved = storage.getItem(config.storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<T>
        return parsed
      }
    } catch (error) {
      console.error('Failed to load wizard state:', error)
    }

    return null
  }, [config, storage])

  /**
   * Clear persisted state
   */
  const clear = useCallback(() => {
    if (!config?.enabled || !config.storageKey) return

    try {
      storage.removeItem(config.storageKey)
    } catch (error) {
      console.error('Failed to clear wizard state:', error)
    }
  }, [config, storage])

  /**
   * Restore state on mount if enabled
   */
  useEffect(() => {
    if (config?.enabled && config.restoreOnMount) {
      const restored = load()
      if (restored && onRestore) {
        onRestore(restored)
      }
    }
  }, [config, load, onRestore])

  /**
   * Auto-save on state changes
   */
  useEffect(() => {
    if (config?.enabled) {
      save()
    }
  }, [state, config, save])

  return {
    save,
    load,
    clear,
  }
}

/**
 * Return type of useWizardPersistence hook
 */
export type UseWizardPersistenceReturn = ReturnType<typeof useWizardPersistence>
