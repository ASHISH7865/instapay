'use client'

import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import {
  useSendMoneyMutation,
  useGetSendMoneyHistoryQuery,
  type SendMoneyRequest,
} from '@/lib/store/slices/sendMoneyApi'

// Optimized hook for sending money
export function useSendMoney() {
  const [sendMoney, { isLoading, error }] = useSendMoneyMutation()

  const sendMoneyHandler = async (data: SendMoneyRequest) => {
    try {
      const result = await sendMoney(data).unwrap()
      toast.success(result.message)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send money'
      toast.error(message)
      throw err
    }
  }

  return {
    sendMoney: sendMoneyHandler,
    isLoading,
    error,
  }
}

// Optimized hook for getting send money history
export function useSendMoneyHistory({
  page = 1,
  limit = 10,
  walletId,
}: {
  page?: number
  limit?: number
  walletId?: string
} = {}) {
  const { userId } = useAuth()

  const { data, isLoading, error, refetch } = useGetSendMoneyHistoryQuery(
    { page, limit, walletId },
    {
      skip: !userId,
    },
  )

  return {
    transactions: data?.transactions || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  }
}
