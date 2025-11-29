
import React from 'react'
import type { WizardStepComponentProps } from '../../../../../types/wizard.types'

export const ProjectInfoStep: React.FC<WizardStepComponentProps> = ({
  data,
  onDataChange,
}) => {
  const stepData = (data && typeof data === 'object' && !Array.isArray(data) 
    ? data 
    : {}) as Record<string, unknown>

  const handleInputChange = (field: string, value: unknown) => {
    onDataChange({ ...stepData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
          Project Name *
        </label>
        <input
          type="text"
          id="projectName"
          value={(stepData.projectName as string) || ''}
          onChange={(e) => handleInputChange('projectName', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
          Project Description *
        </label>
        <textarea
          id="projectDescription"
          rows={4}
          value={(stepData.projectDescription as string) || ''}
          onChange={(e) => handleInputChange('projectDescription', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe your project"
        />
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
          Project Type *
        </label>
        <select
          id="projectType"
          value={(stepData.projectType as string) || ''}
          onChange={(e) => handleInputChange('projectType', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a type...</option>
          <option value="web">Web Application</option>
          <option value="mobile">Mobile Application</option>
          <option value="desktop">Desktop Application</option>
          <option value="api">API / Backend</option>
        </select>
      </div>
    </div>
  )
}
