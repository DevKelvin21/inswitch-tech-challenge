
import React from 'react'
import type { WizardStepComponentProps } from '../../../../../types/wizard.types'

export const ReviewStep: React.FC<WizardStepComponentProps> = ({ data, onDataChange }) => {
  const stepData = (data && typeof data === 'object' && !Array.isArray(data) 
    ? data 
    : {}) as Record<string, unknown>

  const handleInputChange = (field: string, value: unknown) => {
    onDataChange({ ...stepData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Review Your Configuration</h4>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Project Name</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {(stepData.projectName as string) || 'Not set'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Project Type</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {(stepData.projectType as string) || 'Not set'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Frontend Technologies</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {((stepData.frontend as string[]) || []).join(', ') || 'None selected'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Backend Technologies</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {((stepData.backend as string[]) || []).join(', ') || 'None selected'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Database</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {(stepData.database as string) || 'Not set'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={(stepData.confirm as boolean) || false}
            onChange={(e) => handleInputChange('confirm', e.target.checked)}
            className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            I confirm that the information above is correct and I want to create this project. *
          </span>
        </label>
      </div>
    </div>
  )
}
