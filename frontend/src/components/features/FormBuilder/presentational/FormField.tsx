import { Controller, type Control, type FieldValues } from 'react-hook-form'
import type { FieldConfig } from '../../../../types/form.types'
import { getFieldComponent } from './FieldRegistry'

interface FormFieldProps {
  field: FieldConfig
  control: Control<FieldValues>
  isVisible: boolean
}

export function FormField({ field, control, isVisible }: FormFieldProps) {
  const FieldComponent = getFieldComponent(field.type)

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`${field.colSpan ? `col-span-${field.colSpan}` : 'col-span-12'}`}
      style={{ gridColumn: `span ${field.colSpan ?? 12} / span ${field.colSpan ?? 12}` }}
    >
      <Controller
        name={field.name}
        control={control}
        defaultValue={field.defaultValue ?? ''}
        rules={{
          required: field.required ? `${field.label} is required` : false,
        }}
        render={({ field: controllerField, fieldState }) => (
          <FieldComponent
            field={field}
            value={controllerField.value}
            onChange={controllerField.onChange}
            onBlur={controllerField.onBlur}
            error={fieldState.error?.message}
            disabled={field.disabled}
            required={field.required}
          />
        )}
      />
    </div>
  )
}
