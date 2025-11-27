import type { FieldComponentProps } from '../../../../../types/form.types'

/**
 * Checkbox input component
 */
export function CheckboxInput({ field, value, onChange, onBlur, error, disabled, required }: FieldComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  return (
    <div className={field.className}>
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            id={field.id}
            name={field.name}
            type="checkbox"
            checked={(value as boolean) ?? false}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled || field.disabled}
            required={required}
            className={`h-4 w-4 rounded ${
              error
                ? 'border-red-300 text-red-600 focus:ring-red-500'
                : 'border-gray-300 text-indigo-600 focus:ring-indigo-500'
            }`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${field.id}-error` : field.helpText ? `${field.id}-help` : undefined}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={field.id} className="font-medium text-gray-700">
            {field.label}
            {required && field.label && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
          {field.helpText && !error && (
            <p className="text-gray-500" id={`${field.id}-help`}>
              {field.helpText}
            </p>
          )}
          {error && (
            <p className="text-red-600" id={`${field.id}-error`}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
