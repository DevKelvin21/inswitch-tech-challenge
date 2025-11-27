import type { FieldType, FieldComponentProps } from '../../../../types/form.types'
import { TextInput } from './fields/TextInput'
import { TextareaInput } from './fields/TextareaInput'
import { SelectInput } from './fields/SelectInput'
import { CheckboxInput } from './fields/CheckboxInput'
import { RadioInput } from './fields/RadioInput'
import { MultiSelectInput } from './fields/MultiSelectInput'

/**
 * Field registry mapping field types to components
 * Enables dynamic field rendering based on configuration
 */
const fieldRegistry: Record<FieldType, React.ComponentType<FieldComponentProps>> = {
  text: TextInput,
  email: TextInput,
  password: TextInput,
  number: TextInput,
  tel: TextInput,
  url: TextInput,
  date: TextInput,
  time: TextInput,
  'datetime-local': TextInput,
  textarea: TextareaInput,
  select: SelectInput,
  multiselect: MultiSelectInput,
  checkbox: CheckboxInput,
  radio: RadioInput,
}

/**
 * Get the appropriate field component for a given field type
 */
export function getFieldComponent(type: FieldType): React.ComponentType<FieldComponentProps> {
  return fieldRegistry[type] ?? TextInput
}

/**
 * Register a custom field component for a field type
 * Allows extending the form builder with custom field types
 */
export function registerFieldComponent(
  type: FieldType,
  component: React.ComponentType<FieldComponentProps>
): void {
  fieldRegistry[type] = component
}

/**
 * Get all registered field types
 */
export function getRegisteredFieldTypes(): FieldType[] {
  return Object.keys(fieldRegistry) as FieldType[]
}
