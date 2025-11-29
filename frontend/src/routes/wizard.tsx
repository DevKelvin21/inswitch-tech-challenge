import { createFileRoute } from '@tanstack/react-router'
import { WizardContainer } from '../components/features/Wizard/containers/WizardContainer'
import { defaultWizardConfig } from '../components/features/Wizard/config/wizardConfig'

export const Route = createFileRoute('/wizard')({
  component: WizardPage,
})

function WizardPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <WizardContainer
        config={defaultWizardConfig}
        onComplete={(data) => {
          console.log('Wizard completed with data:', data)
        }}
        onStepChange={(stepIndex) => {
          console.log('Step changed to:', stepIndex)
        }}
      />
    </div>
  )
}
