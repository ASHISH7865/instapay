import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { compare } from 'bcryptjs'

// Validation schema for send money request
const sendMoneySchema = z.object({
  recipientEmail: z.string().email('Invalid recipient email'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(255, 'Description too long'),
  walletId: z.string().uuid('Invalid wallet ID'),
  pin: z.string().length(4, 'PIN must be 4 digits'),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = sendMoneySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 },
      )
    }

    const { recipientEmail, amount, description, walletId, pin } = validation.data

    // Get sender user and wallet
    const sender = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        wallets: {
          where: { id: walletId, status: 'ACTIVE' },
        },
      },
    })

    if (!sender) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (sender.wallets.length === 0) {
      return NextResponse.json({ error: 'Wallet not found or inactive' }, { status: 404 })
    }

    const senderWallet = sender.wallets[0]
    // Verify PIN
    if (!(await compare(pin, senderWallet.pin))) {
      // Increment PIN attempts
      await prisma.wallet.update({
        where: { id: walletId },
        data: {
          pinAttempts: { increment: 1 },
          pinLockedUntil:
            senderWallet.pinAttempts >= 2 ? new Date(Date.now() + 15 * 60 * 1000) : null, // Lock for 15 minutes after 3 attempts
        },
      })

      return NextResponse.json({ message: 'Invalid PIN' }, { status: 400 })
    }

    // Check if wallet is locked
    if (senderWallet.pinLockedUntil && senderWallet.pinLockedUntil > new Date()) {
      return NextResponse.json(
        { message: 'Wallet is temporarily locked due to too many PIN attempts' },
        { status: 400 },
      )
    }

    // Check balance
    if (senderWallet.availableBalance.toNumber() < amount) {
      return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 })
    }

    // Check daily/monthly limits
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const dailySpent = await prisma.transaction.aggregate({
      where: {
        walletId,
        type: 'TRANSFER',
        createdAt: { gte: startOfDay },
        status: { in: ['COMPLETED', 'PROCESSING'] },
      },
      _sum: { amount: true },
    })

    const monthlySpent = await prisma.transaction.aggregate({
      where: {
        walletId,
        type: 'TRANSFER',
        createdAt: { gte: startOfMonth },
        status: { in: ['COMPLETED', 'PROCESSING'] },
      },
      _sum: { amount: true },
    })

    const dailyTotal = (dailySpent._sum.amount?.toNumber() || 0) + amount
    const monthlyTotal = (monthlySpent._sum.amount?.toNumber() || 0) + amount

    if (senderWallet.dailySpendLimit && dailyTotal > senderWallet.dailySpendLimit.toNumber()) {
      return NextResponse.json({ message: 'Daily spending limit exceeded' }, { status: 400 })
    }

    if (
      senderWallet.monthlySpendLimit &&
      monthlyTotal > senderWallet.monthlySpendLimit.toNumber()
    ) {
      return NextResponse.json({ message: 'Monthly spending limit exceeded' }, { status: 400 })
    }

    // Find recipient
    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail },
      include: {
        wallets: {
          where: { status: 'ACTIVE', isDefault: true },
        },
      },
    })

    if (!recipient) {
      return NextResponse.json({ message: 'Recipient not found' }, { status: 404 })
    }

    if (recipient.id === sender.id) {
      return NextResponse.json({ message: 'Cannot send money to yourself' }, { status: 400 })
    }

    if (recipient.wallets.length === 0) {
      return NextResponse.json({ message: 'Recipient has no active wallet' }, { status: 400 })
    }

    const recipientWallet = recipient.wallets[0]

    // Create transaction in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create sender transaction (outgoing)
      const senderTransaction = await tx.transaction.create({
        data: {
          type: 'TRANSFER',
          category: 'TRANSFER',
          amount,
          currency: senderWallet.currency,
          fee: 0, // No fee for internal transfers
          netAmount: amount,
          userId: sender.id,
          walletId: senderWallet.id,
          senderId: sender.id,
          recipientId: recipient.id,
          balanceBefore: senderWallet.balance,
          balanceAfter: senderWallet.balance.toNumber() - amount,
          status: 'COMPLETED',
          description,
          processedAt: new Date(),
          metadata: {
            transferType: 'internal',
            recipientEmail,
          },
        },
      })

      // Create recipient transaction (incoming)
      const recipientTransaction = await tx.transaction.create({
        data: {
          type: 'TRANSFER',
          category: 'TRANSFER',
          amount,
          currency: recipientWallet.currency,
          fee: 0,
          netAmount: amount,
          userId: recipient.id,
          walletId: recipientWallet.id,
          senderId: sender.id,
          recipientId: recipient.id,
          balanceBefore: recipientWallet.balance,
          balanceAfter: recipientWallet.balance.toNumber() + amount,
          status: 'COMPLETED',
          description: `Received from ${sender.firstName} ${sender.lastName}`,
          processedAt: new Date(),
          metadata: {
            transferType: 'internal',
            senderEmail: sender.email,
          },
        },
      })

      // Update sender wallet balance
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: {
          balance: { decrement: amount },
          availableBalance: { decrement: amount },
          pinAttempts: 0, // Reset PIN attempts on successful transaction
        },
      })

      // Update recipient wallet balance
      await tx.wallet.update({
        where: { id: recipientWallet.id },
        data: {
          balance: { increment: amount },
          availableBalance: { increment: amount },
        },
      })

      // Create notifications
      await tx.notification.createMany({
        data: [
          {
            userId: sender.id,
            type: 'TRANSACTION',
            title: 'Money Sent Successfully',
            message: `Successfully sent $${amount} to ${recipient.firstName} ${recipient.lastName}`,
            channels: ['IN_APP'],
            metadata: { transactionId: senderTransaction.id },
          },
          {
            userId: recipient.id,
            type: 'TRANSACTION',
            title: 'Money Received',
            message: `You received $${amount} from ${sender.firstName} ${sender.lastName}`,
            channels: ['IN_APP'],
            metadata: { transactionId: recipientTransaction.id },
          },
        ],
      })

      return { senderTransaction, recipientTransaction }
    })

    return NextResponse.json({
      success: true,
      transaction: result.senderTransaction,
      message: `Successfully sent $${amount} to ${recipient.firstName} ${recipient.lastName}`,
    })
  } catch (error) {
    console.error('Send money error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// Get send money history
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const walletId = searchParams.get('walletId')

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const whereClause: {
      userId: string
      type: 'TRANSFER'
      senderId: string
      walletId?: string
    } = {
      userId: user.id,
      type: 'TRANSFER',
      senderId: user.id, // Only outgoing transfers
    }

    if (walletId) {
      whereClause.walletId = walletId
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          recipient: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          wallet: {
            select: {
              name: true,
              currency: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where: whereClause }),
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get send money history error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
