import { api } from '../api'

// Types
export interface DashboardAnalytics {
  paymentStats: {
    totalPayments: number
    totalAmount: number
    successfulPayments: number
    pendingPayments: number
    failedPayments: number
    successRate: number
    averagePayment: number
    uniqueRecipients: number
    trends: {
      paymentGrowth: number
      amountGrowth: number
      successRateGrowth: number
    }
  }
  categoryData: {
    Transfer: {
      count: number
      amount: number
      percentage: number
    }
    Payment: {
      count: number
      amount: number
      percentage: number
    }
    'Top Up': {
      count: number
      amount: number
      percentage: number
    }
    Withdrawal: {
      count: number
      amount: number
      percentage: number
    }
    Other: {
      count: number
      amount: number
      percentage: number
    }
  }
  trends: {
    volumeGrowth: number
    transactionGrowth: number
    peakHours: string
    averageTransactionValue: number
  }
  timeSeriesData: Array<{
    date: string
    amount: number
    count: number
    label: string
  }>
  insights: Array<{
    icon: string
    title: string
    value: string
    description: string
    color: string
  }>
  wallets: Array<{
    id: string
    name: string
    balance: number
    availableBalance: number
    currency: string
    isDefault: boolean
  }>
  recentTransactions: Array<{
    id: string
    type: string
    amount: number
    description: string
    status: string
    createdAt: string
    wallet: {
      id: string
      name: string
      currency: string
    }
  }>
}

export interface DashboardFilters {
  timeframe?: string
  walletId?: string
}

// Dashboard API slice
export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard analytics
    getDashboardAnalytics: builder.query<
      { data: DashboardAnalytics },
      DashboardFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/api/dashboard/analytics?${params.toString()}`
      },
      providesTags: ['Dashboard', 'Transaction', 'Wallet'],
      keepUnusedDataFor: 60, // 1 minute
    }),
  }),
})

// Export hooks
export const {
  useGetDashboardAnalyticsQuery,
} = dashboardApi
