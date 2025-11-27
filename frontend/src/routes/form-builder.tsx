import { createFileRoute } from '@tanstack/react-router'
import { FormBuilderContainer } from '../components/features/FormBuilder/containers/FormBuilderContainer'
import { defaultFormConfig } from '../components/features/FormBuilder/config/formConfig'

export const Route = createFileRoute('/form-builder')({
  component: FormBuilderPage,
})

function FormBuilderPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <FormBuilderContainer config={defaultFormConfig} />
    </div>
  )
}
