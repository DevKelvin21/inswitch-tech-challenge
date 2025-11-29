/**
 * API Configuration
 * Central configuration for API endpoints and settings
 */

/**
 * API base URL
 * Can be overridden via environment variable
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.mockapi.io/api/v1'

/**
 * API timeout in milliseconds
 */
export const API_TIMEOUT = 30000

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // User endpoints
  users: '/users',
  userById: (id: string | number) => `/users/${id}`,

  // Product endpoints
  products: '/products',
  productById: (id: string | number) => `/products/${id}`,

  // Blog post endpoints
  posts: '/posts',
  postById: (id: string | number) => `/posts/${id}`,

  // Project endpoints
  projects: '/projects',
  projectById: (id: string | number) => `/projects/${id}`,

  // Authentication endpoints (placeholder for future backend)
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
} as const

/**
 * API request headers
 */
export const API_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const

/**
 * API configuration object
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  endpoints: API_ENDPOINTS,
  headers: API_HEADERS,
} as const
