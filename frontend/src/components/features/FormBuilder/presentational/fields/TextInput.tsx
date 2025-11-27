import type { FieldComponentProps } from '../../../../../types/form.types'

/**
 * Text input component for text, email, password, number, tel, url, date, time, datetime-local
 */
export function TextInput({ field, value, onChange, onBlur, error, disabled, required }: FieldComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (field.type === 'number') {
      onChange(inputValue === '' ? '' : Number(inputValue))
    } else {
      onChange(inputValue)
    }
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
        <input
          id={field.id}
          name={field.name}
          type={field.type}
          value={(value as string | number) ?? ''}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled || field.disabled}
          readOnly={field.readOnly}
          required={required}
          placeholder={field.placeholder}
          className={`block w-full rounded-md shadow-sm sm:text-sm ${
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          } ${field.readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${field.id}-error` : field.helpText ? `${field.id}-help` : undefined}
          {...(field.attributes as React.InputHTMLAttributes<HTMLInputElement>)}
        />
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
