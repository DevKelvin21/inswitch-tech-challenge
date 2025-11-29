import { useEffect, useMemo } from 'react'
import type {
  WizardConfig,
  WizardNavigationInfo,
} from '../../../../types/wizard.types'
import { createWizardStore } from '../../../../store/wizardStore'

/**
 * Hook to create and manage wizard state machine
 * @param config Wizard configuration
 * @returns Wizard store and navigation helpers
 */
export function useWizardMachine(config: WizardConfig) {
  // Create store instance (memoized to prevent recreating on every render)
  const useStore = useMemo(() => createWizardStore(config), [config])

  // Get store state and actions
  const store = useStore()

  // Load persisted state on mount (only once)
  useEffect(() => {
    if (config.persistence?.enabled && config.persistence.restoreOnMount) {
      store.loadPersistedState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculate navigation info
  const navigationInfo: WizardNavigationInfo = useMemo(() => {
    const currentStep = config.steps[store.currentStepIndex]
    const isFirstStep = store.currentStepIndex === 0
    const isLastStep = store.currentStepIndex === config.steps.length - 1

    // In linear mode, can only go next if current step is valid (no errors) or optional/skippable
    const canGoNext =
      (isLastStep
        ? false
        : config.navigationMode === 'non-linear'
        ? true
        : currentStep
        ? // Can go next if: already completed, OR no validation errors, OR optional/skippable
          store.completedSteps.includes(currentStep.id) ||
          !store.stepErrors[currentStep.id] ||
          Object.keys(store.stepErrors[currentStep.id] || {}).length === 0 ||
          currentStep.optional ||
          currentStep.skippable
        : false) ?? false

    const canGoPrevious = !isFirstStep && (config.allowBackNavigation ?? true)

    const canGoToStep = (stepIndex: number): boolean => {
      if (stepIndex < 0 || stepIndex >= config.steps.length) return false
      if (stepIndex === store.currentStepIndex) return true

      // Can always go back
      if (stepIndex < store.currentStepIndex) {
        return config.allowBackNavigation ?? true
      }

      // In non-linear mode, can go to any step
      if (config.navigationMode === 'non-linear') return true

      // In linear mode, can only go to next incomplete step
      return stepIndex === store.currentStepIndex + 1
    }

    const progress =
      config.steps.length > 0
        ? ((store.completedSteps.length + store.skippedSteps.length) /
            config.steps.length) *
          100
        : 0

    return {
      canGoNext,
      canGoPrevious,
      canGoToStep,
      isFirstStep,
      isLastStep,
      currentStepNumber: store.currentStepIndex + 1,
      totalSteps: config.steps.length,
      progress: Math.min(progress, 100),
    }
  }, [
    config,
    store.currentStepIndex,
    store.completedSteps,
    store.skippedSteps,
    store.stepErrors,
  ])

  // Get current step
  const currentStep = useMemo(
    () => config.steps[store.currentStepIndex],
    [config.steps, store.currentStepIndex]
  )

  // Get current step data
  const currentStepData = useMemo(
    () => (currentStep ? store.stepData[currentStep.id] : undefined),
    [currentStep, store.stepData]
  )

  // Get current step errors
  const currentStepErrors = useMemo(
    () => (currentStep ? store.stepErrors[currentStep.id] : undefined),
    [currentStep, store.stepErrors]
  )

  return {
    // Store state
    ...store,

    // Current step info
    currentStep,
    currentStepData,
    currentStepErrors,

    // Navigation info
    navigationInfo,

    // Wizard config
    config,
  }
}

/**
 * Return type of useWizardMachine hook
 */
export type UseWizardMachineReturn = ReturnType<typeof useWizardMachine>
