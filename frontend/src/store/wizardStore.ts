import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  WizardConfig,
  WizardState,
  WizardStore,
  StepStatus,
} from '../types/wizard.types'

/**
 * Creates a wizard store for a specific wizard configuration
 * @param config Wizard configuration
 * @returns Zustand hook for wizard state management
 */
export const createWizardStore = (config: WizardConfig) => {
  const initialState: WizardState = {
    currentStepIndex: 0,
    completedSteps: [],
    skippedSteps: [],
    stepData: {},
    stepErrors: {},
    stepStatus: config.steps.reduce(
      (acc, step) => {
        acc[step.id] = 'incomplete'
        return acc
      },
      {} as Record<string, StepStatus>
    ),
    isSubmitting: false,
    wizardErrors: [],
    isCompleted: false,
  }

  // Flag to prevent persistence during load
  let isLoadingState = false

  return create<WizardStore>()(
    immer((set, get) => ({
      ...initialState,

      nextStep: () => {
        const state = get()
        const currentStep = config.steps[state.currentStepIndex]

        // Validate current step before proceeding
        if (currentStep && !currentStep.optional) {
          const hasErrors = state.stepErrors[currentStep.id]
          const isComplete = state.completedSteps.includes(currentStep.id)

          if (!isComplete && hasErrors && Object.keys(hasErrors).length > 0) {
            return // Don't proceed if there are errors
          }
        }

        set((draft) => {
          if (draft.currentStepIndex < config.steps.length - 1) {
            draft.currentStepIndex += 1
          }
        })
      },

      previousStep: () => {
        set((draft) => {
          if (draft.currentStepIndex > 0) {
            draft.currentStepIndex -= 1
          }
        })
      },

      goToStep: (stepIndex: number) => {
        const state = get()

        // In linear mode, can only go to completed steps or next step
        if (config.navigationMode === 'linear') {
          const targetStep = config.steps[stepIndex]
          if (!targetStep) return

          // Allow going back to any previous step
          if (stepIndex < state.currentStepIndex) {
            set((draft) => {
              draft.currentStepIndex = stepIndex
            })
            return
          }

          // Can only go forward one step at a time
          if (stepIndex === state.currentStepIndex + 1) {
            get().nextStep()
            return
          }

          return
        }

        // In non-linear mode, can go to any step
        if (stepIndex >= 0 && stepIndex < config.steps.length) {
          set((draft) => {
            draft.currentStepIndex = stepIndex
          })
        }
      },

      skipStep: () => {
        const state = get()
        const currentStep = config.steps[state.currentStepIndex]

        if (currentStep && currentStep.skippable) {
          set((draft) => {
            if (!draft.skippedSteps.includes(currentStep.id)) {
              draft.skippedSteps.push(currentStep.id)
            }
            draft.stepStatus[currentStep.id] = 'skipped'
            if (draft.currentStepIndex < config.steps.length - 1) {
              draft.currentStepIndex += 1
            }
          })
        }
      },

      updateStepData: (stepId: string, data: unknown) => {
        set((draft) => {
          draft.stepData[stepId] = data
        })

        // Auto-save if persistence is enabled (but not during initial load)
        if (config.persistence?.enabled && !isLoadingState) {
          get().persistState()
        }
      },

      setStepErrors: (stepId: string, errors: Record<string, string>) => {
        set((draft) => {
          draft.stepErrors[stepId] = errors
          draft.stepStatus[stepId] =
            Object.keys(errors).length > 0 ? 'error' : 'complete'
        })
      },

      completeStep: (stepId: string) => {
        set((draft) => {
          if (!draft.completedSteps.includes(stepId)) {
            draft.completedSteps.push(stepId)
          }
          draft.stepStatus[stepId] = 'complete'
          // Remove from skipped if it was skipped
          draft.skippedSteps = draft.skippedSteps.filter((id) => id !== stepId)
        })
      },

      incompleteStep: (stepId: string) => {
        set((draft) => {
          draft.completedSteps = draft.completedSteps.filter((id) => id !== stepId)
          draft.stepStatus[stepId] = 'incomplete'
        })
      },

      resetWizard: () => {
        set(() => ({
          ...initialState,
          // Reset arrays properly
          completedSteps: [],
          skippedSteps: [],
        }))

        // Clear persisted state if enabled
        if (config.persistence?.enabled) {
          const storage =
            config.persistence.storageType === 'sessionStorage'
              ? sessionStorage
              : localStorage
          storage.removeItem(config.persistence.storageKey)
        }
      },

      submitWizard: async () => {
        const state = get()

        // Validate all required steps are completed
        const incompleteRequiredSteps = config.steps.filter(
          (step) =>
            !step.optional &&
            !state.completedSteps.includes(step.id) &&
            !state.skippedSteps.includes(step.id)
        )

        if (incompleteRequiredSteps.length > 0) {
          set((draft) => {
            draft.wizardErrors = [
              `Please complete all required steps: ${incompleteRequiredSteps.map((s) => s.title).join(', ')}`,
            ]
          })
          return
        }

        set((draft) => {
          draft.isSubmitting = true
          draft.wizardErrors = []
        })

        try {
          // Collect all step data
          const allData = config.steps.reduce(
            (acc, step) => {
              if (state.stepData[step.id]) {
                acc[step.id] = state.stepData[step.id]
              }
              return acc
            },
            {} as Record<string, unknown>
          )

          // Submit to endpoint if configured
          if (config.submit?.endpoint) {
            const response = await fetch(config.submit.endpoint, {
              method: config.submit.method || 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(allData),
            })

            if (!response.ok) {
              throw new Error('Submission failed')
            }

            const result = await response.json()

            // Call success callback if provided
            if (config.submit.onSuccess) {
              config.submit.onSuccess(result)
            }
          }

          set((draft) => {
            draft.isCompleted = true
            draft.isSubmitting = false
          })

          // Clear persistence if configured
          if (config.persistence?.enabled && config.persistence.clearOnSubmit) {
            const storage =
              config.persistence.storageType === 'sessionStorage'
                ? sessionStorage
                : localStorage
            storage.removeItem(config.persistence.storageKey)
          }
        } catch (error) {
          set((draft) => {
            draft.isSubmitting = false
            draft.wizardErrors = [
              config.submit?.errorMessage || 'Failed to submit wizard',
            ]
          })

          // Call error callback if provided
          if (config.submit?.onError && error instanceof Error) {
            config.submit.onError(error)
          }

          throw error
        }
      },

      loadPersistedState: () => {
        if (!config.persistence?.enabled || !config.persistence.restoreOnMount) {
          return
        }

        const storage =
          config.persistence.storageType === 'sessionStorage'
            ? sessionStorage
            : localStorage

        try {
          const savedState = storage.getItem(config.persistence.storageKey)
          if (savedState) {
            const parsed = JSON.parse(savedState)

            // Set flag to prevent persistence during load
            isLoadingState = true

            set((draft) => {
              draft.currentStepIndex = parsed.currentStepIndex ?? 0
              draft.completedSteps = parsed.completedSteps ?? []
              draft.skippedSteps = parsed.skippedSteps ?? []
              draft.stepData = parsed.stepData ?? {}
              draft.stepStatus = parsed.stepStatus ?? draft.stepStatus
            })

            // Reset flag after a tick to allow normal persistence
            setTimeout(() => {
              isLoadingState = false
            }, 0)
          }
        } catch (error) {
          console.error('Failed to load persisted wizard state:', error)
          isLoadingState = false
        }
      },

      persistState: () => {
        if (!config.persistence?.enabled || isLoadingState) {
          return
        }

        const state = get()
        const storage =
          config.persistence.storageType === 'sessionStorage'
            ? sessionStorage
            : localStorage

        try {
          const stateToSave = {
            currentStepIndex: state.currentStepIndex,
            completedSteps: state.completedSteps,
            skippedSteps: state.skippedSteps,
            stepData: state.stepData,
            stepStatus: state.stepStatus,
          }

          storage.setItem(
            config.persistence.storageKey,
            JSON.stringify(stateToSave)
          )
        } catch (error) {
          console.error('Failed to persist wizard state:', error)
        }
      },
    }))
  )
}
