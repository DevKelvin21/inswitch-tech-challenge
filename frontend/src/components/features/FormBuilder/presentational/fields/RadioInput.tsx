import type { FieldComponentProps } from '../../../../../types/form.types'

/**
 * Radio button group component
 */
export function RadioInput({ field, value, onChange, onBlur, error, disabled, required }: FieldComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={field.className}>
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">
          {field.label}
          {required && field.label && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </legend>
        <div className="mt-2 space-y-2">
          {field.options?.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                id={`${field.id}-${option.value}`}
                name={field.name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                onBlur={onBlur}
                disabled={disabled || field.disabled || option.disabled}
                required={required}
                className={`h-4 w-4 ${
                  error
                    ? 'border-red-300 text-red-600 focus:ring-red-500'
                    : 'border-gray-300 text-indigo-600 focus:ring-indigo-500'
                }`}
              />
              <label
                htmlFor={`${field.id}-${option.value}`}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      {field.helpText && !error && (
        <p className="mt-2 text-sm text-gray-500" id={`${field.id}-help`}>
          {field.helpText}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${field.id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
