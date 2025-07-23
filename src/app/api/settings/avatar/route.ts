/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

// POST /api/settings/avatar - Upload avatar
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, or WebP image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    try {
      // Convert file to base64 for Clerk
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`

      // Update avatar using Clerk
      await clerkClient.users.updateUser(userId, {
        imageUrl: dataUrl,
      } as any)

      return NextResponse.json({
        message: 'Avatar updated successfully',
        imageUrl: dataUrl
      })
    } catch (error) {
      console.error('Error updating avatar:', error)
      return NextResponse.json(
        { error: 'Failed to update avatar. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in avatar upload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/settings/avatar - Remove avatar
export async function DELETE() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      // Remove avatar using Clerk
      await clerkClient.users.updateUser(userId, {
        imageUrl: null,
      } as any)

      return NextResponse.json({
        message: 'Avatar removed successfully'
      })
    } catch (error) {
      console.error('Error removing avatar:', error)
      return NextResponse.json(
        { error: 'Failed to remove avatar. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in avatar removal:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
