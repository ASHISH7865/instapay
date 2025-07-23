import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// Type definitions for settings
interface NotificationSettings {
  email: {
    transactions: boolean
    security: boolean
    marketing: boolean
    updates: boolean
  }
  push: {
    transactions: boolean
    security: boolean
    marketing: boolean
    updates: boolean
  }
  sms: {
    transactions: boolean
    security: boolean
    marketing: boolean
    updates: boolean
  }
}

interface PrivacySettings {
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  loginNotifications: boolean
  sessionTimeout: number
  theme?: string
  currency?: string
  dateFormat?: string
  numberFormat?: string
}

// GET /api/settings - Get user settings
export async function GET() {
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
      include: {
        address: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse settings from JSON fields or use defaults
    const notificationSettings = (user.notificationSettings as unknown as NotificationSettings) || {
      email: {
        transactions: true,
        security: true,
        marketing: false,
        updates: true
      },
      push: {
        transactions: true,
        security: true,
        marketing: false,
        updates: false
      },
      sms: {
        transactions: false,
        security: true,
        marketing: false,
        updates: false
      }
    }

    const privacySettings = (user.privacySettings as unknown as PrivacySettings) || {
      twoFactorEnabled: user.twoFactorEnabled,
      biometricEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30
    }

    // Construct settings object
    const settings = {
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber || '',
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0] || '',
        address: user.address ? {
          street: user.address.street,
          city: user.address.city,
          state: user.address.state,
          zipCode: user.address.postalCode,
          country: user.address.country
        } : {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        }
      },
      security: {
        twoFactorEnabled: privacySettings.twoFactorEnabled,
        biometricEnabled: privacySettings.biometricEnabled,
        passwordLastChanged: new Date().toISOString().split('T')[0], // This would need to be tracked separately
        loginNotifications: privacySettings.loginNotifications,
        sessionTimeout: privacySettings.sessionTimeout
      },
      notifications: notificationSettings,
      preferences: {
        theme: 'system',
        language: user.language,
        currency: 'USD',
        timezone: user.timezone,
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'US'
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { section, data } = body

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Missing section or data' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        address: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let updateData: Record<string, unknown> = {}

    // Update specific section of settings
    switch (section) {
      case 'profile':
        updateData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phone,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          avatar: data.avatar,
        }

        // Update address if provided
        if (data.address) {
          if (user.address) {
            await prisma.address.update({
              where: { userId: user.id },
              data: {
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                postalCode: data.address.zipCode,
                country: data.address.country,
              }
            })
          } else {
            await prisma.address.create({
              data: {
                userId: user.id,
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                postalCode: data.address.zipCode,
                country: data.address.country,
              }
            })
          }
        }
        break

      case 'security':
        updateData = {
          twoFactorEnabled: data.twoFactorEnabled,
          privacySettings: {
            twoFactorEnabled: data.twoFactorEnabled,
            biometricEnabled: data.biometricEnabled,
            loginNotifications: data.loginNotifications,
            sessionTimeout: data.sessionTimeout
          }
        }
        break

      case 'notifications':
        updateData = {
          notificationSettings: data
        }
        break

      case 'preferences':
        updateData = {
          language: data.language,
          timezone: data.timezone,
                     privacySettings: {
             ...(user.privacySettings as unknown as PrivacySettings),
            theme: data.theme,
            currency: data.currency,
            dateFormat: data.dateFormat,
            numberFormat: data.numberFormat
          }
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid section' },
          { status: 400 }
        )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: updateData,
      include: {
        address: true,
      }
    })

    // Return updated settings
    const notificationSettings = (updatedUser.notificationSettings as unknown as NotificationSettings) || {
      email: { transactions: true, security: true, marketing: false, updates: true },
      push: { transactions: true, security: true, marketing: false, updates: false },
      sms: { transactions: false, security: true, marketing: false, updates: false }
    }

    const privacySettings = (updatedUser.privacySettings as unknown as PrivacySettings) || {
      twoFactorEnabled: updatedUser.twoFactorEnabled,
      biometricEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30
    }

    const settings = {
      profile: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phoneNumber || '',
        avatar: updatedUser.avatar,
        dateOfBirth: updatedUser.dateOfBirth?.toISOString().split('T')[0] || '',
        address: updatedUser.address ? {
          street: updatedUser.address.street,
          city: updatedUser.address.city,
          state: updatedUser.address.state,
          zipCode: updatedUser.address.postalCode,
          country: updatedUser.address.country
        } : {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        }
      },
      security: {
        twoFactorEnabled: privacySettings.twoFactorEnabled,
        biometricEnabled: privacySettings.biometricEnabled,
        passwordLastChanged: new Date().toISOString().split('T')[0],
        loginNotifications: privacySettings.loginNotifications,
        sessionTimeout: privacySettings.sessionTimeout
      },
      notifications: notificationSettings,
      preferences: {
        theme: 'system',
        language: updatedUser.language,
        currency: 'USD',
        timezone: updatedUser.timezone,
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'US'
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
