import type { z } from 'zod'

/**
 * Navigation mode for the wizard
 */
export type NavigationMode = 'linear' | 'non-linear'

/**
 * Step validation status
 */
export type StepStatus = 'incomplete' | 'complete' | 'error' | 'skipped'

/**
 * Wizard step configuration
 */
export interface WizardStep {
  /** Unique step identifier */
  id: string
  /** Step title */
  title: string
  /** Step description */
  description?: string
  /** Icon for the step (optional) */
  icon?: string
  /** Is this step optional? */
  optional?: boolean
  /** Can this step be skipped? */
  skippable?: boolean
  /** Validation schema for step data */
  validationSchema?: z.ZodType<unknown>
  /** Fields to collect in this step */
  fields?: string[]
  /** Custom component to render for this step */
  component?: React.ComponentType<WizardStepComponentProps>
}

/**
 * Wizard configuration
 */
export interface WizardConfig {
  /** Unique wizard identifier */
  id: string
  /** Wizard title */
  title: string
  /** Wizard description */
  description?: string
  /** Navigation mode */
  navigationMode: NavigationMode
  /** Steps in the wizard */
  steps: WizardStep[]
  /** Persistence configuration */
  persistence?: WizardPersistenceConfig
  /** Submit configuration */
  submit?: WizardSubmitConfig
  /** Styling configuration */
  styling?: WizardStylingConfig
  /** Allow navigation to completed steps? */
  allowBackNavigation?: boolean
  /** Show progress bar? */
  showProgressBar?: boolean
  /** Show step numbers? */
  showStepNumbers?: boolean
}

/**
 * Wizard persistence configuration
 */
export interface WizardPersistenceConfig {
  /** Enable persistence */
  enabled: boolean
  /** Storage key */
  storageKey: string
  /** Storage type */
  storageType?: 'localStorage' | 'sessionStorage'
  /** Clear storage on submit? */
  clearOnSubmit?: boolean
  /** Restore on mount? */
  restoreOnMount?: boolean
}

/**
 * Wizard submit configuration
 */
export interface WizardSubmitConfig {
  /** Submit button text */
  submitButtonText?: string
  /** Endpoint to submit data */
  endpoint?: string
  /** HTTP method */
  method?: 'POST' | 'PUT' | 'PATCH'
  /** Success message */
  successMessage?: string
  /** Error message */
  errorMessage?: string
  /** Redirect URL after submission */
  redirectUrl?: string
  /** Callback after successful submission */
  onSuccess?: (data: unknown) => void
  /** Callback after failed submission */
  onError?: (error: Error) => void
}

/**
 * Wizard styling configuration
 */
export interface WizardStylingConfig {
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Show step icons? */
  showIcons?: boolean
  /** Show step descriptions? */
  showDescriptions?: boolean
  /** Compact mode? */
  compact?: boolean
}

/**
 * Wizard state (managed by Zustand store)
 */
export interface WizardState {
  /** Current step index */
  currentStepIndex: number
  /** Completed step IDs */
  completedSteps: string[]
  /** Skipped step IDs */
  skippedSteps: string[]
  /** Step data (keyed by step ID) */
  stepData: Record<string, unknown>
  /** Step validation errors (keyed by step ID) */
  stepErrors: Record<string, Record<string, string>>
  /** Step status (keyed by step ID) */
  stepStatus: Record<string, StepStatus>
  /** Is wizard submitting? */
  isSubmitting: boolean
  /** Overall wizard errors */
  wizardErrors: string[]
  /** Has wizard been completed? */
  isCompleted: boolean
}

/**
 * Wizard actions (managed by Zustand store)
 */
export interface WizardActions {
  /** Navigate to next step */
  nextStep: () => void
  /** Navigate to previous step */
  previousStep: () => void
  /** Go to specific step */
  goToStep: (stepIndex: number) => void
  /** Skip current step */
  skipStep: () => void
  /** Update step data */
  updateStepData: (stepId: string, data: unknown) => void
  /** Set step errors */
  setStepErrors: (stepId: string, errors: Record<string, string>) => void
  /** Mark step as complete */
  completeStep: (stepId: string) => void
  /** Mark step as incomplete */
  incompleteStep: (stepId: string) => void
  /** Reset wizard to initial state */
  resetWizard: () => void
  /** Submit wizard */
  submitWizard: () => Promise<void>
  /** Load persisted state */
  loadPersistedState: () => void
  /** Save current state */
  persistState: () => void
}

/**
 * Combined wizard store (state + actions)
 */
export type WizardStore = WizardState & WizardActions

/**
 * Props for wizard step components
 */
export interface WizardStepComponentProps {
  /** Step configuration */
  step: WizardStep
  /** Current step data */
  data: unknown
  /** Update step data */
  onDataChange: (data: unknown) => void
  /** Validation errors */
  errors?: Record<string, string>
  /** Is step being validated? */
  isValidating?: boolean
}

/**
 * Wizard navigation info
 */
export interface WizardNavigationInfo {
  /** Can navigate to next step? */
  canGoNext: boolean
  /** Can navigate to previous step? */
  canGoPrevious: boolean
  /** Can go to specific step? */
  canGoToStep: (stepIndex: number) => boolean
  /** Is first step? */
  isFirstStep: boolean
  /** Is last step? */
  isLastStep: boolean
  /** Current step number (1-indexed) */
  currentStepNumber: number
  /** Total steps */
  totalSteps: number
  /** Progress percentage */
  progress: number
}
