import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const createBeneficiarySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address').optional(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits').optional(),
  relationship: z.enum(['family', 'friend', 'business', 'other']).default('other'),
  nickname: z.string().max(30, 'Nickname must be less than 30 characters').optional(),
  isFavorite: z.boolean().default(false)
})



// GET /api/beneficiaries - Get all beneficiaries for the user
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const favoritesOnly = searchParams.get('favorites') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      userId: string
      isActive: boolean
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
        phoneNumber?: { contains: string; mode: 'insensitive' }
        nickname?: { contains: string; mode: 'insensitive' }
      }>
      relationship?: string
      isFavorite?: boolean
    } = {
      userId: user.id,
      isActive: true
    }

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Add category filter
    if (category && category !== 'all') {
      where.relationship = category
    }

    // Add favorites filter
    if (favoritesOnly) {
      where.isFavorite = true
    }

    // Get beneficiaries with pagination
    const [beneficiaries, totalCount] = await Promise.all([
      prisma.beneficiary.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit,
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
      }),
      prisma.beneficiary.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      beneficiaries,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (error) {
    console.error('Error fetching beneficiaries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/beneficiaries - Create a new beneficiary
export async function POST(request: NextRequest) {
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

    const body = await request.json()

    // Validate input
    const validatedData = createBeneficiarySchema.parse(body)

    // Check if beneficiary with same email already exists (if email provided)
    if (validatedData.email) {
      const existingBeneficiary = await prisma.beneficiary.findFirst({
        where: {
          userId: user.id,
          email: validatedData.email,
          isActive: true
        }
      })

      if (existingBeneficiary) {
        return NextResponse.json(
          { error: 'A beneficiary with this email already exists' },
          { status: 409 }
        )
      }
    }

    // Create beneficiary
    const beneficiary = await prisma.beneficiary.create({
      data: {
        userId: user.id,
        ...validatedData
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

    return NextResponse.json(beneficiary, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating beneficiary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
