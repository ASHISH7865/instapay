import { api } from '../api'

// Types
export interface Transaction {
  id: string
  userId: string
  walletId: string
  type:
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'TRANSFER'
    | 'PAYMENT'
    | 'REFUND'
    | 'FEE'
    | 'INTEREST'
    | 'REWARD'
    | 'PENALTY'
    | 'ADJUSTMENT'
  category:
    | 'FOOD_DINING'
    | 'TRANSPORTATION'
    | 'SHOPPING'
    | 'ENTERTAINMENT'
    | 'BILLS_UTILITIES'
    | 'HEALTHCARE'
    | 'EDUCATION'
    | 'TRAVEL'
    | 'BUSINESS'
    | 'INVESTMENT'
    | 'TRANSFER'
    | 'ATM_CASH'
    | 'FEES'
    | 'INCOME'
    | 'OTHER'
  subCategory?: string
  amount: number
  currency: string
  exchangeRate?: number
  fee: number
  netAmount: number
  senderId?: string
  recipientId?: string
  balanceBefore: number
  balanceAfter: number
  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'EXPIRED'
    | 'DISPUTED'
    | 'REFUNDED'
  statusReason?: string
  processedAt?: string
  description: string
  reference?: string
  merchantName?: string
  merchantCategory?: string
  location?: Record<string, unknown>
  paymentMethodId?: string
  metadata?: Record<string, unknown>
  tags: string[]
  ipAddress?: string
  userAgent?: string
  deviceFingerprint?: string
  createdAt: string
  updatedAt: string
  scheduledAt?: string
  wallet?: {
    id: string
    name: string
    currency: string
  }
  sender?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  recipient?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  paymentMethod?: {
    id: string
    type: string
    last4?: string
    brand?: string
  }
}

export interface TransactionFilters {
  page?: number
  limit?: number
  walletId?: string
  type?: string
  category?: string
  status?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
}

export interface TransactionSummary {
  totalTransactions: number
  totalAmount: number
  totalFees: number
  netAmount: number
  averageAmount: number
  transactionCounts: {
    [key: string]: number
  }
  amountByCategory: {
    [key: string]: number
  }
  amountByType: {
    [key: string]: number
  }
  recentActivity: Transaction[]
}

export interface CreateTransactionData {
  type: string
  category: string
  amount: number
  description: string
  walletId: string
  recipientId?: string
  paymentMethodId?: string
  metadata?: Record<string, unknown>
}

export interface UpdateTransactionData {
  description?: string
  category?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}

// Transaction API slice
export const transactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get transactions with filters
    getTransactions: builder.query<
      { data: { transactions: Transaction[]; pagination: Record<string, unknown> } },
      TransactionFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/api/transactions?${params.toString()}`
      },
      providesTags: ['Transaction'],
      keepUnusedDataFor: 120, // 2 minutes
    }),

    // Get specific transaction
    getTransaction: builder.query<Transaction, string>({
      query: (transactionId) => `/api/transactions/${transactionId}`,
      providesTags: (result, error, transactionId) => [{ type: 'Transaction', id: transactionId }],
      keepUnusedDataFor: 180, // 3 minutes
    }),

    // Get transaction summary
    getTransactionSummary: builder.query<
      TransactionSummary,
      { timeframe?: string; walletId?: string }
    >({
      query: ({ timeframe = 'month', walletId }) => {
        const params = new URLSearchParams()
        params.set('timeframe', timeframe)
        if (walletId) params.set('walletId', walletId)
        return `/api/transactions/summary?${params.toString()}`
      },
      providesTags: ['Transaction'],
      keepUnusedDataFor: 60, // 1 minute
    }),

    // Create transaction
    createTransaction: builder.mutation<Transaction, CreateTransactionData>({
      query: (data) => ({
        url: '/api/transactions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transaction', 'Wallet', 'Analytics'],
    }),

    // Update transaction
    updateTransaction: builder.mutation<
      Transaction,
      { transactionId: string; data: UpdateTransactionData }
    >({
      query: ({ transactionId, data }) => ({
        url: `/api/transactions/${transactionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { transactionId }) => [
        { type: 'Transaction', id: transactionId },
        'Transaction',
      ],
    }),

    // Delete transaction
    deleteTransaction: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/api/transactions/${transactionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transaction', 'Analytics'],
    }),
  }),
})

// Export hooks
export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useGetTransactionSummaryQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi
