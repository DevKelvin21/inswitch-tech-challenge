import type { z } from 'zod'

/**
 * Field types supported by the form builder
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime-local'

/**
 * Conditional logic operators
 */
export type ConditionalOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty'

/**
 * Conditional rule for field visibility
 */
export interface ConditionalRule {
  /** Field ID to watch */
  field: string
  /** Operator to apply */
  operator: ConditionalOperator
  /** Value to compare against */
  value?: unknown
  /** Logical operator when combining multiple rules */
  logic?: 'and' | 'or'
}

/**
 * Select/Radio option
 */
export interface FieldOption {
  label: string
  value: string | number
  disabled?: boolean
}

/**
 * Array field configuration for dynamic fields
 */
export interface ArrayFieldConfig {
  /** Minimum number of items */
  min?: number
  /** Maximum number of items */
  max?: number
  /** Default number of items */
  defaultCount?: number
  /** Label for add button */
  addButtonLabel?: string
  /** Label for remove button */
  removeButtonLabel?: string
  /** Fields to render for each array item */
  fields: FieldConfig[]
}

/**
 * Individual field configuration
 */
export interface FieldConfig {
  /** Unique field identifier */
  id: string
  /** Field name for form submission */
  name: string
  /** Display label */
  label: string
  /** Field type */
  type: FieldType
  /** Placeholder text */
  placeholder?: string
  /** Help text shown below field */
  helpText?: string
  /** Default value */
  defaultValue?: unknown
  /** Is field required? */
  required?: boolean
  /** Is field disabled? */
  disabled?: boolean
  /** Is field read-only? */
  readOnly?: boolean
  /** Options for select/radio/checkbox fields */
  options?: FieldOption[]
  /** Array field configuration */
  arrayConfig?: ArrayFieldConfig
  /** Conditional visibility rules */
  conditional?: {
    /** Show field when any/all rules match */
    mode: 'any' | 'all'
    /** Rules to evaluate */
    rules: ConditionalRule[]
  }
  /** Validation schema (Zod) */
  validation?: z.ZodType<unknown>
  /** Additional HTML attributes */
  attributes?: Record<string, unknown>
  /** CSS classes to apply */
  className?: string
  /** Grid column span (1-12) */
  colSpan?: number
}

/**
 * Form section/group configuration
 */
export interface FormSection {
  /** Section ID */
  id: string
  /** Section title */
  title: string
  /** Section description */
  description?: string
  /** Fields in this section */
  fields: FieldConfig[]
  /** Is section collapsible? */
  collapsible?: boolean
  /** Is section collapsed by default? */
  defaultCollapsed?: boolean
}

/**
 * Form submission configuration
 */
export interface FormSubmitConfig {
  /** Submit button text */
  submitButtonText?: string
  /** Reset button text */
  resetButtonText?: string
  /** Show reset button? */
  showResetButton?: boolean
  /** Show clear button? */
  showClearButton?: boolean
  /** Clear button text */
  clearButtonText?: string
  /** Endpoint to submit form data */
  endpoint?: string
  /** HTTP method for submission */
  method?: 'POST' | 'PUT' | 'PATCH'
  /** Success message */
  successMessage?: string
  /** Error message */
  errorMessage?: string
  /** Redirect URL after successful submission */
  redirectUrl?: string
}

/**
 * Form persistence configuration
 */
export interface FormPersistenceConfig {
  /** Enable auto-save to localStorage */
  enabled: boolean
  /** Storage key for localStorage */
  storageKey: string
  /** Debounce delay in ms for auto-save */
  debounceMs?: number
  /** Clear storage on successful submit? */
  clearOnSubmit?: boolean
}

/**
 * Form styling configuration
 */
export interface FormStylingConfig {
  /** Layout mode */
  layout?: 'vertical' | 'horizontal' | 'grid'
  /** Grid columns (for grid layout) */
  gridColumns?: number
  /** Field spacing */
  spacing?: 'compact' | 'normal' | 'relaxed'
  /** Label position */
  labelPosition?: 'top' | 'left' | 'inline'
  /** Show required indicator? */
  showRequiredIndicator?: boolean
  /** Show field count? */
  showFieldCount?: boolean
}

/**
 * Main form configuration
 */
export interface FormConfig {
  /** Unique form identifier */
  id: string
  /** Form title */
  title: string
  /** Form description */
  description?: string
  /** Form fields (flat structure) */
  fields?: FieldConfig[]
  /** Form sections (grouped structure) */
  sections?: FormSection[]
  /** Submit configuration */
  submit?: FormSubmitConfig
  /** Persistence configuration */
  persistence?: FormPersistenceConfig
  /** Styling configuration */
  styling?: FormStylingConfig
  /** Overall form validation schema */
  validationSchema?: z.ZodType<unknown>
}

/**
 * Form state for tracking
 */
export interface FormState {
  /** Is form dirty (has unsaved changes)? */
  isDirty: boolean
  /** Is form valid? */
  isValid: boolean
  /** Is form submitting? */
  isSubmitting: boolean
  /** Form errors */
  errors: Record<string, string>
  /** Form values */
  values: Record<string, unknown>
  /** Touched fields */
  touchedFields: Set<string>
}

/**
 * Field registry entry
 */
export interface FieldRegistryEntry {
  /** Component to render */
  component: React.ComponentType<FieldComponentProps>
  /** Default props */
  defaultProps?: Partial<FieldComponentProps>
}

/**
 * Props passed to field components
 */
export interface FieldComponentProps {
  /** Field configuration */
  field: FieldConfig
  /** Current field value */
  value?: unknown
  /** Change handler */
  onChange: (value: unknown) => void
  /** Blur handler */
  onBlur?: () => void
  /** Error message */
  error?: string
  /** Is field disabled? */
  disabled?: boolean
  /** Is field required? */
  required?: boolean
}
