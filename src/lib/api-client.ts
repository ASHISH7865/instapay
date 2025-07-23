// API Client for handling all REST API calls

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      //   if (!response.ok) {
      //     throw new Error(data.message || `HTTP error! status: ${response.status}`)
      //   }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
    }
  }

  // GET request
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return this.request<T>(url.pathname + url.search)
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// API endpoints constants
export const API_ENDPOINTS = {
  // User management
  USERS: '/users',
  USER_PROFILE: (userId: string) => `/api/users/${userId}`,
  USER_ONBOARDING: (userId: string) => `/api/users/${userId}/onboarding`,

  // Wallet management
  WALLETS: '/api/wallets',
  WALLET_BALANCE: (walletId: string) => `/api/wallets/${walletId}/balance`,
  WALLET_TRANSACTIONS: (walletId: string) => `/api/wallets/${walletId}/transactions`,

  // Transactions
  TRANSACTIONS: '/api/transactions',
  TRANSACTION: (transactionId: string) => `/api/transactions/${transactionId}`,
  TRANSACTION_SUMMARY: '/api/transactions/summary',

  // Dashboard
  DASHBOARD_STATS: '/api/dashboard/stats',
  DASHBOARD_CHART: '/api/dashboard/chart',
  DASHBOARD_RECENT_TRANSACTIONS: '/api/dashboard/recent-transactions',

  // Beneficiaries
  BENEFICIARIES: '/api/beneficiaries',
  BENEFICIARY: (beneficiaryId: string) => `/api/beneficiaries/${beneficiaryId}`,

  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION: (notificationId: string) => `/api/notifications/${notificationId}`,
  MARK_NOTIFICATION_READ: (notificationId: string) => `/api/notifications/${notificationId}/read`,

  // Support
  SUPPORT_TICKETS: '/api/support/tickets',
  SUPPORT_TICKET: (ticketId: string) => `/api/support/tickets/${ticketId}`,

  // Settings
  USER_SETTINGS: (userId: string) => `/api/users/${userId}/settings`,
} as const
