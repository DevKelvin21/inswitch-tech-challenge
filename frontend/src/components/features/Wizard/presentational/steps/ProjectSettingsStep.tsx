
import React from 'react'
import type { WizardStepComponentProps } from '../../../../../types/wizard.types'

export const ProjectSettingsStep: React.FC<WizardStepComponentProps> = ({
  data,
  onDataChange,
}) => {
  const stepData = (data && typeof data === 'object' && !Array.isArray(data) 
    ? data 
    : {}) as Record<string, unknown>
  const notifications = (stepData.notifications as Record<string, boolean>) || {}

  const handleInputChange = (field: string, value: unknown) => {
    onDataChange({ ...stepData, [field]: value })
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    handleInputChange('notifications', { ...notifications, [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="repositoryUrl" className="block text-sm font-medium text-gray-700">
          Repository URL (Optional)
        </label>
        <input
          type="url"
          id="repositoryUrl"
          value={(stepData.repositoryUrl as string) || ''}
          onChange={(e) => handleInputChange('repositoryUrl', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://github.com/username/repo"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={(stepData.cicd as boolean) || false}
            onChange={(e) => handleInputChange('cicd', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable CI/CD Pipeline</span>
        </label>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Preferences</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.email || false}
              onChange={(e) => handleNotificationChange('email', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.slack || false}
              onChange={(e) => handleNotificationChange('slack', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Slack Notifications</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notifications.discord || false}
              onChange={(e) => handleNotificationChange('discord', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Discord Notifications</span>
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={(stepData.accessibility as boolean) || false}
            onChange={(e) => handleInputChange('accessibility', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Accessibility Features</span>
        </label>
      </div>
    </div>
  )
}
