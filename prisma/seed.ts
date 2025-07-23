import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.wallet.deleteMany()
  await prisma.user.deleteMany()
  await prisma.address.deleteMany()
  await prisma.beneficiary.deleteMany()
  await prisma.paymentMethod.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.userSession.deleteMany()
  await prisma.securityLog.deleteMany()
  await prisma.supportTicket.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'user_300wVJQMpnnGMqw4SrJLCilxDKa',
        email: 'john.doe@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        phoneNumber: '+1234567890',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'MALE',
        isActive: true,
        isVerified: true,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: 'APPROVED',
        address: {
          create: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            postalCode: '10001',
            latitude: 40.7128,
            longitude: -74.006,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_300weG32W6Em0o19tQVWGw0clet',
        email: 'jane.smith@example.com',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        phoneNumber: '+1234567891',
        dateOfBirth: new Date('1992-08-20'),
        gender: 'FEMALE',
        isActive: true,
        isVerified: true,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: 'APPROVED',
        address: {
          create: {
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            postalCode: '90210',
            latitude: 34.0522,
            longitude: -118.2437,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_300wvpkOIKbLcX5EiTI8DyVPasF',
        email: 'mike.wilson@example.com',
        username: 'mikewilson',
        firstName: 'Mike',
        lastName: 'Wilson',
        displayName: 'Mike Wilson',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        phoneNumber: '+1234567892',
        dateOfBirth: new Date('1988-12-10'),
        gender: 'MALE',
        isActive: true,
        isVerified: true,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: 'APPROVED',
        address: {
          create: {
            street: '789 Pine Street',
            city: 'Chicago',
            state: 'IL',
            country: 'USA',
            postalCode: '60601',
            latitude: 41.8781,
            longitude: -87.6298,
          },
        },
      },
    }),
  ])

  console.log('👥 Created test users')

  // Create wallets for each user
  const wallets = await Promise.all(
    users.map(async (user, index) => {
      const hashedPin = await hash('1234', 12)
      return prisma.wallet.create({
        data: {
          userId: user.id,
          name: index === 0 ? 'Main Wallet' : `Wallet ${index + 1}`,
          type: 'PERSONAL',
          currency: 'USD',
          balance: 10000 + index * 5000, // Different starting balances
          availableBalance: 10000 + index * 5000,
          pin: hashedPin,
          pinAttempts: 0,
          dailySpendLimit: 1000,
          monthlySpendLimit: 5000,
          transactionLimit: 5000,
          status: 'ACTIVE',
          isDefault: true,
        },
      })
    }),
  )

  console.log('💰 Created wallets')

  // Create beneficiaries
  const beneficiaries = await Promise.all([
    prisma.beneficiary.create({
      data: {
        userId: users[0].id,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phoneNumber: '+1234567893',
        relationship: 'FRIEND',
        nickname: 'Sarah',
        isActive: true,
        isFavorite: true,
        lastUsedAt: new Date(),
        totalTransactions: 5,
        totalAmount: 1250.0,
      },
    }),
    prisma.beneficiary.create({
      data: {
        userId: users[0].id,
        name: 'David Brown',
        email: 'david.brown@example.com',
        phoneNumber: '+1234567894',
        relationship: 'FAMILY',
        nickname: 'Dad',
        isActive: true,
        isFavorite: false,
        lastUsedAt: new Date(),
        totalTransactions: 3,
        totalAmount: 800.0,
      },
    }),
  ])

  console.log('👥 Created beneficiaries')

  // Create sample transactions
  const transactionTypes = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'REFUND']
  const categories = [
    'FOOD_DINING',
    'TRANSPORTATION',
    'SHOPPING',
    'ENTERTAINMENT',
    'BILLS_UTILITIES',
    'HEALTHCARE',
    'EDUCATION',
    'TRAVEL',
    'BUSINESS',
    'INVESTMENT',
  ]
  const statuses = ['COMPLETED', 'PENDING', 'FAILED']

  const transactions = []
  let currentBalance = 10000

  // Generate transactions for the last 30 days
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - daysAgo)
    createdAt.setHours(Math.floor(Math.random() * 24))
    createdAt.setMinutes(Math.floor(Math.random() * 60))

    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    let amount = 0
    if (type === 'DEPOSIT' || type === 'REFUND') {
      amount = Math.random() * 2000 + 100 // $100 - $2100
    } else if (type === 'TRANSFER') {
      amount = Math.random() * 500 + 50 // $50 - $550
    } else {
      amount = Math.random() * 200 + 10 // $10 - $210
    }

    const balanceBefore = currentBalance
    let balanceAfter = currentBalance

    if (status === 'COMPLETED') {
      if (type === 'DEPOSIT' || type === 'REFUND') {
        balanceAfter = currentBalance + amount
        currentBalance = balanceAfter
      } else if (type === 'WITHDRAWAL' || type === 'PAYMENT' || type === 'TRANSFER') {
        balanceAfter = currentBalance - amount
        currentBalance = balanceAfter
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: users[0].id,
        walletId: wallets[0].id,
        type: type as 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT' | 'REFUND',
        category: category as
          | 'FOOD_DINING'
          | 'TRANSPORTATION'
          | 'SHOPPING'
          | 'ENTERTAINMENT'
          | 'BILLS_UTILITIES'
          | 'HEALTHCARE'
          | 'EDUCATION'
          | 'TRAVEL'
          | 'BUSINESS'
          | 'INVESTMENT',
        amount: amount,
        currency: 'USD',
        fee: type === 'TRANSFER' ? amount * 0.01 : 0, // 1% fee for transfers
        netAmount: type === 'TRANSFER' ? amount * 0.99 : amount,
        balanceBefore: balanceBefore,
        balanceAfter: balanceAfter,
        status: status as 'COMPLETED' | 'PENDING' | 'FAILED',
        description: `Sample ${type.toLowerCase()} transaction`,
        reference: `TXN_${Date.now()}_${i}`,
        merchantName: type === 'PAYMENT' ? 'Sample Merchant' : null,
        merchantCategory: type === 'PAYMENT' ? category : null,
        createdAt: createdAt,
        updatedAt: createdAt,
      },
    })

    transactions.push(transaction)
  }

  console.log('💳 Created sample transactions')

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'TRANSACTION',
        title: 'Payment Successful',
        message: 'Your payment of $150.50 has been processed successfully.',
        actionUrl: '/dashboard/transactions',
        isRead: false,
        channels: ['EMAIL', 'PUSH', 'IN_APP'],
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'SECURITY',
        title: 'New Login Detected',
        message: 'We detected a new login to your account from New York, NY.',
        actionUrl: '/dashboard/settings/security',
        isRead: true,
        channels: ['EMAIL', 'PUSH'],
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
  ])

  console.log('🔔 Created notifications')

  // Create support tickets
  const supportTickets = await Promise.all([
    prisma.supportTicket.create({
      data: {
        userId: users[0].id,
        ticketNumber: 'TKT-001',
        subject: 'Unable to add payment method',
        description: "I'm having trouble adding my credit card to my wallet.",
        category: 'TECHNICAL',
        priority: 'MEDIUM',
        status: 'OPEN',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
    prisma.supportTicket.create({
      data: {
        userId: users[0].id,
        ticketNumber: 'TKT-002',
        subject: 'Transaction not showing in history',
        description: "I made a payment yesterday but it's not appearing in my transaction history.",
        category: 'GENERAL',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assignedTo: 'support_agent_1',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
  ])

  console.log('🎫 Created support tickets')

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${users.length} users`)
  console.log(`   - ${wallets.length} wallets`)
  console.log(`   - ${beneficiaries.length} beneficiaries`)
  console.log(`   - ${transactions.length} transactions`)
  console.log(`   - ${notifications.length} notifications`)
  console.log(`   - ${supportTickets.length} support tickets`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
