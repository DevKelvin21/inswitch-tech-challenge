import { z } from 'zod'
import type { FormConfig } from '../../../../types/form.types'


export const userRegistrationFormConfig: FormConfig = {
  id: 'user-registration',
  title: 'User Registration Form',
  description: 'Complete the form below to create a new user account',

  fields: [
    // Basic Information Section
    {
      id: 'firstName',
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      required: true,
      colSpan: 6,
      validation: z.string().min(2, 'First name must be at least 2 characters'),
    },
    {
      id: 'lastName',
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter your last name',
      required: true,
      colSpan: 6,
      validation: z.string().min(2, 'Last name must be at least 2 characters'),
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'you@example.com',
      required: true,
      colSpan: 12,
      helpText: 'We\'ll never share your email with anyone else',
      validation: z.string().email('Please enter a valid email address'),
    },
    {
      id: 'phone',
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+1 (555) 000-0000',
      colSpan: 6,
      validation: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number').optional(),
    },
    {
      id: 'dateOfBirth',
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      colSpan: 6,
      validation: z.string().refine(
        (date) => {
          const age = new Date().getFullYear() - new Date(date).getFullYear()
          return age >= 18
        },
        { message: 'You must be at least 18 years old' }
      ),
    },

    // Account Type (conditional logic trigger)
    {
      id: 'accountType',
      name: 'accountType',
      label: 'Account Type',
      type: 'radio',
      required: true,
      colSpan: 12,
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business', value: 'business' },
        { label: 'Developer', value: 'developer' },
      ],
      defaultValue: 'personal',
      validation: z.enum(['personal', 'business', 'developer']),
    },

    // Business fields (conditional - shown only for business accounts)
    {
      id: 'companyName',
      name: 'companyName',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Acme Inc.',
      required: true,
      colSpan: 8,
      conditional: {
        mode: 'all',
        rules: [
          {
            field: 'accountType',
            operator: 'equals',
            value: 'business',
          },
        ],
      },
      validation: z.string().min(2, 'Company name must be at least 2 characters'),
    },
    {
      id: 'taxId',
      name: 'taxId',
      label: 'Tax ID',
      type: 'text',
      placeholder: '12-3456789',
      required: true,
      colSpan: 4,
      conditional: {
        mode: 'all',
        rules: [
          {
            field: 'accountType',
            operator: 'equals',
            value: 'business',
          },
        ],
      },
      validation: z.string().regex(/^\d{2}-\d{7}$/, 'Please enter a valid tax ID (XX-XXXXXXX)'),
    },
    {
      id: 'industry',
      name: 'industry',
      label: 'Industry',
      type: 'select',
      required: true,
      colSpan: 12,
      options: [
        { label: 'Select an industry...', value: '', disabled: true },
        { label: 'Technology', value: 'technology' },
        { label: 'Finance', value: 'finance' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Education', value: 'education' },
        { label: 'Retail', value: 'retail' },
        { label: 'Other', value: 'other' },
      ],
      conditional: {
        mode: 'all',
        rules: [
          {
            field: 'accountType',
            operator: 'equals',
            value: 'business',
          },
        ],
      },
      validation: z.string().min(1, 'Please select an industry'),
    },

    // Developer fields (conditional - shown only for developer accounts)
    {
      id: 'githubUsername',
      name: 'githubUsername',
      label: 'GitHub Username',
      type: 'text',
      placeholder: 'octocat',
      required: true,
      colSpan: 6,
      conditional: {
        mode: 'all',
        rules: [
          {
            field: 'accountType',
            operator: 'equals',
            value: 'developer',
          },
        ],
      },
      validation: z.string().min(1, 'GitHub username is required'),
    },
    {
      id: 'yearsOfExperience',
      name: 'yearsOfExperience',
      label: 'Years of Experience',
      type: 'number',
      placeholder: '5',
      required: true,
      colSpan: 6,
      conditional: {
        mode: 'all',
        rules: [
          {
            field: 'accountType',
            operator: 'equals',
            value: 'developer',
          },
        ],
      },
      validation: z.number().min(0, 'Years must be 0 or greater').max(50, 'Years must be less than 50'),
    },
    {
      id: 'programmingLanguages',
      name: 'programmingLanguages',
      label: 'Programming Languages',
      type: 'multiselect',
      required: true,
      colSpan: 12,
      helpText: 'Select all that apply',
      options: [
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' },
        { label: 'C#', value: 'csharp' },
        { label: 'Go', value: 'go' },
        { label: 'Rust', value: 'rust' },
        { label: 'Ruby', value: 'ruby' },
      ],
      conditional: {
        mode: 'all',
        rules: [
          {
            field: 'accountType',
            operator: 'equals',
            value: 'developer',
          },
        ],
      },
      validation: z.array(z.string()).min(1, 'Select at least one language'),
    },

    // Address Section
    {
      id: 'address',
      name: 'address',
      label: 'Street Address',
      type: 'text',
      placeholder: '123 Main St',
      required: true,
      colSpan: 12,
      validation: z.string().min(5, 'Address must be at least 5 characters'),
    },
    {
      id: 'city',
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: 'New York',
      required: true,
      colSpan: 6,
      validation: z.string().min(2, 'City must be at least 2 characters'),
    },
    {
      id: 'state',
      name: 'state',
      label: 'State/Province',
      type: 'text',
      placeholder: 'NY',
      required: true,
      colSpan: 3,
      validation: z.string().min(2, 'State must be at least 2 characters'),
    },
    {
      id: 'zipCode',
      name: 'zipCode',
      label: 'ZIP Code',
      type: 'text',
      placeholder: '10001',
      required: true,
      colSpan: 3,
      validation: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
    },

    // Preferences
    {
      id: 'bio',
      name: 'bio',
      label: 'Bio',
      type: 'textarea',
      placeholder: 'Tell us about yourself...',
      colSpan: 12,
      attributes: {
        rows: 4,
      },
      helpText: 'Max 500 characters',
      validation: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    },
    {
      id: 'newsletter',
      name: 'newsletter',
      label: 'Subscribe to Newsletter',
      type: 'checkbox',
      colSpan: 12,
      helpText: 'Receive updates and news about our products',
      defaultValue: false,
      validation: z.boolean().optional(),
    },
    {
      id: 'terms',
      name: 'terms',
      label: 'I agree to the Terms and Conditions',
      type: 'checkbox',
      required: true,
      colSpan: 12,
      validation: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms and conditions',
      }),
    },
  ],

  submit: {
    submitButtonText: 'Create Account',
    resetButtonText: 'Reset Form',
    showResetButton: true,
    showClearButton: false,
    successMessage: 'Account created successfully!',
    errorMessage: 'Failed to create account. Please try again.',
    endpoint: '/users',
    method: 'POST',
  },

  persistence: {
    enabled: true,
    storageKey: 'user-registration-form',
    debounceMs: 1000,
    clearOnSubmit: true,
  },

  styling: {
    layout: 'grid',
    gridColumns: 12,
    spacing: 'normal',
    labelPosition: 'top',
    showRequiredIndicator: true,
    showFieldCount: false,
  },
}


export const defaultFormConfig = userRegistrationFormConfig
