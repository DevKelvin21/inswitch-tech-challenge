/**
 * Application Configuration
 * Global app settings and feature flags
 */

/**
 * Feature flags for enabling/disabling features
 */
export const featureFlags = {
  // Feature toggles
  dataTable: true,
  formBuilder: true,
  infiniteScroll: true,
  wizard: true,

  // Experimental features
  darkMode: false,
  offlineMode: false,
  analytics: false,

  // Development features
  devTools: import.meta.env.DEV,
  debugMode: import.meta.env.DEV,
} as const

/**
 * Pagination configuration
 */
export const paginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50, 100],
  maxPageSize: 100,
} as const

/**
 * Table configuration
 */
export const tableConfig = {
  defaultSort: 'createdAt:desc',
  enableVirtualization: true,
  virtualizationThreshold: 100, // Start virtualizing after this many rows
} as const

/**
 * Form configuration
 */
export const formConfig = {
  autoSaveDebounce: 1000, // ms
  validationDebounce: 300, // ms
  showRequiredIndicator: true,
} as const

/**
 * Infinite scroll configuration
 */
export const infiniteScrollConfig = {
  initialPageSize: 20,
  loadMoreThreshold: 0.8, // Load more when 80% scrolled
  enableVirtualization: true,
  overscan: 5, // Number of items to render outside viewport
} as const

/**
 * Wizard configuration
 */
export const wizardConfig = {
  defaultNavigationMode: 'linear' as const,
  allowBackNavigation: true,
  autoSave: true,
  autoSaveDebounce: 2000, // ms
} as const

/**
 * UI configuration
 */
export const uiConfig = {
  // Theme
  defaultTheme: 'light' as const,
  themes: ['light', 'dark'] as const,

  // Toast notifications
  toastDuration: 5000, // ms
  toastPosition: 'top-right' as const,

  // Modal
  modalCloseOnEscape: true,
  modalCloseOnBackdropClick: true,

  // Animation
  animationDuration: 300, // ms
  disableAnimations: false,
} as const

/**
 * Storage configuration
 */
export const storageConfig = {
  prefix: 'app_',
  defaultStorageType: 'localStorage' as const,
  encryptSensitiveData: false,
} as const

/**
 * Application metadata
 */
export const appMetadata = {
  name: 'React Advanced Playground',
  version: '1.0.0',
  description: 'Advanced React patterns and architecture showcase',
  author: 'Your Name',
  repository: 'https://github.com/yourusername/react-playground',
} as const

/**
 * Combined app configuration
 */
export const appConfig = {
  features: featureFlags,
  pagination: paginationConfig,
  table: tableConfig,
  form: formConfig,
  infiniteScroll: infiniteScrollConfig,
  wizard: wizardConfig,
  ui: uiConfig,
  storage: storageConfig,
  metadata: appMetadata,
} as const

/**
 * Helper to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature]
}

/**
 * Helper to get config value with type safety
 */
export function getConfigValue<K extends keyof typeof appConfig>(
  key: K
): (typeof appConfig)[K] {
  return appConfig[key]
}
