import { useCallback, useMemo } from 'react'
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics'

// Types for real API data
interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  totalTransactions: number
  monthlySpending: number
  weeklySpending: number
  dailySpending: number
  savingsRate: number
  projectedBalance: number
  balanceChange: number
  expenseChange?: number
}

interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }>
}

interface UseDashboardReturn {
  // Data
  dashboardStats: DashboardStats | null
  recentTransactions: Array<{
    id: string
    type: string
    amount: number
    purpose?: string
    createdAt: Date
    currency?: string
  }>
  chartData: ChartData | null
  timeSeriesChartData: ChartData | null

  // Loading states
  isLoading: boolean
  isStatsLoading: boolean
  isTransactionsLoading: boolean
  isChartLoading: boolean

  // Error states
  error: string | null

  // Actions
  refreshData: () => Promise<void>
  refreshStats: () => Promise<void>
  refreshTransactions: () => Promise<void>
  refreshChart: () => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  const { analytics, isLoading: analyticsLoading, error: analyticsError, refetch } = useDashboardAnalytics()

  // Transform analytics data to dashboard stats
  const dashboardStats = useMemo(() => {
    if (!analytics?.paymentStats) return null

    const stats = analytics.paymentStats
    const wallets = analytics.wallets || []
    const totalBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)

    return {
      totalBalance,
      totalIncome: stats.totalAmount,
      totalExpenses: stats.totalAmount * 0.6, // Estimate based on typical spending patterns
      totalTransactions: stats.totalPayments,
      monthlySpending: stats.totalAmount,
      weeklySpending: stats.totalAmount / 4,
      dailySpending: stats.totalAmount / 30,
      savingsRate: stats.successRate,
      projectedBalance: totalBalance * 1.05,
      balanceChange: stats.totalAmount * 0.4, // Net change
      expenseChange: stats.trends.amountGrowth,
    }
  }, [analytics])

  // Transform recent transactions
  const recentTransactions = useMemo(() => {
    if (!analytics?.recentTransactions) return []

    return analytics.recentTransactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      purpose: t.description,
      createdAt: new Date(t.createdAt),
      currency: t.wallet?.currency || 'USD'
    }))
  }, [analytics])

  // Generate chart data from analytics
  const chartData = useMemo(() => {
    if (!analytics?.categoryData) return null

    const categories = Object.keys(analytics.categoryData)
    const data = Object.values(analytics.categoryData).map((cat: { count: number; amount: number; percentage: number }) => cat.count || 0)
    const amounts = Object.values(analytics.categoryData).map((cat: { count: number; amount: number; percentage: number }) => cat.amount || 0)

    return {
      labels: categories,
      datasets: [
        {
          label: 'Transaction Count',
          data: data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
          ],
        },
        {
          label: 'Transaction Amount ($)',
          data: amounts,
          backgroundColor: [
            'rgba(59, 130, 246, 0.4)',
            'rgba(16, 185, 129, 0.4)',
            'rgba(245, 158, 11, 0.4)',
            'rgba(239, 68, 68, 0.4)',
            'rgba(139, 92, 246, 0.4)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
        }
      ]
    }
  }, [analytics])

  // Generate time series chart data
  const timeSeriesChartData = useMemo(() => {
    if (!analytics?.timeSeriesData) return null

    const labels = analytics.timeSeriesData.map(item => item.label)
    const amounts = analytics.timeSeriesData.map(item => item.amount)
    const counts = analytics.timeSeriesData.map(item => item.count)

    return {
      labels,
      datasets: [
        {
          label: 'Transaction Amount ($)',
          data: amounts,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Transaction Count',
          data: counts,
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
          yAxisID: 'y1',
        }
      ]
    }
  }, [analytics])

  // Refresh functions
  const refreshData = useCallback(async () => {
    await refetch()
  }, [refetch])

  const refreshStats = useCallback(async () => {
    await refetch()
  }, [refetch])

  const refreshTransactions = useCallback(async () => {
    await refetch()
  }, [refetch])

  const refreshChart = useCallback(async () => {
    await refetch()
  }, [refetch])

  return {
    // Data
    dashboardStats,
    recentTransactions,
    chartData,
    timeSeriesChartData,

    // Loading states
    isLoading: analyticsLoading,
    isStatsLoading: analyticsLoading,
    isTransactionsLoading: analyticsLoading,
    isChartLoading: analyticsLoading,

    // Error state
    error: analyticsError ? (typeof analyticsError === 'object' && 'message' in analyticsError ? String(analyticsError.message) : 'An error occurred') : null,

    // Actions
    refreshData,
    refreshStats,
    refreshTransactions,
    refreshChart
  }
}

// Additional utility hook for AI insights
export function useAIInsights() {
  const { dashboardStats } = useDashboard()

  return useMemo(() => {
    if (!dashboardStats) return null

    const savingsRate = dashboardStats.totalIncome > 0
      ? ((dashboardStats.totalIncome - dashboardStats.totalExpenses) / dashboardStats.totalIncome * 100)
      : 0

    const spendingTrend = dashboardStats.expenseChange || 0
    const projectedSavings = dashboardStats.totalBalance * 1.05

    return {
      savingsRate: Math.round(savingsRate),
      spendingTrend,
      projectedSavings: Math.round(projectedSavings),
      insight: savingsRate > 20 ? 'excellent' : savingsRate > 10 ? 'good' : 'needs_attention'
    }
  }, [dashboardStats])
}
