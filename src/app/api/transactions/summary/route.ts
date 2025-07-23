/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/transactions/summary - Get transaction summary statistics
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

    // Build where clause
    const whereClause: any = {
      userId: user.id,
      createdAt: {
        gte: startDate,
        lte: now,
      },
    }

    if (walletId) {
      whereClause.walletId = walletId
    }

    // Get transaction statistics
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
    const typeBreakdown = transactionsByType.map((item) => ({
      type: item.type,
      count: item._count.type,
      amount: Number(item._sum.amount) || 0,
    }))

    // Format transactions by category
    const categoryBreakdown = transactionsByCategory.map((item) => ({
      category: item.category,
      count: item._count.category,
      amount: Number(item._sum.amount) || 0,
    }))

    const summary = {
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
      recent: recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        description: t.description,
        status: t.status,
        createdAt: t.createdAt,
        wallet: t.wallet,
      })),
    }

    return NextResponse.json({
      success: true,
      data: summary,
      message: 'Transaction summary retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching transaction summary:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
