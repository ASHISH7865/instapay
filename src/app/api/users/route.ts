import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/users - Get current user profile
export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        address: true,
        wallets: {
          where: { isDefault: true },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User profile retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/users - Create new user profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      email,
      username,
      firstName,
      lastName,
      displayName,
      avatar,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
    } = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User profile already exists' },
        { status: 409 },
      )
    }

    // Check if email or username is already taken
    const emailExists = await prisma.user.findUnique({
      where: { email },
    })

    if (emailExists) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 },
      )
    }

    const usernameExists = await prisma.user.findUnique({
      where: { username },
    })

    if (usernameExists) {
      return NextResponse.json(
        { success: false, message: 'Username already taken' },
        { status: 409 },
      )
    }

    // Create user profile
    const user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        username,
        firstName,
        lastName,
        displayName,
        avatar,
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address: address
          ? {
              create: address,
            }
          : undefined,
      },
      include: {
        address: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: 'User profile created successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/users - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, displayName, avatar, phoneNumber, dateOfBirth, gender, address } =
      body

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        firstName,
        lastName,
        displayName,
        avatar,
        phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address: address
          ? {
              upsert: {
                create: address,
                update: address,
              },
            }
          : undefined,
      },
      include: {
        address: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User profile updated successfully',
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
