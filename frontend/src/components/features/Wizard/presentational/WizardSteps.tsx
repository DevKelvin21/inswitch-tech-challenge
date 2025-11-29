import type { WizardConfig, WizardStep, StepStatus } from '../../../../types/wizard.types'

interface WizardStepsProps {
  steps: WizardStep[]
  currentStepIndex: number
  stepStatus: Record<string, StepStatus>
  config: WizardConfig
  onStepClick: (stepIndex: number) => void
  canGoToStep: (stepIndex: number) => boolean
}

/**
 * Wizard steps navigation component
 * Shows all steps with their status and allows navigation
 */
export function WizardSteps({
  steps,
  currentStepIndex,
  stepStatus,
  config,
  onStepClick,
  canGoToStep,
}: WizardStepsProps) {
  const getStepStatusColor = (
    status: StepStatus,
    isCurrentStep: boolean
  ): string => {
    if (isCurrentStep) return 'bg-indigo-600 text-white'
    if (status === 'complete') return 'bg-green-100 text-green-800 border-green-500'
    if (status === 'error') return 'bg-red-100 text-red-800 border-red-500'
    if (status === 'skipped') return 'bg-gray-100 text-gray-600'
    return 'bg-white text-gray-600 border-gray-300'
  }

  const getStepIcon = (status: StepStatus, isCurrentStep: boolean): string => {
    if (isCurrentStep) return '●'
    if (status === 'complete') return '✓'
    if (status === 'error') return '✕'
    if (status === 'skipped') return '−'
    return '○'
  }

  if (config.styling?.orientation === 'vertical') {
    return (
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCurrentStep = index === currentStepIndex
          const status = stepStatus[step.id]
          const clickable = canGoToStep(index)

          return (
            <button
              key={step.id}
              onClick={() => clickable && onStepClick(index)}
              disabled={!clickable}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                getStepStatusColor(status, isCurrentStep)
              } ${
                clickable
                  ? 'cursor-pointer hover:shadow-md'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                {config.showStepNumbers && (
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2">
                    {config.styling?.showIcons ? getStepIcon(status, isCurrentStep) : index + 1}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {step.title}
                    {step.optional && (
                      <span className="ml-2 text-xs font-normal">(Optional)</span>
                    )}
                  </div>
                  {config.styling?.showDescriptions && step.description && (
                    <p className="mt-1 text-sm opacity-90">{step.description}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  // Horizontal layout
  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, index) => {
            const isCurrentStep = index === currentStepIndex
            const status = stepStatus[step.id]
            const clickable = canGoToStep(index)
            const isLastStep = index === steps.length - 1

            return (
              <li
                key={step.id}
                className={`relative ${isLastStep ? '' : 'flex-1'}`}
              >
                <button
                  onClick={() => clickable && onStepClick(index)}
                  disabled={!clickable}
                  className={`group flex items-center ${
                    clickable ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center px-4 py-2 text-sm font-medium">
                    <span
                      className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 rounded-full transition-colors ${
                        getStepStatusColor(status, isCurrentStep)
                      }`}
                    >
                      {config.showStepNumbers ? (
                        config.styling?.showIcons ? (
                          getStepIcon(status, isCurrentStep)
                        ) : (
                          index + 1
                        )
                      ) : (
                        getStepIcon(status, isCurrentStep)
                      )}
                    </span>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        isCurrentStep
                          ? 'text-indigo-600'
                          : status === 'complete'
                            ? 'text-gray-900'
                            : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </span>
                </button>

                {!isLastStep && (
                  <div
                    className="absolute top-5 left-full h-0.5 w-full bg-gray-200"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full transition-all ${
                        status === 'complete' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                      style={{
                        width: status === 'complete' ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
