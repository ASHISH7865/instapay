/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/dashboard/analytics - Get comprehensive dashboard analytics
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'month' // week, month, year, all
    const walletId = searchParams.get('walletId') // Optional: specific wallet

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Calculate date range based on timeframe
    const now = new Date()
    let startDate: Date | null = null

    if (timeframe !== 'all') {
      switch (timeframe) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }
    }

    // Build where clause for transactions
    const whereClause: any = {
      userId: user.id,
    }

    if (startDate) {
      whereClause.createdAt = {
        gte: startDate,
        lte: now,
      }
    }

    if (walletId) {
      whereClause.walletId = walletId
    }

    // Get comprehensive transaction data using existing APIs
    const [
      allTransactions,
      wallets,
      previousPeriodTransactions,
      transactionSummary,
    ] = await Promise.all([
      // All transactions for the period
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          wallet: {
            select: {
              id: true,
              name: true,
              currency: true,
            },
          },
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          recipient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // User's wallets
      prisma.wallet.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          balance: true,
          availableBalance: true,
          currency: true,
          isDefault: true,
        },
      }),

      // Previous period transactions for trend calculation
      getPreviousPeriodTransactions(startDate, now, user.id, walletId),

      // Get transaction summary using existing API logic
      getTransactionSummary(whereClause),
    ])

        // Calculate proper change percentages by comparing with previous period
    const previousPeriodStats = await getTransactionSummary({
      userId: user.id,
      createdAt: {
        gte: startDate ? new Date(startDate.getTime() - (now.getTime() - startDate.getTime())) : null,
        lt: startDate || null,
      },
      ...(walletId && { walletId }),
    })

    // Calculate current period stats
    const currentTotalPayments = transactionSummary.overview.totalTransactions
    const currentTotalAmount = transactionSummary.financial.totalIncome + transactionSummary.financial.totalExpenses
    const currentSuccessRate = transactionSummary.overview.successRate

    // Calculate previous period stats
    const previousTotalPayments = previousPeriodStats.overview.totalTransactions
    const previousTotalAmount = previousPeriodStats.financial.totalIncome + previousPeriodStats.financial.totalExpenses
    const previousSuccessRate = previousPeriodStats.overview.successRate

    // Calculate proper growth percentages
    const paymentGrowth = previousTotalPayments > 0
      ? Math.round(((currentTotalPayments - previousTotalPayments) / previousTotalPayments) * 100)
      : currentTotalPayments > 0 ? 100 : 0

    const amountGrowth = previousTotalAmount > 0
      ? Math.round(((currentTotalAmount - previousTotalAmount) / previousTotalAmount) * 100)
      : currentTotalAmount > 0 ? 100 : 0

    const successRateGrowth = previousSuccessRate > 0
      ? Math.round(currentSuccessRate - previousSuccessRate)
      : currentSuccessRate > 0 ? currentSuccessRate : 0

    // Use transaction summary data for payment statistics
    const paymentStats = {
      totalPayments: currentTotalPayments,
      totalAmount: currentTotalAmount,
      successfulPayments: transactionSummary.overview.completedTransactions,
      pendingPayments: transactionSummary.overview.pendingTransactions,
      failedPayments: transactionSummary.overview.failedTransactions,
      successRate: currentSuccessRate,
      averagePayment: transactionSummary.financial.averageTransaction,
      uniqueRecipients: new Set(
        allTransactions
          .map((t: any) => t.recipientId || t.senderId)
          .filter(Boolean)
      ).size,
      trends: {
        paymentGrowth,
        amountGrowth,
        successRateGrowth,
      },
    }

    // Enhanced category data with amounts and percentages
    const categoryBreakdown = transactionSummary.breakdown.byType || []
    const totalTransactions = categoryBreakdown.reduce((sum, t) => sum + t.count, 0)

    const categoryData = {
      'Transfer': {
        count: categoryBreakdown.find(t => t.type === 'TRANSFER')?.count || 0,
        amount: categoryBreakdown.find(t => t.type === 'TRANSFER')?.amount || 0,
        percentage: totalTransactions > 0 ? Math.round((categoryBreakdown.find(t => t.type === 'TRANSFER')?.count || 0) / totalTransactions * 100) : 0
      },
      'Payment': {
        count: categoryBreakdown.find(t => t.type === 'PAYMENT')?.count || 0,
        amount: categoryBreakdown.find(t => t.type === 'PAYMENT')?.amount || 0,
        percentage: totalTransactions > 0 ? Math.round((categoryBreakdown.find(t => t.type === 'PAYMENT')?.count || 0) / totalTransactions * 100) : 0
      },
      'Top Up': {
        count: categoryBreakdown.find(t => t.type === 'DEPOSIT')?.count || 0,
        amount: categoryBreakdown.find(t => t.type === 'DEPOSIT')?.amount || 0,
        percentage: totalTransactions > 0 ? Math.round((categoryBreakdown.find(t => t.type === 'DEPOSIT')?.count || 0) / totalTransactions * 100) : 0
      },
      'Withdrawal': {
        count: categoryBreakdown.find(t => t.type === 'WITHDRAWAL')?.count || 0,
        amount: categoryBreakdown.find(t => t.type === 'WITHDRAWAL')?.amount || 0,
        percentage: totalTransactions > 0 ? Math.round((categoryBreakdown.find(t => t.type === 'WITHDRAWAL')?.count || 0) / totalTransactions * 100) : 0
      },
      'Other': {
        count: categoryBreakdown.filter(t => !['TRANSFER', 'PAYMENT', 'DEPOSIT', 'WITHDRAWAL'].includes(t.type)).reduce((sum, t) => sum + t.count, 0),
        amount: categoryBreakdown.filter(t => !['TRANSFER', 'PAYMENT', 'DEPOSIT', 'WITHDRAWAL'].includes(t.type)).reduce((sum, t) => sum + t.amount, 0),
        percentage: totalTransactions > 0 ? Math.round(categoryBreakdown.filter(t => !['TRANSFER', 'PAYMENT', 'DEPOSIT', 'WITHDRAWAL'].includes(t.type)).reduce((sum, t) => sum + t.count, 0) / totalTransactions * 100) : 0
      }
    }

    // Calculate trends
    const trends = calculateTrends(allTransactions, previousPeriodTransactions)

    // Generate time-series data for charts
    const timeSeriesData = await generateTimeSeriesData(whereClause, timeframe)

    // Calculate insights
    const insights = calculateInsights(allTransactions, paymentStats)

    // Get unique recipients
    const uniqueRecipients = new Set(
      allTransactions
        .map(t => t.recipientId || t.senderId)
        .filter(Boolean)
    ).size

    const analytics = {
      paymentStats: {
        ...paymentStats,
        uniqueRecipients,
      },
      categoryData,
      trends,
      insights,
      timeSeriesData,
      wallets,
      recentTransactions: allTransactions.slice(0, 10),
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Dashboard analytics retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to get transaction summary using existing API logic
async function getTransactionSummary(whereClause: any) {
  const [
    totalTransactions,
    completedTransactions,
    pendingTransactions,
    failedTransactions,
    totalIncome,
    totalExpenses,
    transactionsByType,
    transactionsByCategory,
    recentTransactions,
  ] = await Promise.all([
    // Total transactions
    prisma.transaction.count({ where: whereClause }),

    // Completed transactions
    prisma.transaction.count({
      where: { ...whereClause, status: 'COMPLETED' },
    }),

    // Pending transactions
    prisma.transaction.count({
      where: { ...whereClause, status: 'PENDING' },
    }),

    // Failed transactions
    prisma.transaction.count({
      where: { ...whereClause, status: 'FAILED' },
    }),

    // Total income
    prisma.transaction.aggregate({
      where: {
        ...whereClause,
        type: { in: ['DEPOSIT'] },
        status: 'COMPLETED',
      },
      _sum: { amount: true },
    }),

    // Total expenses
    prisma.transaction.aggregate({
      where: {
        ...whereClause,
        type: { in: ['WITHDRAWAL', 'PAYMENT'] },
        status: 'COMPLETED',
      },
      _sum: { amount: true },
    }),

    // Transactions by type
    prisma.transaction.groupBy({
      by: ['type'],
      where: whereClause,
      _count: { type: true },
      _sum: { amount: true },
    }),

    // Transactions by category
    prisma.transaction.groupBy({
      by: ['category'],
      where: whereClause,
      _count: { category: true },
      _sum: { amount: true },
    }),

    // Recent transactions
    prisma.transaction.findMany({
      where: whereClause,
      include: {
        wallet: {
          select: {
            id: true,
            name: true,
            currency: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  // Calculate additional metrics
  const income = Number(totalIncome._sum.amount) || 0
  const expenses = Number(totalExpenses._sum.amount) || 0
  const netAmount = income - expenses
  const successRate =
    totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 0

  // Format transactions by type
  const typeBreakdown = transactionsByType.map((item: any) => ({
    type: item.type,
    count: item._count.type,
    amount: Number(item._sum.amount) || 0,
  }))

  // Format transactions by category
  const categoryBreakdown = transactionsByCategory.map((item: any) => ({
    category: item.category,
    count: item._count.category,
    amount: Number(item._sum.amount) || 0,
  }))

  return {
    overview: {
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
      successRate: Math.round(successRate * 100) / 100,
    },
    financial: {
      totalIncome: income,
      totalExpenses: expenses,
      netAmount,
      averageTransaction: totalTransactions > 0 ? (income + expenses) / totalTransactions : 0,
    },
    breakdown: {
      byType: typeBreakdown,
      byCategory: categoryBreakdown,
    },
    recent: recentTransactions.map((t: any) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      status: t.status,
      createdAt: t.createdAt,
      wallet: t.wallet,
    })),
  }
}

// Helper function to get previous period transactions for trend calculation
async function getPreviousPeriodTransactions(
  startDate: Date | null,
  endDate: Date,
  userId: string,
  walletId?: string | null
) {
  if (!startDate) return []

  const periodDuration = endDate.getTime() - startDate.getTime()
  const previousStartDate = new Date(startDate.getTime() - periodDuration)
  const previousEndDate = new Date(startDate.getTime())

  const whereClause: any = {
    userId,
    createdAt: {
      gte: previousStartDate,
      lt: previousEndDate,
    },
  }

  if (walletId) {
    whereClause.walletId = walletId
  }

  return prisma.transaction.findMany({
    where: whereClause,
  })
}



// Helper function to calculate trends
function calculateTrends(currentTransactions: any[], previousTransactions: any[]) {
  const currentTotal = currentTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)
  const previousTotal = previousTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const volumeGrowth = previousTotal > 0
    ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100)
    : 0

  const transactionGrowth = previousTransactions.length > 0
    ? Math.round(((currentTransactions.length - previousTransactions.length) / previousTransactions.length) * 100)
    : 0

  // Calculate peak hours
  const hourCounts = new Array(24).fill(0)
  currentTransactions.forEach(t => {
    const hour = new Date(t.createdAt).getHours()
    hourCounts[hour]++
  })
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts))

  return {
    volumeGrowth,
    transactionGrowth,
    peakHours: `${peakHour}:00`,
    averageTransactionValue: currentTransactions.length > 0
      ? Math.round(currentTotal / currentTransactions.length)
      : 0,
  }
}

// Helper function to generate time-series data for charts
async function generateTimeSeriesData(whereClause: any, timeframe: string) {
  const now = new Date()
  const data = []

  if (timeframe === 'week') {
    // Daily data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)

      const dayTransactions = await prisma.transaction.findMany({
        where: {
          ...whereClause,
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      })

      const dayAmount = dayTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      const dayCount = dayTransactions.length

      data.push({
        date: startOfDay.toISOString().split('T')[0],
        amount: dayAmount,
        count: dayCount,
        label: startOfDay.toLocaleDateString('en-US', { weekday: 'short' })
      })
    }
  } else if (timeframe === 'month') {
    // Weekly data for the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const weeksInMonth = Math.ceil((now.getTime() - startOfMonth.getTime()) / (7 * 24 * 60 * 60 * 1000))

    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(startOfMonth.getTime() + i * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

      const weekTransactions = await prisma.transaction.findMany({
        where: {
          ...whereClause,
          createdAt: {
            gte: weekStart,
            lt: weekEnd,
          },
        },
      })

      const weekAmount = weekTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      const weekCount = weekTransactions.length

      data.push({
        date: weekStart.toISOString().split('T')[0],
        amount: weekAmount,
        count: weekCount,
        label: `Week ${i + 1}`
      })
    }
  } else {
    // Monthly data for the current year
    for (let i = 0; i < now.getMonth() + 1; i++) {
      const monthStart = new Date(now.getFullYear(), i, 1)
      const monthEnd = new Date(now.getFullYear(), i + 1, 0)

      const monthTransactions = await prisma.transaction.findMany({
        where: {
          ...whereClause,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      const monthAmount = monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
      const monthCount = monthTransactions.length

      data.push({
        date: monthStart.toISOString().split('T')[0],
        amount: monthAmount,
        count: monthCount,
        label: monthStart.toLocaleDateString('en-US', { month: 'short' })
      })
    }
  }

  return data
}

// Helper function to calculate insights
function calculateInsights(transactions: any[], paymentStats: any) {
  const insights = []

  // Payment Patterns
  const hourCounts = new Array(24).fill(0)
  transactions.forEach(t => {
    const hour = new Date(t.createdAt).getHours()
    hourCounts[hour]++
  })
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts))

  insights.push({
    icon: 'Brain',
    title: 'Payment Patterns',
    value: `Peak Hours: ${peakHour}:00`,
    description: 'Most payments occur during afternoon hours',
    color: 'from-purple-500 to-purple-600',
  })

  // Growth Trend
  const growthTrend = paymentStats.trends.paymentGrowth >= 0 ? '+' : ''
  insights.push({
    icon: 'TrendingUp',
    title: 'Growth Trend',
    value: `${growthTrend}${paymentStats.trends.paymentGrowth}% Monthly`,
    description: 'Payment volume is increasing steadily',
    color: 'from-emerald-500 to-emerald-600',
  })

  // Optimization
  if (paymentStats.successRate < 90) {
    insights.push({
      icon: 'Target',
      title: 'Optimization',
      value: 'Reduce Failed Rate',
      description: 'Focus on improving payment success rate',
      color: 'from-orange-500 to-orange-600',
    })
  }

  // User Behavior
  const repeatRate = paymentStats.totalPayments > 0
    ? Math.round((paymentStats.uniqueRecipients / paymentStats.totalPayments) * 100)
    : 0

  insights.push({
    icon: 'Users',
    title: 'User Behavior',
    value: 'Repeat Customers',
    description: `${repeatRate}% are returning recipients`,
    color: 'from-blue-500 to-blue-600',
  })

  return insights
}
