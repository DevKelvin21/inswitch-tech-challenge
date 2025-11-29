
import React from 'react'
import type { WizardStepComponentProps } from '../../../../../types/wizard.types'

export const TechnologyStackStep: React.FC<WizardStepComponentProps> = ({
  data,
  onDataChange,
}) => {
  const stepData = (data && typeof data === 'object' && !Array.isArray(data) 
    ? data 
    : {}) as Record<string, unknown>
  const frontendOptions = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js']
  const backendOptions = ['Node.js', 'Python', 'Java', 'Go', 'Ruby', 'PHP']
  const databaseOptions = ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite']
  const deploymentOptions = ['AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'Heroku']

  const handleInputChange = (field: string, value: unknown) => {
    onDataChange({ ...stepData, [field]: value })
  }

  const toggleArrayItem = (field: string, value: string) => {
    const currentArray = (stepData[field] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    handleInputChange(field, newArray)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Frontend Technologies *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {frontendOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={((stepData.frontend as string[]) || []).includes(option)}
                onChange={() => toggleArrayItem('frontend', option)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Backend Technologies *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {backendOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={((stepData.backend as string[]) || []).includes(option)}
                onChange={() => toggleArrayItem('backend', option)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Database *</label>
        <select
          value={(stepData.database as string) || ''}
          onChange={(e) => handleInputChange('database', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select database...</option>
          {databaseOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Deployment Platform *</label>
        <select
          value={(stepData.deployment as string) || ''}
          onChange={(e) => handleInputChange('deployment', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select platform...</option>
          {deploymentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
