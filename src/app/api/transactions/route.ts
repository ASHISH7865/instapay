/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/transactions - Get user's transactions with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // Query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const walletId = searchParams.get('walletId') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const minAmount = searchParams.get('minAmount') || ''
    const maxAmount = searchParams.get('maxAmount') || ''

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Build where clause
    const whereClause: Record<string, unknown> = {
      userId: user.id,
    }

    // Add filters
    if (search) {
      whereClause.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { merchantName: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type) {
      whereClause.type = type
    }

    if (category) {
      whereClause.category = category
    }

    if (status) {
      whereClause.status = status
    }

    if (walletId) {
      whereClause.walletId = walletId
    }

    if (startDate || endDate) {
      (whereClause as any).createdAt = {}
      if (startDate) {
        (whereClause as any).createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        (whereClause as any).createdAt.lte = new Date(endDate)
      }
    }

    if (minAmount || maxAmount) {
      (whereClause as any).amount = {}
      if (minAmount) {
        (whereClause as any).amount.gte = parseFloat(minAmount)
      }
      if (maxAmount) {
        (whereClause as any).amount.lte = parseFloat(maxAmount)
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get transactions with pagination
    const [transactions, totalCount] = await Promise.all([
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
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: whereClause }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      },
      message: 'Transactions retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      category,
      amount,
      currency,
      description,
      walletId,
      recipientId,
      merchantName,
      tags = [],
      scheduledAt,
    } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Validate required fields
    if (!type || !amount || !walletId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Get wallet and verify ownership
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: user.id,
      },
    })

    if (!wallet) {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 })
    }

    // For transfers, validate recipient
    if (type === 'TRANSFER' && recipientId) {
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
      })

      if (!recipient) {
        return NextResponse.json(
          { success: false, message: 'Recipient not found' },
          { status: 404 },
        )
      }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        walletId,
        type,
        category: category || 'OTHER',
        amount: parseFloat(amount),
        currency: currency || wallet.currency,
        description: description || `${type.toLowerCase()} transaction`,
        reference: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        merchantName,
        tags,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: 'PENDING',
        balanceBefore: Number(wallet.balance),
        balanceAfter: Number(wallet.balance), // Will be updated when processed
        fee: 0,
        netAmount: parseFloat(amount),
      },
      include: {
        wallet: {
          select: {
            id: true,
            name: true,
            currency: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: transaction,
        message: 'Transaction created successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
