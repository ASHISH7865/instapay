import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

// GET /api/wallets - Get user's wallets
export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Get user's wallets
    const wallets = await prisma.wallet.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    })

    return NextResponse.json({
      success: true,
      data: wallets,
      message: 'Wallets retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching wallets:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/wallets - Create new wallet
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      type = 'PERSONAL',
      currency = 'USD',
      pin,
      dailySpendLimit,
      monthlySpendLimit,
      transactionLimit = 5000,
      isDefault = false,
    } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Hash the PIN
    const hashedPin = await hash(pin, 12)

    // If this is the default wallet, unset other default wallets
    if (isDefault) {
      await prisma.wallet.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    // Create the wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name,
        type,
        currency,
        pin: hashedPin,
        dailySpendLimit: dailySpendLimit ? parseFloat(dailySpendLimit) : null,
        monthlySpendLimit: monthlySpendLimit ? parseFloat(monthlySpendLimit) : null,
        transactionLimit: parseFloat(transactionLimit),
        isDefault,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: wallet,
        message: 'Wallet created successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating wallet:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
