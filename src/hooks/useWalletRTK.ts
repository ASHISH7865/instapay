'use client'

import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import {
  useGetWalletsQuery,
  useGetWalletQuery,
  useCreateWalletMutation,
  useUpdateWalletBalanceMutation,
  useGetWalletAnalyticsQuery,
  type CreateWalletData,
  type UpdateBalanceData,
} from '@/lib/store/slices/walletApi'

// Optimized hook for getting all wallets
export function useWallets() {
  const { userId } = useAuth()

  const {
    data: wallets,
    isLoading,
    error,
    refetch,
  } = useGetWalletsQuery(undefined, {
    skip: !userId,
  })

  return {
    wallets,
    isLoading,
    error,
    refetch,
  }
}

// Optimized hook for getting specific wallet
export function useWallet(walletId: string) {
  const { userId } = useAuth()

  const {
    data: wallet,
    isLoading,
    error,
    refetch,
  } = useGetWalletQuery(walletId, {
    skip: !userId || !walletId,
  })

  return {
    wallet,
    isLoading,
    error,
    refetch,
  }
}

// Optimized hook for creating wallet
export function useCreateWallet() {
  const [createWallet, { isLoading, error }] = useCreateWalletMutation()

  const createWalletHandler = async (data: CreateWalletData) => {
    try {
      const result = await createWallet(data).unwrap()
      toast.success('Wallet created successfully')
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create wallet'
      toast.error(message)
      throw err
    }
  }

  return {
    createWallet: createWalletHandler,
    isLoading,
    error,
  }
}

// Optimized hook for updating wallet balance
export function useUpdateWalletBalance() {
  const [updateBalance, { isLoading, error }] = useUpdateWalletBalanceMutation()

  const updateBalanceHandler = async (walletId: string, data: UpdateBalanceData) => {
    try {
      const result = await updateBalance({ walletId, data }).unwrap()
      const action = data.type === 'DEPOSIT' ? 'deposited' : 'withdrawn'
      toast.success(`Successfully ${action} $${data.amount}`)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update balance'
      toast.error(message)
      throw err
    }
  }

  return {
    updateBalance: updateBalanceHandler,
    isLoading,
    error,
  }
}

// Optimized hook for wallet analytics
export function useWalletAnalytics({
  timeframe = 'month',
  walletId,
}: {
  timeframe?: string
  walletId?: string
}) {
  const { userId } = useAuth()

  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useGetWalletAnalyticsQuery(
    { timeframe, walletId },
    {
      skip: !userId,
    },
  )

  return {
    analytics,
    isLoading,
    error,
    refetch,
  }
}
