import { useCallback, useMemo, useState } from 'react'
import { useTransactions as useTransactionsRTK } from '@/hooks/useTransactionsRTK'
import { useTransactionSummary } from '@/hooks/useTransactionsRTK'

// Types for real API data
interface TransactionSummary {
  totalAmount: number
  totalTransactions: number
  averageAmount: number
  topCategories: Array<{
    category: string
    amount: number
    count: number
  }>
}

interface TransactionFilters {
  status?: string
  type?: string
  category?: string
  dateFrom?: Date
  dateTo?: Date
}

interface UseTransactionsReturn {
  // Data
  transactions: Array<{
    id: string
    type: string
    amount: number
    category?: string
    createdAt: Date
    status: string
    sender?: { firstName: string | null; lastName: string | null }
    recipient?: { firstName: string | null; lastName: string | null }
  }>
  transactionSummary: TransactionSummary | null

  // Loading states
  isLoading: boolean
  isTransactionsLoading: boolean
  isSummaryLoading: boolean

  // Error states
  error: string | null

  // Filters
  filters: TransactionFilters
  setFilters: (filters: TransactionFilters) => void

  // Actions
  refreshData: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshSummary: () => Promise<void>
}



export function useTransactions(timeframe: 'week' | 'month' | 'year' = 'month'): UseTransactionsReturn {
  const { transactions: apiTransactions, isLoading: isTransactionsLoading, error: transactionsError, refetch: refetchTransactions } = useTransactionsRTK()
  const { summary: apiSummary, isLoading: isSummaryLoading, error: summaryError, refetch: refetchSummary } = useTransactionSummary(timeframe)

  // Transform API transactions to match interface
  const transactions = useMemo(() => {
    return apiTransactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      category: t.category,
      createdAt: new Date(t.createdAt),
      status: t.status,
      sender: t.sender,
      recipient: t.recipient
    }))
  }, [apiTransactions])

  // Transform API summary to match interface
  const transactionSummary = useMemo(() => {
    if (!apiSummary) return null

    return {
      totalAmount: 0, // Will be calculated from transactions
      totalTransactions: transactions.length,
      averageAmount: transactions.length > 0 ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
      topCategories: [] // Will be calculated from transactions if needed
    }
  }, [apiSummary, transactions])

  // Refresh functions
  const refreshTransactions = useCallback(async () => {
    await refetchTransactions()
  }, [refetchTransactions])

  const refreshSummary = useCallback(async () => {
    await refetchSummary()
  }, [refetchSummary])

  const refreshData = useCallback(async () => {
    await Promise.all([
      refetchTransactions(),
      refetchSummary()
    ])
  }, [refetchTransactions, refetchSummary])

  // Mock filters state (since we're using RTK query)
  const [filters, setFilters] = useState<TransactionFilters>({})

  return {
    // Data
    transactions,
    transactionSummary,

    // Loading states
    isLoading: isTransactionsLoading || isSummaryLoading,
    isTransactionsLoading,
    isSummaryLoading,

    // Error state
    error: transactionsError ? (typeof transactionsError === 'object' && 'message' in transactionsError ? String(transactionsError.message) : 'An error occurred') :
          summaryError ? (typeof summaryError === 'object' && 'message' in summaryError ? String(summaryError.message) : 'An error occurred') : null,

    // Filters
    filters,
    setFilters,

    // Actions
    refreshData,
    refreshTransactions,
    refreshSummary
  }
}

// Utility hook for transaction analytics
export function useTransactionAnalytics() {
  const { transactionSummary } = useTransactions()

  return useMemo(() => {
    if (!transactionSummary) return null

    const { totalAmount, totalTransactions, averageAmount, topCategories } = transactionSummary

    // Find top spending category
    const topCategory = topCategories.length > 0
      ? { category: topCategories[0].category, amount: topCategories[0].amount }
      : { category: 'None', amount: 0 }

    // Calculate spending velocity (transactions per day)
    const spendingVelocity = totalTransactions / 30 // Assuming monthly data

    return {
      totalAmount,
      totalCount: totalTransactions,
      averageAmount: Math.round(averageAmount * 100) / 100,
      topCategory,
      spendingVelocity: Math.round(spendingVelocity * 100) / 100,
      categoryBreakdown: topCategories
    }
  }, [transactionSummary])
}
