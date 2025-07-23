import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { compare } from 'bcryptjs'

// GET /api/wallets/[walletId]/balance - Get wallet balance
export async function GET(request: NextRequest, { params }: { params: { walletId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { walletId } = params

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
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

    return NextResponse.json({
      success: true,
      data: {
        id: wallet.id,
        name: wallet.name,
        balance: wallet.balance,
        availableBalance: wallet.availableBalance,
        currency: wallet.currency,
        status: wallet.status,
      },
      message: 'Wallet balance retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching wallet balance:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/wallets/[walletId]/balance - Update wallet balance (deposit/withdraw)
export async function POST(request: NextRequest, { params }: { params: { walletId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { walletId } = params
    const body = await request.json()
    const { amount, type, pin, description } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
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

    // Verify PIN
    const isPinValid = await compare(pin, wallet.pin)
    if (!isPinValid) {
      // Increment PIN attempts
      await prisma.wallet.update({
        where: { id: walletId },
        data: {
          pinAttempts: wallet.pinAttempts + 1,
          pinLockedUntil: wallet.pinAttempts >= 2 ? new Date(Date.now() + 30 * 60 * 1000) : null, // Lock for 30 minutes after 3 failed attempts
        },
      })

      return NextResponse.json({ success: false, message: 'Invalid PIN' }, { status: 401 })
    }

    // Check if wallet is locked
    if (wallet.pinLockedUntil && wallet.pinLockedUntil > new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Wallet is temporarily locked due to too many failed PIN attempts',
        },
        { status: 423 },
      )
    }

    // Reset PIN attempts on successful verification
    await prisma.wallet.update({
      where: { id: walletId },
      data: { pinAttempts: 0, pinLockedUntil: null },
    })

    // Validate amount
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 })
    }

    // Check withdrawal limits
    if (type === 'WITHDRAWAL') {
      if (numAmount > Number(wallet.availableBalance)) {
        return NextResponse.json(
          { success: false, message: 'Insufficient balance' },
          { status: 400 },
        )
      }

      if (wallet.dailySpendLimit && numAmount > Number(wallet.dailySpendLimit)) {
        return NextResponse.json(
          { success: false, message: 'Amount exceeds daily spending limit' },
          { status: 400 },
        )
      }

      if (wallet.monthlySpendLimit && numAmount > Number(wallet.monthlySpendLimit)) {
        return NextResponse.json(
          { success: false, message: 'Amount exceeds monthly spending limit' },
          { status: 400 },
        )
      }
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get current wallet state
      const currentWallet = await tx.wallet.findUnique({
        where: { id: walletId },
      })

      if (!currentWallet) {
        throw new Error('Wallet not found')
      }

      const balanceBefore = Number(currentWallet.balance)
      let balanceAfter = balanceBefore

      // Calculate new balance
      if (type === 'DEPOSIT') {
        balanceAfter = balanceBefore + numAmount
      } else if (type === 'WITHDRAWAL') {
        balanceAfter = balanceBefore - numAmount
      }

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: walletId },
        data: {
          balance: balanceAfter,
          availableBalance: balanceAfter,
        },
      })

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          walletId: walletId,
          type: type,
          category: type === 'DEPOSIT' ? 'INCOME' : 'ATM_CASH',
          amount: numAmount,
          currency: wallet.currency,
          fee: 0,
          netAmount: numAmount,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          status: 'COMPLETED',
          description: description || `${type.toLowerCase()} transaction`,
          reference: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          processedAt: new Date(),
        },
      })

      return { updatedWallet, transaction }
    })

    return NextResponse.json({
      success: true,
      data: {
        wallet: result.updatedWallet,
        transaction: result.transaction,
      },
      message: `${type.toLowerCase()} successful`,
    })
  } catch (error) {
    console.error('Error updating wallet balance:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
