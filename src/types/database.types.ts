// Database Types for InstaPay - Generated from Prisma Schema
// This file contains all the TypeScript types that match our database schema

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

export type KYCStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED'

export type WalletType = 'PERSONAL' | 'BUSINESS' | 'SAVINGS' | 'INVESTMENT'

export type WalletStatus = 'ACTIVE' | 'SUSPENDED' | 'FROZEN' | 'CLOSED'

export type Currency =
  | 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD'
  | 'JPY' | 'CHF' | 'CNY' | 'BTC' | 'ETH'

export type TransactionType =
  | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'PAYMENT'
  | 'REFUND' | 'FEE' | 'INTEREST' | 'REWARD' | 'PENALTY' | 'ADJUSTMENT'

export type TransactionCategory =
  | 'FOOD_DINING' | 'TRANSPORTATION' | 'SHOPPING' | 'ENTERTAINMENT'
  | 'BILLS_UTILITIES' | 'HEALTHCARE' | 'EDUCATION' | 'TRAVEL'
  | 'BUSINESS' | 'INVESTMENT' | 'TRANSFER' | 'ATM_CASH'
  | 'FEES' | 'INCOME' | 'OTHER'

export type TransactionStatus =
  | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  | 'CANCELLED' | 'EXPIRED' | 'DISPUTED' | 'REFUNDED'

export type PaymentMethodType =
  | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'PAYPAL'
  | 'APPLE_PAY' | 'GOOGLE_PAY' | 'STRIPE' | 'ACH' | 'WIRE' | 'CRYPTO'

export type NotificationType =
  | 'TRANSACTION' | 'SECURITY' | 'PROMOTIONAL' | 'SYSTEM'
  | 'ACCOUNT' | 'PAYMENT' | 'REMINDER'

export type NotificationChannel = 'EMAIL' | 'PUSH' | 'SMS' | 'IN_APP'

export type SecurityEventType =
  | 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'PASSWORD_CHANGE'
  | 'PIN_CHANGE' | 'TRANSACTION' | 'SUSPICIOUS_ACTIVITY'
  | 'ACCOUNT_LOCKED' | 'DEVICE_ADDED' | 'PAYMENT_METHOD_ADDED'

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type SupportCategory =
  | 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'SECURITY'
  | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT'

export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type SupportStatus =
  | 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED'

// ================================
// MAIN ENTITY TYPES
// ================================

export interface User {
  id: string
  clerkId: string
  email: string
  username: string
  firstName: string
  lastName: string
  displayName?: string
  avatar?: string
  phoneNumber?: string
  dateOfBirth?: Date
  gender?: Gender

  // Account Status
  isActive: boolean
  isVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  kycStatus: KYCStatus

  // Security
  twoFactorEnabled: boolean
  lastLoginAt?: Date
  loginAttempts: number
  accountLockedUntil?: Date

  // Preferences
  language: string
  timezone: string
  notificationSettings?: Record<string, unknown>
  privacySettings?: Record<string, unknown>

  // Timestamps
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  // Relations
  address?: Address
  wallets: Wallet[]
  transactions: Transaction[]
  sentTransactions: Transaction[]
  receivedTransactions: Transaction[]
  paymentMethods: PaymentMethod[]
  beneficiaries: Beneficiary[]
  notifications: Notification[]
  sessions: UserSession[]
  securityLogs: SecurityLog[]
  supportTickets: SupportTicket[]
}

export interface Address {
  id: string
  userId: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude?: number
  longitude?: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date

  user: User
}

export interface Wallet {
  id: string
  userId: string
  name: string
  type: WalletType
  currency: Currency
  balance: number
  availableBalance: number

  // Security
  pin: string
  pinAttempts: number
  pinLockedUntil?: Date

  // Limits
  dailySpendLimit?: number
  monthlySpendLimit?: number
  transactionLimit: number

  // Status
  status: WalletStatus
  isDefault: boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Relations
  user: User
  transactions: Transaction[]
  paymentMethods: PaymentMethod[]
}

export interface Transaction {
  id: string

  // Transaction Details
  type: TransactionType
  category: TransactionCategory
  subCategory?: string
  amount: number
  currency: Currency
  exchangeRate?: number
  fee: number
  netAmount: number

  // Participants
  userId: string
  walletId: string
  senderId?: string
  recipientId?: string

  // Balance tracking
  balanceBefore: number
  balanceAfter: number

  // Status
  status: TransactionStatus
  statusReason?: string
  processedAt?: Date

  // Details
  description: string
  reference?: string
  merchantName?: string
  merchantCategory?: string
  location?: Record<string, unknown>

  // Payment Method
  paymentMethodId?: string

  // Metadata
  metadata?: Record<string, unknown>
  tags: string[]

  // Security
  ipAddress?: string
  userAgent?: string
  deviceFingerprint?: string

  // Timestamps
  createdAt: Date
  updatedAt: Date
  scheduledAt?: Date

  // Relations
  user: User
  wallet: Wallet
  sender?: User
  recipient?: User
  paymentMethod?: PaymentMethod
}

export interface PaymentMethod {
  id: string
  userId: string
  walletId?: string

