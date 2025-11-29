import { z } from 'zod'
import type { WizardConfig } from '../../../../types/wizard.types'

// Import step components
import { ProjectInfoStep } from '../presentational/steps/ProjectInfoStep'
import { TeamMembersStep } from '../presentational/steps/TeamMembersStep'
import { TechnologyStackStep } from '../presentational/steps/TechnologyStackStep'
import { ProjectSettingsStep } from '../presentational/steps/ProjectSettingsStep'
import { ReviewStep } from '../presentational/steps/ReviewStep'

/**
 * Sample wizard configuration for project setup
 */
export const projectSetupWizardConfig: WizardConfig = {
  id: 'project-setup-wizard',
  title: 'Project Setup Wizard',
  description: 'Complete the following steps to set up your new project',
  navigationMode: 'linear',
  allowBackNavigation: true,
  showProgressBar: true,
  showStepNumbers: true,

  steps: [
    {
      id: 'project-info',
      title: 'Project Information',
      description: 'Basic information about your project',
      optional: false,
      skippable: false,
      fields: ['projectName', 'projectDescription', 'projectType'],
      component: ProjectInfoStep,
      validationSchema: z.object({
        projectName: z
          .string()
          .min(3, 'Project name must be at least 3 characters')
          .max(50, 'Project name must be less than 50 characters'),
        projectDescription: z
          .string()
          .min(10, 'Description must be at least 10 characters')
          .max(500, 'Description must be less than 500 characters'),
        projectType: z.enum(['web', 'mobile', 'desktop', 'api'], {
          message: 'Please select a project type',
        }),
      }),
    },
    {
      id: 'team-members',
      title: 'Team Members',
      description: 'Add team members to your project',
      optional: true,
      skippable: true,
      fields: ['teamMembers'],
      component: TeamMembersStep,
      validationSchema: z.object({
        teamMembers: z
          .array(
            z.object({
              name: z.string().min(2, 'Name must be at least 2 characters'),
              email: z.string().email('Please enter a valid email'),
              role: z.enum(['developer', 'designer', 'manager', 'qa'], {
                message: 'Please select a role',
              }),
            }),
          )
          .optional(),
      }),
    },
    {
      id: 'technology-stack',
      title: 'Technology Stack',
      description: 'Select the technologies for your project',
      optional: false,
      skippable: false,
      fields: ['frontend', 'backend', 'database', 'deployment'],
      component: TechnologyStackStep,
      validationSchema: z.object({
        frontend: z.array(z.string()).min(1, 'Select at least one frontend technology'),
        backend: z.array(z.string()).min(1, 'Select at least one backend technology'),
        database: z.string().min(1, 'Please select a database'),
        deployment: z.string().min(1, 'Please select a deployment platform'),
      }),
    },
    {
      id: 'project-settings',
      title: 'Project Settings',
      description: 'Configure project settings and preferences',
      optional: false,
      skippable: false,
      fields: ['repositoryUrl', 'cicd', 'notifications', 'accessibility'],
      component: ProjectSettingsStep,
      validationSchema: z.object({
        repositoryUrl: z
          .string()
          .url('Please enter a valid repository URL')
          .optional()
          .or(z.literal('')),
        cicd: z.boolean(),
        notifications: z.object({
          email: z.boolean(),
          slack: z.boolean(),
          discord: z.boolean(),
        }),
        accessibility: z.boolean(),
      }),
    },
    {
      id: 'review-submit',
      title: 'Review & Submit',
      description: 'Review your configuration and submit',
      optional: false,
      skippable: false,
      fields: [],
      component: ReviewStep,
      validationSchema: z.object({
        confirm: z.boolean().refine((val) => val === true, {
          message: 'You must confirm to proceed',
        }),
      }),
    },
  ],

  persistence: {
    enabled: true,
    storageKey: 'project-setup-wizard',
    storageType: 'localStorage',
    clearOnSubmit: true,
    restoreOnMount: true,
  },

  submit: {
    submitButtonText: 'Create Project',
    endpoint: '/projects',
    method: 'POST',
    successMessage: 'Project created successfully!',
    errorMessage: 'Failed to create project. Please try again.',
  },

  styling: {
    orientation: 'horizontal',
    showIcons: true,
    showDescriptions: true,
    compact: false,
  },
}

/**
 * Sample wizard configuration for user onboarding
 */
export const userOnboardingWizardConfig: WizardConfig = {
  id: 'user-onboarding-wizard',
  title: 'Welcome to Our Platform',
  description: 'Let us help you get started',
  navigationMode: 'non-linear',
  allowBackNavigation: true,
  showProgressBar: true,
  showStepNumbers: false,

  steps: [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started with your account',
      optional: false,
      skippable: false,
      validationSchema: z.object({}),
    },
    {
      id: 'profile',
      title: 'Profile Setup',
      description: 'Tell us about yourself',
      optional: false,
      skippable: false,
      fields: ['fullName', 'avatar', 'bio'],
      validationSchema: z.object({
        fullName: z.string().min(2, 'Full name must be at least 2 characters'),
        avatar: z.string().url('Please enter a valid avatar URL').optional(),
        bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
      }),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Customize your experience',
      optional: true,
      skippable: true,
      fields: ['theme', 'language', 'timezone'],
      validationSchema: z.object({
        theme: z.enum(['light', 'dark', 'auto']),
        language: z.string(),
        timezone: z.string(),
      }),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Choose how you want to be notified',
      optional: true,
      skippable: true,
      fields: ['emailNotifications', 'pushNotifications'],
      validationSchema: z.object({
        emailNotifications: z.boolean(),
        pushNotifications: z.boolean(),
      }),
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your account is ready to use',
      optional: false,
      skippable: false,
      validationSchema: z.object({}),
    },
  ],

  persistence: {
    enabled: true,
    storageKey: 'user-onboarding-wizard',
    storageType: 'sessionStorage',
    clearOnSubmit: true,
    restoreOnMount: true,
  },

  submit: {
    submitButtonText: 'Get Started',
    endpoint: '/user/onboarding',
    method: 'POST',
    successMessage: 'Welcome! Your account is all set up.',
    errorMessage: 'Something went wrong. Please try again.',
  },

  styling: {
    orientation: 'vertical',
    showIcons: false,
    showDescriptions: true,
    compact: true,
  },
}

/**
 * Default wizard configuration
 */
export const defaultWizardConfig = projectSetupWizardConfig
