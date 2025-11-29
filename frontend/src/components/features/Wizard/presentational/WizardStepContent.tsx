import React from 'react'
import type { WizardStep, WizardStepComponentProps } from '../../../../types/wizard.types'

interface WizardStepContentProps {
  step: WizardStep
  data: unknown
  onDataChange: (data: unknown) => void
  errors?: Record<string, string>
}

export const WizardStepContent: React.FC<WizardStepContentProps> = ({
  step,
  data,
  onDataChange,
  errors,
}) => {
  if (!step.component) {
    return (
      <div className="text-center text-red-500">
        Error: No component configured for step "{step.id}".
      </div>
    )
  }

  const StepComponent = step.component as React.ComponentType<WizardStepComponentProps>

  return (
    <StepComponent
      step={step}
      data={data}
      onDataChange={onDataChange}
      errors={errors}
    />
  )
}