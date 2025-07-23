/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/analytics/wallet - Get wallet analytics
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || 'month' // week, month, year
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
    let startDate: Date

    switch (timeframe) {
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

    // Build where clause for transactions
    const whereClause: any = {
      userId: user.id,
      createdAt: {
        gte: startDate,
        lte: now,
      },
      status: 'COMPLETED',
    }

    if (walletId) {
      whereClause.walletId = walletId
    }

    // Get all transactions for the period
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    })

    // Calculate metrics
    const totalIncome = transactions
      .filter((t) => t.type === 'DEPOSIT' || t.category === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpenses = transactions
      .filter((t) => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalBalance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0

    // Get spending by category
    const categorySpending = transactions
      .filter((t) => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT')
      .reduce(
        (acc, t) => {
          const category = t.category || 'OTHER'
          if (!acc[category]) {
            acc[category] = { amount: 0, count: 0 }
          }
          acc[category].amount += Number(t.amount)
          acc[category].count += 1
          return acc
        },
        {} as Record<string, { amount: number; count: number }>,
      )

    // Convert to array and calculate percentages
    const topCategories = Object.entries(categorySpending)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Get spending trend (daily for week, weekly for month, monthly for year)
    const spendingTrend = await getSpendingTrend(whereClause, timeframe)

    // Get current wallet balances
    const wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        balance: true,
        availableBalance: true,
        currency: true,
      },
    })

    const totalWalletBalance = wallets.reduce((sum, w) => sum + Number(w.balance), 0)
    const totalAvailableBalance = wallets.reduce((sum, w) => sum + Number(w.availableBalance), 0)

    // Calculate projected balance (simple projection based on current savings rate)
    const projectedBalance = totalWalletBalance + totalBalance * 0.8 // Conservative projection

    const analytics = {
      totalBalance: totalWalletBalance,
      availableBalance: totalAvailableBalance,
      totalTransactions: transactions.length,
      monthlySpending:
        timeframe === 'month' ? totalExpenses : totalExpenses * (30 / getDaysInPeriod(timeframe)),
      weeklySpending:
        timeframe === 'week' ? totalExpenses : totalExpenses / getWeeksInPeriod(timeframe),
      dailySpending: totalExpenses / getDaysInPeriod(timeframe),
      topCategories,
      spendingTrend,
      monthlyIncome:
        timeframe === 'month' ? totalIncome : totalIncome * (30 / getDaysInPeriod(timeframe)),
      savingsRate,
      projectedBalance,
      totalIncome,
      totalExpenses,
      balanceChange: totalBalance,
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Wallet analytics retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching wallet analytics:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to get spending trend
async function getSpendingTrend(whereClause: any, timeframe: string) {
  const trend = []
  const now = new Date()

  if (timeframe === 'week') {
    // Daily spending for the last 7 days
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

      const daySpending = dayTransactions
        .filter((t) => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      trend.push({
        date: startOfDay.toISOString().split('T')[0],
        amount: daySpending,
      })
    }
  } else if (timeframe === 'month') {
    // Weekly spending for the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const weeksInMonth = Math.ceil(
      (now.getTime() - startOfMonth.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )

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

      const weekSpending = weekTransactions
        .filter((t) => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      trend.push({
        date: `Week ${i + 1}`,
        amount: weekSpending,
      })
    }
  } else {
    // Monthly spending for the current year
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

      const monthSpending = monthTransactions
        .filter((t) => t.type === 'WITHDRAWAL' || t.type === 'PAYMENT')
        .reduce((sum, t) => sum + Number(t.amount), 0)

      trend.push({
        date: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthSpending,
      })
    }
  }

  return trend
}

// Helper functions
function getDaysInPeriod(timeframe: string): number {
  switch (timeframe) {
    case 'week':
      return 7
    case 'month':
      return 30
    case 'year':
      return 365
    default:
      return 30
  }
}

function getWeeksInPeriod(timeframe: string): number {
  switch (timeframe) {
    case 'week':
      return 1
    case 'month':
      return 4
    case 'year':
      return 52
    default:
      return 4
  }
}
