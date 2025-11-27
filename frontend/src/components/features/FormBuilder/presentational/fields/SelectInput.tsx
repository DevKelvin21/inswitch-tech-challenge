import type { FieldComponentProps } from '../../../../../types/form.types'

/**
 * Select dropdown component
 */
export function SelectInput({ field, value, onChange, onBlur, error, disabled, required }: FieldComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={field.className}>
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
        {field.label}
        {required && field.label && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <div className="mt-1">
        <select
          id={field.id}
          name={field.name}
          value={(value as string) ?? ''}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          required={required}
          className={`block w-full rounded-md shadow-sm sm:text-sm ${
            error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${field.id}-error` : field.helpText ? `${field.id}-help` : undefined}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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
