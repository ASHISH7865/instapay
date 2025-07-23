import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/transactions/[transactionId] - Get specific transaction
export async function GET(request: NextRequest, { params }: { params: { transactionId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId } = params

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Get transaction and verify ownership
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
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
        paymentMethod: {
          select: {
            id: true,
            type: true,
            last4: true,
            brand: true,
          },
        },
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: transaction,
      message: 'Transaction retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/transactions/[transactionId] - Update transaction
export async function PUT(request: NextRequest, { params }: { params: { transactionId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId } = params
    const body = await request.json()
    const { description, category, tags, merchantName } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Get transaction and verify ownership
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 },
      )
    }

    // Only allow updating certain fields (not amount, type, etc.)
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        description: description || existingTransaction.description,
        category: category || existingTransaction.category,
        tags: tags || existingTransaction.tags,
        merchantName: merchantName || existingTransaction.merchantName,
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

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully',
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/transactions/[transactionId] - Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { transactionId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId } = params

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    // Get transaction and verify ownership
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: user.id,
      },
    })

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 },
      )
    }

    // Only allow deletion of pending transactions
    if (transaction.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete completed transactions' },
        { status: 400 },
      )
    }

    // Delete transaction
    await prisma.transaction.delete({
      where: { id: transactionId },
    })

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
