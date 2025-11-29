import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { WizardConfig } from '../../../../types/wizard.types'
import { useWizardMachine } from '../hooks/useWizardMachine'
import { useStepValidation } from '../hooks/useStepValidation'
import {
  WizardProgress,
  WizardSteps,
  WizardNavigation,
  WizardStepContent,
} from '../presentational'
import { LoadingSkeleton } from '../../../shared/LoadingSkeleton'
import { ErrorState } from '../../../shared/ErrorState'

interface WizardContainerProps {
  config: WizardConfig
  onComplete?: (data: Record<string, unknown>) => void
  onStepChange?: (stepIndex: number) => void
}

/**
 * Wizard container component
 * Manages wizard state and orchestrates presentational components
 */
export function WizardContainer({
  config,
  onComplete,
  onStepChange,
}: WizardContainerProps) {
  const wizard = useWizardMachine(config)

  const {
    currentStep,
    currentStepData,
    currentStepErrors,
    currentStepIndex,
    stepStatus,
    isSubmitting,
    isCompleted,
    wizardErrors,
    navigationInfo,
    nextStep,
    previousStep,
    goToStep,
    skipStep,
    updateStepData,
    setStepErrors,
    completeStep,
    submitWizard,
  } = wizard

  const aggregatedData = useMemo(() => {
    return config.steps.reduce(
      (acc, step) => {
        const data = wizard.stepData[step.id]

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          Object.assign(acc, data as Record<string, unknown>)
        } else if (data !== undefined) {
          acc[step.id] = data
        }

        return acc
      },
      {} as Record<string, unknown>,
    )
  }, [config.steps, wizard.stepData])

  const isReviewStep = currentStep?.id === 'review-submit'
  const renderedStepData = isReviewStep ? aggregatedData : currentStepData

  // Validation hook for current step
  const validation = useStepValidation(
    currentStep,
    currentStepData,
    useCallback(
      (errors: Record<string, string>) => {
        if (currentStep) {
          setStepErrors(currentStep.id, errors)
        }
      },
      [currentStep, setStepErrors],
    ),
  )

  // Track last validated data to prevent infinite loops
  const lastValidatedData = useRef<{ stepId: string; data: unknown } | null>(null)

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStepIndex)
  }, [currentStepIndex, onStepChange])

  // Validate current step data when it changes
  useEffect(() => {
    if (!currentStep) return

    // Skip if we just validated this exact data
    const dataKey = JSON.stringify({ stepId: currentStep.id, data: currentStepData })
    const lastKey = JSON.stringify(lastValidatedData.current)
    if (dataKey === lastKey) return

    lastValidatedData.current = { stepId: currentStep.id, data: currentStepData }

    // Validate the data
    if (currentStep.validationSchema && currentStepData !== undefined) {
      currentStep.validationSchema
        .parseAsync(currentStepData)
        .then(() => {
          setStepErrors(currentStep.id, {})
        })
        .catch((error) => {
          if (error && 'errors' in error) {
            const zodError = error as {
              errors: Array<{ path: (string | number)[]; message: string }>
            }
            const validationErrors: Record<string, string> = {}
            zodError.errors.forEach((err) => {
              const path = err.path.join('.')
              validationErrors[path] = err.message
            })
            setStepErrors(currentStep.id, validationErrors)
          }
        })
    } else if (!currentStep.validationSchema) {
      // No validation schema - always valid
      setStepErrors(currentStep.id, {})
    }
  }, [currentStep, currentStepData, setStepErrors])

  // Handle data changes
  const handleDataChange = useCallback(
    (newData: unknown) => {
      if (currentStep) {
        updateStepData(currentStep.id, newData)
        // Validation happens automatically in the effect above
      }
    },
    [currentStep, updateStepData],
  )

  // Handle next step
  const handleNext = useCallback(async () => {
    if (!currentStep) return

    // Validate current step
    const isValid = await validation.validate()

    if (isValid) {
      completeStep(currentStep.id)
      nextStep()
    }
  }, [currentStep, validation, completeStep, nextStep])

  // Handle submission
  const handleSubmit = useCallback(async () => {
    try {
      await submitWizard()

      if (onComplete && currentStepData) {
        onComplete(isReviewStep ? aggregatedData : wizard.stepData)
      }
    } catch (error) {
      console.error('Wizard submission failed:', error)
    }
  }, [submitWizard, onComplete, wizard.stepData, currentStepData, isReviewStep, aggregatedData])

  // Handle step navigation
  const handleStepClick = useCallback(
    (stepIndex: number) => {
      goToStep(stepIndex)
    },
    [goToStep],
  )

  // Show completion message
  if (isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {config.submit?.successMessage || 'Wizard completed successfully!'}
          </h3>
          <p className="text-sm text-gray-500">Your information has been submitted.</p>
        </div>
      </div>
    )
  }

  // Show loading state while submitting
  if (isSubmitting) {
    return <LoadingSkeleton variant="form" rows={5} />
  }

  // Show wizard errors
  if (wizardErrors.length > 0) {
    return <ErrorState message={wizardErrors.join(', ')} onRetry={handleSubmit} />
  }

  // Main wizard UI
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Wizard header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
          {config.description && (
            <p className="mt-2 text-gray-600">{config.description}</p>
          )}
        </div>

        {/* Progress bar */}
        <WizardProgress
          currentStepIndex={currentStepIndex}
          totalSteps={config.steps.length}
          progress={navigationInfo.progress}
          config={config}
        />

        {/* Steps navigation (for horizontal layout) */}
        {config.styling?.orientation !== 'vertical' && (
          <WizardSteps
            steps={config.steps}
            currentStepIndex={currentStepIndex}
            stepStatus={stepStatus}
            config={config}
            onStepClick={handleStepClick}
            canGoToStep={navigationInfo.canGoToStep}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Steps navigation (for vertical layout) */}
          {config.styling?.orientation === 'vertical' && (
            <div className="lg:col-span-3">
              <WizardSteps
                steps={config.steps}
                currentStepIndex={currentStepIndex}
                stepStatus={stepStatus}
                config={config}
                onStepClick={handleStepClick}
                canGoToStep={navigationInfo.canGoToStep}
              />
            </div>
          )}

          {/* Step content */}
          <div
            className={
              config.styling?.orientation === 'vertical'
                ? 'lg:col-span-9'
                : 'lg:col-span-12'
            }
          >
            {currentStep && (
              <WizardStepContent
                step={currentStep}
                data={renderedStepData}
                errors={currentStepErrors}
                onDataChange={handleDataChange}
              />
            )}

            {/* Navigation buttons */}
            <WizardNavigation
              navigationInfo={navigationInfo}
              config={config}
              isSubmitting={isSubmitting}
              onPrevious={previousStep}
              onNext={handleNext}
              onSkip={skipStep}
              onSubmit={handleSubmit}
              currentStepSkippable={currentStep?.skippable ?? false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
