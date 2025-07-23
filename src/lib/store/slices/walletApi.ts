import { api } from '../api'

// Types
export interface Wallet {
  id: string
  userId: string
  name: string
  type: 'PERSONAL' | 'BUSINESS' | 'SAVINGS' | 'INVESTMENT'
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'CNY' | 'BTC' | 'ETH'
  balance: number
  availableBalance: number
  pinAttempts: number
  pinLockedUntil?: string
  dailySpendLimit?: number
  monthlySpendLimit?: number
  transactionLimit: number
  status: 'ACTIVE' | 'SUSPENDED' | 'FROZEN' | 'CLOSED'
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateWalletData {
  name: string
  type: 'PERSONAL' | 'BUSINESS' | 'SAVINGS' | 'INVESTMENT'
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'CNY' | 'BTC' | 'ETH'
  pin: string
  dailySpendLimit?: number
  monthlySpendLimit?: number
}

export interface UpdateBalanceData {
  amount: number
  type: 'DEPOSIT' | 'WITHDRAWAL'
  description: string
  paymentMethodId?: string
}

export interface BalanceUpdateResult {
  wallet: Wallet
  transaction: {
    id: string
    amount: number
    type: string
    status: string
  }
}

export interface WalletAnalytics {
  totalBalance: number
  availableBalance: number
  totalTransactions: number
  totalSpent: number
  totalReceived: number
  monthlySpent: number
  monthlyReceived: number
  dailySpent: number
  dailyReceived: number
  balanceChange: number
  savingsRate: number
  monthlyIncome: number
  monthlySpending: number
  dailySpending: number
  projectedBalance: number
  topCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
  recentTransactions: Array<{
    id: string
    amount: number
    type: string
    description: string
    createdAt: string
  }>
}

// Wallet API slice
export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all wallets
    getWallets: builder.query<{ data: Wallet[], success: boolean, message: string }, void>({
      query: () => '/api/wallets',
      providesTags: ['Wallet'],
      keepUnusedDataFor: 300, // 5 minutes
    }),

    // Get specific wallet
    getWallet: builder.query<Wallet, string>({
      query: (walletId) => `/api/wallets/${walletId}`,
      providesTags: (result, error, walletId) => [{ type: 'Wallet', id: walletId }],
      keepUnusedDataFor: 180, // 3 minutes
    }),

    // Create wallet
    createWallet: builder.mutation<Wallet, CreateWalletData>({
      query: (data) => ({
        url: '/api/wallets',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet'],
    }),

    // Update wallet balance
    updateWalletBalance: builder.mutation<
      BalanceUpdateResult,
      { walletId: string; data: UpdateBalanceData }
    >({
      query: ({ walletId, data }) => ({
        url: `/api/wallets/${walletId}/balance`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { walletId }) => [
        { type: 'Wallet', id: walletId },
        'Wallet',
        'Transaction',
        'Analytics',
      ],
    }),

    // Get wallet analytics
    getWalletAnalytics: builder.query<WalletAnalytics, { timeframe?: string; walletId?: string }>({
      query: ({ timeframe = 'month', walletId }) => {
        const params = new URLSearchParams()
        params.set('timeframe', timeframe)
        if (walletId) params.set('walletId', walletId)
        return `/api/analytics/wallet?${params.toString()}`
      },
      providesTags: ['Analytics'],
      keepUnusedDataFor: 60, // 1 minute
    }),
  }),
})

// Export hooks
export const {
  useGetWalletsQuery,
  useGetWalletQuery,
  useCreateWalletMutation,
  useUpdateWalletBalanceMutation,
  useGetWalletAnalyticsQuery,
} = walletApi