  // Details
  type: PaymentMethodType
  provider: string
  providerAccountId: string

  // Card Details
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number

  // Bank Details
  bankName?: string
  accountType?: string
  routingNumber?: string

  // Status
  isDefault: boolean
  isActive: boolean
  isVerified: boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Relations
  user: User
  wallet?: Wallet
  transactions: Transaction[]
}

export interface Beneficiary {
  id: string
  userId: string

  // Details
  name: string
  email?: string
  phoneNumber?: string

  // Relationship
  relationship?: string
  nickname?: string

  // Status
  isActive: boolean
  isFavorite: boolean

  // Usage Stats
  lastUsedAt?: Date
  totalTransactions: number
  totalAmount: number

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Relations
  user: User
}

export interface Notification {
  id: string
  userId: string

  // Details
  type: NotificationType
  title: string
  message: string
  actionUrl?: string

  // Status
  isRead: boolean
  isArchived: boolean

  // Delivery
  channels: NotificationChannel[]
  sentAt?: Date
  readAt?: Date

  // Metadata
  metadata?: Record<string, unknown>

  // Timestamps
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date

  // Relations
  user: User
}

export interface UserSession {
  id: string
  userId: string
  sessionToken: string

  // Details
  ipAddress: string
  userAgent: string
  deviceInfo?: Record<string, unknown>
  location?: Record<string, unknown>

  // Status
  isActive: boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  lastActivityAt: Date

  // Relations
  user: User
}

export interface SecurityLog {
  id: string
  userId?: string

  // Event Details
  eventType: SecurityEventType
  severity: SecuritySeverity
  description: string

  // Context
  ipAddress?: string
  userAgent?: string
  deviceFingerprint?: string
  location?: Record<string, unknown>

  // Additional Data
  metadata?: Record<string, unknown>

  // Timestamps
  createdAt: Date

  // Relations
  user?: User
}

export interface SupportTicket {
  id: string
  userId: string
  ticketNumber: string

  // Details
  subject: string
  description: string
  category: SupportCategory
  priority: SupportPriority
  status: SupportStatus

  // Assignment
  assignedTo?: string

  // Resolution
  resolution?: string
  resolvedAt?: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Relations
  user: User
}

// ================================
// API RESPONSE TYPES
// ================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasNext?: boolean
    hasPrev?: boolean
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TransactionFilters {
  type?: TransactionType
  category?: TransactionCategory
  status?: TransactionStatus
  minAmount?: number
  maxAmount?: number
  startDate?: Date
  endDate?: Date
  walletId?: string
}

export interface WalletStats {
  totalBalance: number
  availableBalance: number
  totalTransactions: number
  monthlySpending: number
  topCategories: Array<{
    category: TransactionCategory
    amount: number
    count: number
  }>
}

export interface UserProfile {
  user: User
  address?: Address
  stats: {
    totalWallets: number
    totalTransactions: number
    accountAge: number
    kycCompleted: boolean
  }
}

// ================================
// FORM TYPES
// ================================

export interface CreateWalletData {
  name: string
  type: WalletType
  currency: Currency
  pin: string
  dailySpendLimit?: number
  monthlySpendLimit?: number
}

export interface TransferMoneyData {
  fromWalletId: string
  toUserId: string
  amount: number
  description: string
  category: TransactionCategory
  scheduledAt?: Date
}

export interface AddPaymentMethodData {
  type: PaymentMethodType
  provider: string
  cardNumber?: string
  expiryMonth?: number
  expiryYear?: number
  cvv?: string
  bankAccount?: string
  routingNumber?: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  displayName?: string
  phoneNumber?: string
  dateOfBirth?: Date
  gender?: Gender
  language?: string
  timezone?: string
}

export interface UpdateAddressData {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude?: number
  longitude?: number
}

// ================================
// UTILITY TYPES
// ================================

export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
export type UpdateUserData = Partial<CreateUserData>

export type CreateTransactionData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'balanceBefore' | 'balanceAfter'>
export type UpdateTransactionData = Partial<Pick<Transaction, 'status' | 'statusReason' | 'processedAt' | 'description'>>

export type CreateWalletRequest = Omit<Wallet, 'id' | 'createdAt' | 'updatedAt' | 'balance' | 'availableBalance' | 'pinAttempts'>
export type UpdateWalletRequest = Partial<Pick<Wallet, 'name' | 'dailySpendLimit' | 'monthlySpendLimit' | 'status'>>

// Currency symbols mapping
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF',
  CNY: '¥',
  BTC: '₿',
  ETH: 'Ξ'
}

// Transaction category icons
export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  FOOD_DINING: '🍽️',
  TRANSPORTATION: '🚗',
  SHOPPING: '🛍️',
  ENTERTAINMENT: '🎬',
  BILLS_UTILITIES: '📄',
  HEALTHCARE: '🏥',
  EDUCATION: '📚',
  TRAVEL: '✈️',
  BUSINESS: '💼',
  INVESTMENT: '📈',
  TRANSFER: '💸',
  ATM_CASH: '🏧',
  FEES: '💳',
  INCOME: '��',
  OTHER: '📝'
}
