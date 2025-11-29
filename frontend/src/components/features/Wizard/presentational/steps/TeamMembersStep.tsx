
import React from 'react'
import type { WizardStepComponentProps } from '../../../../../types/wizard.types'

export const TeamMembersStep: React.FC<WizardStepComponentProps> = ({
  data,
  onDataChange,
}) => {
  const stepData = (data && typeof data === 'object' && !Array.isArray(data) 
    ? data 
    : {}) as Record<string, unknown>
  const teamMembers = (stepData.teamMembers as Array<Record<string, unknown>>) || []

  const handleArrayInputChange = (field: string, index: number, key: string, value: unknown) => {
    const currentArray = (stepData[field] as Array<Record<string, unknown>>) || []
    const updatedArray = [...currentArray]
    updatedArray[index] = { ...updatedArray[index], [key]: value }
    onDataChange({ ...stepData, [field]: updatedArray })
  }

  const addArrayItem = (field: string) => {
    const currentArray = (stepData[field] as Array<Record<string, unknown>>) || []
    onDataChange({ ...stepData, [field]: [...currentArray, {}] })
  }

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = (stepData[field] as Array<Record<string, unknown>>) || []
    const updatedArray = currentArray.filter((_, i) => i !== index)
    onDataChange({ ...stepData, [field]: updatedArray })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-gray-900">Team Members (Optional)</h4>
        <button
          type="button"
          onClick={() => addArrayItem('teamMembers')}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
        >
          + Add Member
        </button>
      </div>

      {teamMembers.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">
          No team members added yet. Click "Add Member" to get started.
        </p>
      )}

      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={(member.name as string) || ''}
                  onChange={(e) =>
                    handleArrayInputChange('teamMembers', index, 'name', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={(member.email as string) || ''}
                  onChange={(e) =>
                    handleArrayInputChange('teamMembers', index, 'email', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <div className="flex gap-2">
                  <select
                    value={(member.role as string) || ''}
                    onChange={(e) =>
                      handleArrayInputChange('teamMembers', index, 'role', e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select role...</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="manager">Manager</option>
                    <option value="qa">QA</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('teamMembers', index)}
                    className="mt-1 inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
