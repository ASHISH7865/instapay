'use client'

import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useGetTransactionSummaryQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  type TransactionFilters,
  type CreateTransactionData,
  type UpdateTransactionData,
} from '@/lib/store/slices/transactionApi'

// Optimized hook for getting transactions with filters
export function useTransactions(filters: TransactionFilters = {}) {
  const { userId } = useAuth()

  const { data, isLoading, error, refetch } = useGetTransactionsQuery(filters, {
    skip: !userId,
  })


  return {
    transactions: data?.data?.transactions || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refetch,
  }
}

// Optimized hook for getting specific transaction
export function useTransaction(transactionId: string) {
  const { userId } = useAuth()

  const {
    data: transaction,
    isLoading,
    error,
    refetch,
  } = useGetTransactionQuery(transactionId, {
    skip: !userId || !transactionId,
  })

  return {
    transaction,
    isLoading,
    error,
    refetch,
  }
}

// Optimized hook for getting transaction summary
export function useTransactionSummary(timeframe: string = 'month', walletId?: string) {
  const { userId } = useAuth()

  const {
    data: summary,
    isLoading,
    error,
    refetch,
  } = useGetTransactionSummaryQuery(
    { timeframe, walletId },
    {
      skip: !userId,
    },
  )

  return {
    summary,
    isLoading,
    error,
    refetch,
  }
}

// Optimized hook for creating transaction
export function useCreateTransaction() {
  const [createTransaction, { isLoading, error }] = useCreateTransactionMutation()

  const createTransactionHandler = async (data: CreateTransactionData) => {
    try {
      const result = await createTransaction(data).unwrap()
      toast.success('Transaction created successfully')
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create transaction'
      toast.error(message)
      throw err
    }
  }

  return {
    createTransaction: createTransactionHandler,
    isLoading,
    error,
  }
}

// Optimized hook for updating transaction
export function useUpdateTransaction() {
  const [updateTransaction, { isLoading, error }] = useUpdateTransactionMutation()

  const updateTransactionHandler = async (transactionId: string, data: UpdateTransactionData) => {
    try {
      const result = await updateTransaction({ transactionId, data }).unwrap()
      toast.success('Transaction updated successfully')
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction'
      toast.error(message)
      throw err
    }
  }

  return {
    updateTransaction: updateTransactionHandler,
    isLoading,
    error,
  }
}

// Optimized hook for deleting transaction
export function useDeleteTransaction() {
  const [deleteTransaction, { isLoading, error }] = useDeleteTransactionMutation()

  const deleteTransactionHandler = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId).unwrap()
      toast.success('Transaction deleted successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction'
      toast.error(message)
      throw err
    }
  }

  return {
    deleteTransaction: deleteTransactionHandler,
    isLoading,
    error,
  }
}
