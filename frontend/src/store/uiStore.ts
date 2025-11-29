import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'

/**
 * Toast notification type
 */
export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  onClose?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * UI State
 */
interface UIState {
  // Theme
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void

  // Sidebar
  isSidebarOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
  toggleSidebar: () => void

  // Toast notifications
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  // Modal
  modal: ModalState
  openModal: (modal: Omit<ModalState, 'isOpen'>) => void
  closeModal: () => void

  // Loading states (global)
  isLoading: boolean
  loadingMessage?: string
  setLoading: (isLoading: boolean, message?: string) => void

  // Page title
  pageTitle: string
  setPageTitle: (title: string) => void

  // Breadcrumbs
  breadcrumbs: Array<{ label: string; href?: string }>
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void

  // Navigation state
  isNavigating: boolean
  setNavigating: (isNavigating: boolean) => void
}

/**
 * Global UI store
 * Manages cross-component UI state like theme, toasts, modals, etc.
 */
export const useUIStore = create<UIState>()(
  persist(
    immer((set) => ({
      // Theme state
      theme: 'light',
      setTheme: (theme) => {
        set((state) => {
          state.theme = theme
        })
      },
      toggleTheme: () => {
        set((state) => {
          state.theme = state.theme === 'light' ? 'dark' : 'light'
        })
      },

      // Sidebar state
      isSidebarOpen: false,
      setSidebarOpen: (isOpen) => {
        set((state) => {
          state.isSidebarOpen = isOpen
        })
      },
      toggleSidebar: () => {
        set((state) => {
          state.isSidebarOpen = !state.isSidebarOpen
        })
      },

      // Toast state
      toasts: [],
      addToast: (toast) => {
        set((state) => {
          const id = `toast-${Date.now()}-${Math.random()}`
          state.toasts.push({ ...toast, id })
        })
      },
      removeToast: (id) => {
        set((state) => {
          state.toasts = state.toasts.filter((toast) => toast.id !== id)
        })
      },
      clearToasts: () => {
        set((state) => {
          state.toasts = []
        })
      },

      // Modal state
      modal: {
        isOpen: false,
      },
      openModal: (modal) => {
        set((state) => {
          state.modal = { ...modal, isOpen: true }
        })
      },
      closeModal: () => {
        set((state) => {
          state.modal.isOpen = false
          state.modal.onClose?.()
        })
      },

      // Loading state
      isLoading: false,
      loadingMessage: undefined,
      setLoading: (isLoading, message) => {
        set((state) => {
          state.isLoading = isLoading
          state.loadingMessage = message
        })
      },

      // Page title state
      pageTitle: 'React Advanced Playground',
      setPageTitle: (title) => {
        set((state) => {
          state.pageTitle = title
        })
        // Also update document title
        document.title = title
      },

      // Breadcrumbs state
      breadcrumbs: [],
      setBreadcrumbs: (breadcrumbs) => {
        set((state) => {
          state.breadcrumbs = breadcrumbs
        })
      },

      // Navigation state
      isNavigating: false,
      setNavigating: (isNavigating) => {
        set((state) => {
          state.isNavigating = isNavigating
        })
      },
    })),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        // Only persist theme and sidebar state
        theme: state.theme,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
)

/**
 * Helper hooks for common UI operations
 */

/**
 * Hook to show toast notifications
 */
export function useToast() {
  const addToast = useUIStore((state) => state.addToast)
  const removeToast = useUIStore((state) => state.removeToast)

  return {
    success: (message: string, duration = 5000) =>
      addToast({ message, type: 'success', duration }),
    error: (message: string, duration = 5000) =>
      addToast({ message, type: 'error', duration }),
    warning: (message: string, duration = 5000) =>
      addToast({ message, type: 'warning', duration }),
    info: (message: string, duration = 5000) =>
      addToast({ message, type: 'info', duration }),
    dismiss: removeToast,
  }
}

/**
 * Hook to manage modal state
 */
export function useModal() {
  const modal = useUIStore((state) => state.modal)
  const openModal = useUIStore((state) => state.openModal)
  const closeModal = useUIStore((state) => state.closeModal)

  return {
    isOpen: modal.isOpen,
    modal,
    open: openModal,
    close: closeModal,
  }
}

/**
 * Hook to manage theme
 */
export function useTheme() {
  const theme = useUIStore((state) => state.theme)
  const setTheme = useUIStore((state) => state.setTheme)
  const toggleTheme = useUIStore((state) => state.toggleTheme)

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }
}

/**
 * Hook to manage global loading state
 */
export function useGlobalLoading() {
  const isLoading = useUIStore((state) => state.isLoading)
  const loadingMessage = useUIStore((state) => state.loadingMessage)
  const setLoading = useUIStore((state) => state.setLoading)

  return {
    isLoading,
    loadingMessage,
    setLoading,
    start: (message?: string) => setLoading(true, message),
    stop: () => setLoading(false),
  }
}
