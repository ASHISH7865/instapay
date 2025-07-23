/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/settings/export - Export user data
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    // Get user data
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        address: true,
        wallets: {
          include: {
            transactions: {
              take: 100, // Limit to last 100 transactions
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        beneficiaries: true,
        paymentMethods: true,
        notifications: {
          take: 50, // Limit to last 50 notifications
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          avatar: user.avatar,
          address: user.address
        },
        preferences: {
          language: user.language,
          timezone: user.timezone,
          notificationSettings: user.notificationSettings,
          privacySettings: user.privacySettings
        },
        security: {
          twoFactorEnabled: user.twoFactorEnabled,
          lastLoginAt: user.lastLoginAt,
          kycStatus: user.kycStatus
        }
      },
      wallets: user.wallets.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        type: wallet.type,
        currency: wallet.currency,
        balance: wallet.balance.toString(),
        status: wallet.status,
        createdAt: wallet.createdAt,
        transactions: wallet.transactions.map(tx => ({
          id: tx.id,
          type: tx.type,
          category: tx.category,
          amount: tx.amount.toString(),
          currency: tx.currency,
          description: tx.description,
          status: tx.status,
          createdAt: tx.createdAt
        }))
      })),
      beneficiaries: user.beneficiaries.map(ben => ({
        id: ben.id,
        name: ben.name,
        email: ben.email,
        phoneNumber: ben.phoneNumber,
        relationship: ben.relationship,
        isActive: ben.isActive,
        createdAt: ben.createdAt
      })),
      paymentMethods: user.paymentMethods.map(pm => ({
        id: pm.id,
        type: pm.type,
        provider: pm.provider,
        last4: pm.last4,
        brand: pm.brand,
        isDefault: pm.isDefault,
        isActive: pm.isActive,
        createdAt: pm.createdAt
      })),
      notifications: user.notifications.map(notif => ({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        isRead: notif.isRead,
        createdAt: notif.createdAt
      }))
    }

    if (format === 'json') {
      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="instapay-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    } else if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csvData = convertToCSV(exportData)
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="instapay-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Use "json" or "csv".' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to convert data to CSV
function convertToCSV(data: any): string {
  // This is a simplified CSV conversion
  // In a real implementation, you'd want a more robust CSV library
  const lines: string[] = []

  // Add headers
  lines.push('Data Type,Field,Value')

  // Add user profile data
  Object.entries(data?.user?.profile).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      lines.push(`Profile,${key},"${value}"`)
    }
  })

  // Add wallet data
  data?.wallets?.forEach((wallet: any, index: number) => {
    lines.push(`Wallet ${index + 1},Name,"${wallet.name}"`)
    lines.push(`Wallet ${index + 1},Balance,"${wallet.balance}"`)
    lines.push(`Wallet ${index + 1},Currency,"${wallet.currency}"`)
  })

  return lines.join('\n')
}
