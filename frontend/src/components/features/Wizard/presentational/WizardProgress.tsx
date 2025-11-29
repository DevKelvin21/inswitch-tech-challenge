import type { WizardConfig } from '../../../../types/wizard.types'

interface WizardProgressProps {
  currentStepIndex: number
  totalSteps: number
  progress: number
  config: WizardConfig
}

/**
 * Wizard progress bar component
 * Shows overall completion progress
 */
export function WizardProgress({
  currentStepIndex,
  totalSteps,
  progress,
  config,
}: WizardProgressProps) {
  if (!config.showProgressBar) return null

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStepIndex + 1} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
