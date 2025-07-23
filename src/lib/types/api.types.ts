// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Dashboard Types
export interface DashboardStats {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  transactionCount: number
  balanceChange: number
  incomeChange: number
  expenseChange: number
  transactionChange: number
}

export interface ChartDataPoint {
  key: string
  value: number
  date?: string
  category?: string
}

export interface ChartData {
  creditChartData: ChartDataPoint[]
  debitChartData: ChartDataPoint[]
}

export interface AIInsight {
  type: 'warning' | 'success' | 'info' | 'recommendation'
  title: string
  message: string
  value?: number
  percentage?: number
  actionable?: boolean
  priority: 'low' | 'medium' | 'high'
}

// Wallet Types
export interface WalletStats {
  totalBalance: number
  availableBalance: number
  totalTransactions: number
  monthlySpending: number
  weeklySpending: number
  dailySpending: number
  topCategories: CategoryStats[]
  spendingTrend: TrendDataPoint[]
  monthlyIncome: number
  savingsRate: number
  projectedBalance: number
}

export interface CategoryStats {
  category: string
  amount: number
  count: number
  percentage: number
  trend?: 'up' | 'down' | 'stable'
}

export interface TrendDataPoint {
  date: string
  amount: number
  type?: 'income' | 'expense'
}

export interface SmartInsights {
  savingsRate: number
  spendingTrend: number
  projectedSavings: number
  budgetHealth: 'excellent' | 'good' | 'needs_attention' | 'critical'
  recommendations: AIInsight[]
  alerts: AIInsight[]
}

// Transaction Types
export interface TransactionFilters {
  type?: string[]
  category?: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  amountRange?: {
    min: number
    max: number
  }
  status?: string[]
  search?: string
}

export interface TransactionSummary {
  totalAmount: number
  totalCount: number
  averageAmount: number
  categories: Record<string, number>
  trends: {
    daily: TrendDataPoint[]
    weekly: TrendDataPoint[]
    monthly: TrendDataPoint[]
  }
}

// Error Types
export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ApiError {
  message: string
  code: string
  details?: ValidationError[]
  timestamp: string
  path?: string
}

// Cache Types
export interface CacheConfig {
  key: string
  ttl: number // Time to live in seconds
  tags?: string[]
}

// Analytics Types
export interface AnalyticsEvent {
  event: string
  properties: Record<string, unknown>
  userId?: string
  timestamp: Date
}

export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiResponseTime: number
  errorRate: number
}
