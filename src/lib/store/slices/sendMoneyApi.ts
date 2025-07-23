import { api } from '../api'

// Types
export interface SendMoneyRequest {
  recipientEmail: string
  amount: number
  description: string
  walletId: string
  pin: string
}

export interface SendMoneyResponse {
  success: boolean
  transaction: {
    id: string
    amount: number
    type: string
    status: string
    description: string
    createdAt: string
    recipient: {
      firstName: string
      lastName: string
      email: string
    }
  }
  message: string
}

export interface SendMoneyHistoryResponse {
  transactions: Array<{
    id: string
    amount: number
    type: string
    status: string
    description: string
    createdAt: string
    recipient: {
      firstName: string
      lastName: string
      email: string
    }
    wallet: {
      name: string
      currency: string
    }
  }>
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Send Money API slice
export const sendMoneyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Send money
    sendMoney: builder.mutation<SendMoneyResponse, SendMoneyRequest>({
      query: (data) => ({
        url: '/api/send-money',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet', 'Transaction', 'SendMoney', 'Analytics'],
    }),

    // Get send money history
    getSendMoneyHistory: builder.query<
      SendMoneyHistoryResponse,
      { page?: number; limit?: number; walletId?: string }
    >({
      query: ({ page = 1, limit = 10, walletId }) => {
        const params = new URLSearchParams()
        params.set('page', String(page))
        params.set('limit', String(limit))
        if (walletId) params.set('walletId', walletId)
        return `/api/send-money?${params.toString()}`
      },
      providesTags: ['SendMoney'],
      keepUnusedDataFor: 120, // 2 minutes
    }),
  }),
})

// Export hooks
export const { useSendMoneyMutation, useGetSendMoneyHistoryQuery } = sendMoneyApi
