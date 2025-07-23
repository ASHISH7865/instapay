/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'
import {
  OnboardingFormValuesType,
  PersonalInfoType,
  AddressType,
  PreferencesType,
  SecurityType
} from '../ZodShemas/onboardingSchema'

const SALT_ROUNDS = 12

export async function onboardUser(clerkId: string, email: string, data: OnboardingFormValuesType) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    })

    if (existingUser) {
      throw new Error('User already onboarded')
    }

    // Check if username is taken
    const usernameExists = await prisma.user.findUnique({
      where: { username: data.personalInfo.username }
    })

    if (usernameExists) {
      throw new Error('Username already taken')
    }

    // Check if email is taken
    const emailExists = await prisma.user.findUnique({
      where: { email: email }
    })

    if (emailExists) {
      throw new Error('Email already registered')
    }

    // Hash the wallet PIN
    const hashedPin = await bcrypt.hash(data.security.walletPin, SALT_ROUNDS)

    // Create user with address in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          clerkId,
          email,
          username: data.personalInfo.username,
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          displayName: data.personalInfo.displayName,
          phoneNumber: data.personalInfo.phoneNumber,
          dateOfBirth: data.personalInfo.dateOfBirth,
          gender: data.personalInfo.gender,
          language: data.preferences.language,
          timezone: data.preferences.timezone,
          twoFactorEnabled: data.security.twoFactorEnabled,
          isVerified: true, // Mark as verified since they completed onboarding
          emailVerified: true,
          phoneVerified: false, // Will be verified later
          kycStatus: 'PENDING',
          notificationSettings: {
            marketingEmails: data.preferences.marketingEmails,
            securityAlerts: data.preferences.securityAlerts,
            transactionNotifications: data.preferences.transactionNotifications,
            push: true,
            email: true,
            sms: false
          }
        }
      })

      // Create address
      await tx.address.create({
        data: {
          userId: newUser.id,
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          country: data.address.country,
          postalCode: data.address.postalCode,
          isDefault: true
        }
      })

      // Create default wallet
      await tx.wallet.create({
        data: {
          userId: newUser.id,
          name: 'Main Wallet',
          type: 'PERSONAL',
          currency: data.preferences.currency,
          balance: 0,
          availableBalance: 0,
          pin: hashedPin,
          pinAttempts: 0,
          transactionLimit: 5000,
          status: 'ACTIVE',
          isDefault: true
        }
      })

      // Log security event
      await tx.securityLog.create({
        data: {
          userId: newUser.id,
          eventType: 'ACCOUNT_CREATED',
          severity: 'LOW',
          description: 'User account created during onboarding',
          metadata: {
            onboardingCompleted: true,
            twoFactorEnabled: data.security.twoFactorEnabled,
            currency: data.preferences.currency
          }
        }
      })

      return newUser
    })

    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'User onboarded successfully',
      userId: result.id
    }

  } catch (err: any) {
    console.error('Onboarding error:', err)
    return {
      success: false,
      message: err.message || 'Failed to onboard user'
    }
  }
}

export async function getUserInfo(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        address: true,
        wallets: {
          where: { isDefault: true }
        }
      }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      isVerified: user.isVerified,
      hasDefaultWallet: user.wallets.length > 0,
      address: user.address
    }

  } catch (err: any) {
    console.error('Get user info error:', err)
    return null
  }
}

export async function checkUsernameAvailability(username: string, currentClerkId?: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (!existingUser) {
      return { available: true }
    }

    // If it's the current user's username, it's available
    if (currentClerkId && existingUser.clerkId === currentClerkId) {
      return { available: true }
    }

    return { available: false }

  } catch (err: any) {
    console.error('Username check error:', err)
    return { available: false, error: 'Failed to check username' }
  }
}

export async function saveOnboardingStep(
  clerkId: string,
  step: 'personal' | 'address' | 'preferences' | 'security',
  data: PersonalInfoType | AddressType | PreferencesType | SecurityType
) {
  try {
    // This function allows saving individual steps during onboarding
    // Useful for multi-step forms where users might want to save progress

    // For now, we'll store this in a temporary table or local storage
    // In a real implementation, you might want to create a UserOnboardingProgress table
    console.log(`Saving ${step} step for user ${clerkId}:`, data)

    return {
      success: true,
      message: `${step} step saved successfully`
    }

  } catch (err: any) {
    console.error('Save step error:', err)
    return {
      success: false,
      message: 'Failed to save progress'
    }
  }
}

export async function getOnboardingProgress(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        address: true,
        wallets: true
      }
    })

    if (!user) {
      return {
        completed: false,
        steps: {
          personal: false,
          address: false,
          preferences: false,
          security: false
        }
      }
    }

    return {
      completed: user.isVerified && user.address && user.wallets.length > 0,
      steps: {
        personal: !!user.firstName && !!user.lastName && !!user.username,
        address: !!user.address,
        preferences: !!user.language && !!user.timezone,
        security: user.wallets.length > 0
      }
    }

  } catch (err: any) {
    console.error('Get progress error:', err)
    return {
      completed: false,
      steps: {
        personal: false,
        address: false,
        preferences: false,
        security: false
      }
    }
  }
}

export async function generateWelcomeNotification(userId: string) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type: 'ACCOUNT',
        title: '🎉 Welcome to InstaPay!',
        message: 'Your account has been successfully created. Start by exploring your wallet and making your first transaction.',
        channels: ['IN_APP', 'EMAIL'],
        metadata: {
          isWelcome: true,
          actionUrl: '/dashboard/wallet'
        }
      }
    })

    return { success: true }
  } catch (err: any) {
    console.error('Welcome notification error:', err)
    return { success: false }
  }
}
