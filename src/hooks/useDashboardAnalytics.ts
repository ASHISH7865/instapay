'use client'

import { useAuth } from '@clerk/nextjs'
import { useGetDashboardAnalyticsQuery, type DashboardFilters } from '@/lib/store/slices/dashboardApi'

// Hook for getting dashboard analytics
export function useDashboardAnalytics(filters: DashboardFilters = {}) {
  const { userId } = useAuth()

  const { data, isLoading, error, refetch } = useGetDashboardAnalyticsQuery(filters, {
    skip: !userId,
  })

  return {
    analytics: data?.data,
    isLoading,
    error,
    refetch,
  }
}

// Hook for getting payment statistics specifically
export function usePaymentStats(timeframe: string = 'month', walletId?: string) {
  const { analytics, isLoading, error } = useDashboardAnalytics({ timeframe, walletId })

  return {
    paymentStats: analytics?.paymentStats,
    isLoading,
    error,
  }
}

// Hook for getting category data
export function useCategoryData(timeframe: string = 'month', walletId?: string) {
  const { analytics, isLoading, error } = useDashboardAnalytics({ timeframe, walletId })

  return {
    categoryData: analytics?.categoryData,
    isLoading,
    error,
  }
}

// Hook for getting insights
export function useInsights(timeframe: string = 'month', walletId?: string) {
  const { analytics, isLoading, error } = useDashboardAnalytics({ timeframe, walletId })

  return {
    insights: analytics?.insights,
    isLoading,
    error,
  }
}

// Hook for getting trends
export function useTrends(timeframe: string = 'month', walletId?: string) {
  const { analytics, isLoading, error } = useDashboardAnalytics({ timeframe, walletId })

  return {
    trends: analytics?.trends,
    isLoading,
    error,
  }
}
