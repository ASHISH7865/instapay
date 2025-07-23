import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for user verification
const verifyUserSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = verifyUserSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 },
      )
    }

    const { email } = validation.data

    // Get current user to check if they're trying to send to themselves
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true },
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is trying to send to themselves
    if (currentUser.email.toLowerCase() === email.toLowerCase()) {
      return NextResponse.json(
        {
          data: {
            exists: false,
            error: 'You cannot send money to yourself',
            code: 'SELF_TRANSFER',
          },
        },
        { status: 400 },
      )
    }

    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        wallets: {
          where: { status: 'ACTIVE' },
          select: { id: true, name: true },
        },
      },
    })

    if (!recipient) {
      return NextResponse.json(
        {
          data: {
            exists: false,
            error: 'User not found in our system',
            code: 'USER_NOT_FOUND',
          },
        },
        { status: 404 },
      )
    }

    if (!recipient.isActive) {
      return NextResponse.json(
        {
          data: {
            exists: false,
            error: 'This user account is inactive',
            code: 'USER_INACTIVE',
          },
        },
        { status: 400 },
      )
    }

    if (recipient.wallets.length === 0) {
      return NextResponse.json(
        {
          data: {
            exists: false,
            error: 'This user has no active wallet',
            code: 'NO_WALLET',
          },
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      data: {
        exists: true,
        user: {
          id: recipient.id,
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          email: recipient.email,
          displayName: `${recipient.firstName} ${recipient.lastName}`,
          hasWallet: recipient.wallets.length > 0,
        },
      },
    })
  } catch (error) {
    console.error('User verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
