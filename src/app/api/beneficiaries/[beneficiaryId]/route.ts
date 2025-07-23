import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for updating beneficiaries
const updateBeneficiarySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits').optional(),
  relationship: z.enum(['family', 'friend', 'business', 'other']).optional(),
  nickname: z.string().max(30, 'Nickname must be less than 30 characters').optional(),
  isFavorite: z.boolean().optional(),
  isActive: z.boolean().optional()
})

// GET /api/beneficiaries/[beneficiaryId] - Get a specific beneficiary
export async function GET(
  request: NextRequest,
  { params }: { params: { beneficiaryId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { beneficiaryId } = params

    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        id: beneficiaryId,
        userId: user.id,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        relationship: true,
        nickname: true,
        isActive: true,
        isFavorite: true,
        lastUsedAt: true,
        totalTransactions: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!beneficiary) {
      return NextResponse.json(
        { error: 'Beneficiary not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(beneficiary)
  } catch (error) {
    console.error('Error fetching beneficiary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/beneficiaries/[beneficiaryId] - Update a beneficiary
export async function PUT(
  request: NextRequest,
  { params }: { params: { beneficiaryId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { beneficiaryId } = params
    const body = await request.json()

    // Validate input
    const validatedData = updateBeneficiarySchema.parse(body)

    // Check if beneficiary exists and belongs to user
    const existingBeneficiary = await prisma.beneficiary.findFirst({
      where: {
        id: beneficiaryId,
        userId: user.id,
        isActive: true
      }
    })

    if (!existingBeneficiary) {
      return NextResponse.json(
        { error: 'Beneficiary not found' },
        { status: 404 }
      )
    }

    // Check if email is being updated and if it conflicts with another beneficiary
    if (validatedData.email && validatedData.email !== existingBeneficiary.email) {
      const emailConflict = await prisma.beneficiary.findFirst({
        where: {
          userId: user.id,
          email: validatedData.email,
          id: { not: beneficiaryId },
          isActive: true
        }
      })

      if (emailConflict) {
        return NextResponse.json(
          { error: 'A beneficiary with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Update beneficiary
    const updatedBeneficiary = await prisma.beneficiary.update({
      where: {
        id: beneficiaryId
      },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        relationship: true,
        nickname: true,
        isActive: true,
        isFavorite: true,
        lastUsedAt: true,
        totalTransactions: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(updatedBeneficiary)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating beneficiary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/beneficiaries/[beneficiaryId] - Soft delete a beneficiary
export async function DELETE(
  request: NextRequest,
  { params }: { params: { beneficiaryId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { beneficiaryId } = params

    // Check if beneficiary exists and belongs to user
    const existingBeneficiary = await prisma.beneficiary.findFirst({
      where: {
        id: beneficiaryId,
        userId: user.id,
        isActive: true
      }
    })

    if (!existingBeneficiary) {
      return NextResponse.json(
        { error: 'Beneficiary not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.beneficiary.update({
      where: {
        id: beneficiaryId
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json(
      { message: 'Beneficiary deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting beneficiary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
