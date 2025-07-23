/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { memo, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import AreaChartComponent from '@/components/charts/Charts'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SendMoneyModal } from '@/components/modal/send-money-v3'
import { Progress } from '@/components/ui/progress'
import { useDashboard, useAIInsights } from '@/lib/hooks/useDashboard'
import { useAuth, useUser } from '@clerk/nextjs'
import {
    ArrowUpIcon,
    ArrowDownIcon,
    PlusIcon,
    SendIcon,
    CreditCardIcon,
    TrendingUpIcon,
    WalletIcon,
    CalendarIcon,
    DollarSignIcon,
    Sparkles,
    PieChart,
    Zap,
    BarChart3,
    CheckCircle2,
    Star,
    Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            duration: 0.6
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24
        }
    }
}

const floatingVariants = {
    animate: {
        y: [-5, 5, -5],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

export default function Dashboard() {
    const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false)
    const { isLoaded, userId } = useAuth()
    const { user: userData } = useUser()
    const { isLoaded: isUserLoaded, isSignedIn } = useUser()

    // Use optimized hook for dashboard data (must be called before any returns)
    const {
        dashboardStats,
        recentTransactions,
        isLoading: loading,
        error,
        refreshData
    } = useDashboard()

    console.log(dashboardStats)

    // Use AI insights hook (must be called before any returns)
    const aiInsights = useAIInsights()

    // Handle refresh with error handling
    const handleRefresh = useCallback(async () => {
        try {
            await refreshData()
        } catch (error) {
            console.error('Error refreshing dashboard data:', error)
        }
    }, [refreshData])

    // In case the user signs out while on the page.
    if (!isLoaded || !userId || !isUserLoaded || !isSignedIn) {
        return null
    }

    const currentHour = new Date().getHours()
    const getGreeting = () => {
        if (currentHour < 12) return 'Good morning'
        if (currentHour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    // Error handling display
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
                <div className="flex flex-col items-center justify-center min-h-screen p-6">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
                        <p className="text-muted-foreground">{error}</p>
                        <Button onClick={handleRefresh} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
            <motion.div
                className='flex flex-col p-6 space-y-8 max-w-7xl mx-auto'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Breadcrumbs */}
                <motion.div variants={itemVariants}>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
                    </Breadcrumbs>
                </motion.div>

                {/* AI-Powered Smart Banner */}
                {aiInsights && (
                    <motion.div variants={itemVariants}>
                        <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10 backdrop-blur-sm shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 opacity-50" />
                            <motion.div
                                className="absolute top-4 right-4"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <Sparkles className="h-6 w-6 text-purple-500" />
                            </motion.div>
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
                                        <Brain className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold text-foreground">AI Financial Insights</h3>
                                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                                <Zap className="h-3 w-3 mr-1" />
                                                Smart
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground mb-3">
                                            {aiInsights.insight === 'excellent' && "🎉 Excellent financial health! Your savings rate is outstanding."}
                                            {aiInsights.insight === 'good' && "👍 Good financial progress! You're on track with your savings."}
                                            {aiInsights.insight === 'needs_attention' && "💡 Consider optimizing your spending to improve your savings rate."}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                                <p className="text-sm text-muted-foreground">Savings Rate</p>
                                                <p className="text-xl font-bold text-purple-600">{aiInsights.savingsRate}%</p>
                                            </div>
                                            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                                <p className="text-sm text-muted-foreground">Spending Trend</p>
                                                <p className={`text-xl font-bold ${aiInsights.spendingTrend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                    {aiInsights.spendingTrend >= 0 ? '+' : ''}{aiInsights.spendingTrend}%
                                                </p>
                                            </div>
                                            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                                <p className="text-sm text-muted-foreground">Projected Growth</p>
                                                <p className="text-xl font-bold text-emerald-600">${aiInsights.projectedSavings.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Welcome Header */}
                <motion.div variants={itemVariants} className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='space-y-1'>
                        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent'>
                            {getGreeting()}, {userData?.firstName || userData?.fullName}! 👋
                        </h1>
                        <p className='text-muted-foreground text-lg'>
                            Here&apos;s your financial overview for today.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className='flex flex-wrap gap-3'>
                        <Link href="/dashboard/wallet">
                            <Button size="lg" className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                <PlusIcon className='w-5 h-5 mr-2' />
                                Add Money
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            onClick={() => setIsSendMoneyModalOpen(true)}
                        >
                            <SendIcon className='w-5 h-5 mr-2' />
                            Send Money
                        </Button>
                        <Button size="lg" variant="outline" className="border-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <PieChart className='w-5 h-5 mr-2' />
                            Analytics
                        </Button>
                    </div>
                </motion.div>

                {/* Enhanced Stats Grid */}
                <motion.div variants={itemVariants} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <EnhancedStatsCard
                        title='Total Balance'
                        value={dashboardStats ? `$${dashboardStats.totalBalance.toLocaleString()}` : '$0'}
                        change={dashboardStats ? `${(dashboardStats.balanceChange ?? 0) >= 0 ? '+' : ''}${dashboardStats.balanceChange ?? 0}%` : '0%'}
                        changeType={(dashboardStats?.balanceChange ?? 0) >= 0 ? 'positive' : 'negative'}
                        icon={WalletIcon}
                        gradient='from-emerald-500 to-emerald-600'
                        loading={loading}
                        subtitle="Available to spend"
                    />
                    <EnhancedStatsCard
                        title='Total Income'
                        value={dashboardStats ? `$${dashboardStats.totalIncome.toLocaleString()}` : '$0'}
                        change={dashboardStats ? `${(dashboardStats.totalIncome ?? 0) >= 0 ? '+' : ''}${dashboardStats.totalIncome ?? 0}%` : '0%'}
                        changeType={(dashboardStats?.totalIncome ?? 0) >= 0 ? 'positive' : 'negative'}
                        icon={TrendingUpIcon}
                        gradient='from-blue-500 to-blue-600'
                        loading={loading}
                        subtitle="This month"
                    />
                    <EnhancedStatsCard
                        title='Total Expenses'
                        value={dashboardStats ? `$${dashboardStats.totalExpenses.toLocaleString()}` : '$0'}
                        change={dashboardStats ? `${(dashboardStats.expenseChange ?? 0) >= 0 ? '+' : ''}${dashboardStats.expenseChange ?? 0}%` : '0%'}
                        changeType={(dashboardStats?.expenseChange ?? 0) >= 0 ? 'negative' : 'positive'}
                        icon={CreditCardIcon}
                        gradient='from-orange-500 to-red-500'
                        loading={loading}
                        subtitle="This month"
                    />
                    <EnhancedStatsCard
                        title='Transactions'
                        value={dashboardStats ? dashboardStats.totalTransactions.toString() : '0'}
                        change={dashboardStats ? `${(dashboardStats.totalTransactions ?? 0) >= 0 ? '+' : ''}${dashboardStats.totalTransactions ?? 0}%` : '0%'}
                        changeType={(dashboardStats?.totalTransactions ?? 0) >= 0 ? 'positive' : 'negative'}
                        icon={DollarSignIcon}
                        gradient='from-purple-500 to-purple-600'
                        loading={loading}
                        subtitle="Total completed"
                    />
                </motion.div>



                {/* Enhanced Activity Section */}
                <motion.div variants={itemVariants} className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2'>
                        <EnhancedRecentTransactionsCard transactions={recentTransactions} loading={loading} />
                    </div>
                    <div className='space-y-6'>
                        <EnhancedQuickStatsCard dashboardStats={dashboardStats} loading={loading} />
                        <SmartRecommendationsCard />
                    </div>
                </motion.div>
            </motion.div>

            {/* Send Money Modal */}
            <SendMoneyModal
                isOpen={isSendMoneyModalOpen}
                onClose={() => setIsSendMoneyModalOpen(false)}
            />
        </div>
    )
}

// Enhanced Components
interface EnhancedStatsCardProps {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative'
    icon: any
    gradient: string
    loading: boolean
    subtitle?: string
}

const EnhancedStatsCard = memo(({ title, value, change, changeType, icon: Icon, gradient, loading, subtitle }: EnhancedStatsCardProps) => {
    if (loading) {
        return (
            <Card className='relative overflow-hidden border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm'>
                <CardContent className='p-6'>
                    <div className='animate-pulse space-y-3'>
                        <div className='h-4 bg-muted rounded w-2/3'></div>
                        <div className='h-8 bg-muted rounded w-1/2'></div>
                        <div className='h-3 bg-muted rounded w-1/3'></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <Card className='relative overflow-hidden border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-500'>
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', gradient)} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

                <CardContent className='p-6 relative z-10'>
                    <div className='flex items-start justify-between mb-4'>
                        <div className="flex-1">
                            <p className='text-sm font-medium text-muted-foreground mb-1'>{title}</p>
                            <div className="space-y-1">
                                <p className='text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
                                    {value}
                                </p>
                                {subtitle && (
                                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                                )}
                            </div>
                        </div>

                        <div className={cn('p-3 rounded-xl bg-gradient-to-br shadow-lg', gradient)}>
                            <Icon className='w-6 h-6 text-white' />
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        {changeType === 'positive' ? (
                            <ArrowUpIcon className='w-4 h-4 text-emerald-500' />
                        ) : (
                            <ArrowDownIcon className='w-4 h-4 text-red-500' />
                        )}
                        <span className={cn(
                            'text-sm font-semibold',
                            changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'
                        )}>
                            {change}
                        </span>
                        <span className='text-xs text-muted-foreground'>vs last month</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
})

EnhancedStatsCard.displayName = 'EnhancedStatsCard'

// Enhanced Chart Card Component
interface EnhancedChartCardProps {
    title: string
    description: string
    data: any[]
    strokeColor: string
    gradientFrom: string
    gradientTo: string
    loading: boolean
    icon: any
}

const EnhancedChartCard = memo(({ title, description, data, gradientFrom, gradientTo, loading, icon: Icon }: EnhancedChartCardProps) => {
    console.log(data)
    if (loading) {
        return (
            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <div className='animate-pulse space-y-2'>
                        <div className='h-6 bg-muted rounded w-1/3'></div>
                        <div className='h-4 bg-muted rounded w-1/2'></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className=' bg-muted rounded animate-pulse'></div>
                </CardContent>
            </Card>
        )
    }

    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <Card className='border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-500'>
                <div className={cn('h-2 bg-gradient-to-r', gradientFrom, gradientTo)} />
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-xl'>
                        <Icon className="h-5 w-5" />
                        {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className=''>
                        {data && data.length > 0 ? (
                            <AreaChartComponent data={data as any} title={title} type='line' />
                        ) : (
                            <div className='flex items-center justify-center h-full text-muted-foreground'>
                                <div className='text-center space-y-2'>
                                    <Icon className='w-12 h-12 mx-auto opacity-20' />
                                    <p>No data available yet</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
})

EnhancedChartCard.displayName = 'EnhancedChartCard'

// Trend Insight Card Component
interface TrendInsightCardProps {
    title: string
    insight: string
    percentage: number
    trend: 'up' | 'down'
    color: 'blue' | 'green' | 'orange' | 'purple'
}

const TrendInsightCard = memo(({ title, insight, percentage, trend }: TrendInsightCardProps) => {

    return (
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-black/20 backdrop-blur-sm">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    {trend === 'up' ? (
                        <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                    )}
                </div>
                <p className="text-lg font-bold mb-2">{insight}</p>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
})

TrendInsightCard.displayName = 'TrendInsightCard'

// AI Insights Section Component
const AIInsightsSection = memo(({ loading }: { dashboardStats: any, loading: boolean }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-0 shadow-lg bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-muted rounded w-2/3"></div>
                                <div className="h-8 bg-muted rounded w-1/2"></div>
                                <div className="h-3 bg-muted rounded w-1/3"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const insights = [
        {
            icon: Brain,
            title: "Smart Spending",
            value: "Optimized",
            description: "AI suggests reducing dining out by 15%",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Star,
            title: "Investment Score",
            value: "8.5/10",
            description: "Strong portfolio diversification",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: CheckCircle2,
            title: "Budget Health",
            value: "Excellent",
            description: "You're 12% under budget this month",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: TrendingUpIcon,
            title: "Savings Trend",
            value: "+23%",
            description: "Saving rate improved significantly",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: PieChart,
            title: "Category Alert",
            value: "Entertainment",
            description: "40% above average spending",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: Sparkles,
            title: "AI Recommendation",
            value: "Auto-Save",
            description: "Enable smart savings for better growth",
            color: "from-purple-500 to-purple-600"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="border-0 shadow-lg bg-white/70 dark:bg-black/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg", insight.color)}>
                                    <insight.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{insight.title}</p>
                                    <p className="text-xl font-bold mb-1">{insight.value}</p>
                                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
})

AIInsightsSection.displayName = 'AIInsightsSection'

// Enhanced Recent Transactions Card
const EnhancedRecentTransactionsCard = memo(({ transactions, loading }: { transactions: any[], loading: boolean }) => {
    if (loading) {
        return (
            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <div className='animate-pulse space-y-2'>
                        <div className='h-6 bg-muted rounded w-1/3'></div>
                        <div className='h-4 bg-muted rounded w-1/2'></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className='animate-pulse flex justify-between items-center p-4 rounded-lg'>
                                <div className='space-y-2'>
                                    <div className='h-4 bg-muted rounded w-24'></div>
                                    <div className='h-3 bg-muted rounded w-16'></div>
                                </div>
                                <div className='h-6 bg-muted rounded w-16'></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className='border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <CalendarIcon className='w-5 h-5 text-blue-500' />
                    Recent Activity
                </CardTitle>
                <CardDescription>Your latest transactions and activities</CardDescription>
            </CardHeader>
            <CardContent>
                {transactions.length > 0 ? (
                    <div className='space-y-3'>
                        {transactions.slice(0, 5).map((transaction: any) => (
                            <motion.div
                                key={transaction.id}
                                className='flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/30 transition-all duration-300 border border-white/20'
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <div className='flex items-center space-x-4'>
                                    <div className={cn(
                                        'p-3 rounded-xl shadow-lg',
                                        transaction.type === 'CREDIT'
                                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                                            : 'bg-gradient-to-br from-red-500 to-red-600'
                                    )}>
                                        {transaction.type === 'CREDIT' ? (
                                            <ArrowDownIcon className='w-4 h-4 text-white' />
                                        ) : (
                                            <ArrowUpIcon className='w-4 h-4 text-white' />
                                        )}
                                    </div>
                                    <div>
                                        <p className='font-semibold text-foreground'>{transaction?.purpose || 'Transaction'}</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <p className={cn(
                                        'font-bold text-lg',
                                        transaction.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'
                                    )}>
                                        {transaction.type === 'CREDIT' ? '+' : '-'}${transaction?.amount}
                                    </p>
                                    <p className='text-sm text-muted-foreground uppercase tracking-wide'>{transaction?.currency}</p>
                                </div>
                            </motion.div>
                        ))}
                        <Link href="/dashboard/transactions">
                            <Button variant="outline" className='w-full mt-6 border-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'>
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                View All Transactions
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className='text-center py-12 text-muted-foreground'>
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <WalletIcon className='w-10 h-10 text-blue-500' />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                        <p className='text-sm mb-4'>Start by adding money to your wallet</p>
                        <Link href="/dashboard/wallet">
                            <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add Money
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )
})

EnhancedRecentTransactionsCard.displayName = 'EnhancedRecentTransactionsCard'

// Enhanced Quick Stats Card
const EnhancedQuickStatsCard = memo(({ dashboardStats, loading }: { dashboardStats: any, loading: boolean }) => {
    if (loading) {
        return (
            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <div className='animate-pulse space-y-2'>
                        <div className='h-6 bg-muted rounded w-2/3'></div>
                        <div className='h-4 bg-muted rounded w-1/2'></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className='animate-pulse space-y-2'>
                                <div className='h-4 bg-muted rounded w-1/2'></div>
                                <div className='h-6 bg-muted rounded w-2/3'></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    const netIncome = dashboardStats
        ? dashboardStats.totalIncome - dashboardStats.totalExpenses
        : 0

    const savingsRate = dashboardStats?.totalIncome
        ? Math.round((netIncome / dashboardStats.totalIncome) * 100)
        : 0

    return (
        <Card className='border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm'>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Financial Summary
                </CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm text-muted-foreground'>Net Income</span>
                        <Badge variant={netIncome >= 0 ? 'default' : 'destructive'} className="px-3">
                            {netIncome >= 0 ? 'Positive' : 'Negative'}
                        </Badge>
                    </div>
                    <p className={cn(
                        'text-3xl font-bold',
                        netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'
                    )}>
                        ${Math.abs(netIncome).toLocaleString()}
                    </p>
                </div>

                <div className='space-y-4'>
                    <div className='p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm font-medium'>Savings Rate</span>
                            <span className='text-lg font-bold text-blue-600'>{savingsRate}%</span>
                        </div>
                        <Progress value={savingsRate} className="h-2" />
                    </div>

                    <div className='p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl'>
                        <div className='flex justify-between items-center'>
                            <span className='text-sm font-medium'>Monthly Goal</span>
                            <span className='text-lg font-bold text-emerald-600'>$5,000</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Target savings amount</p>
                    </div>
                </div>

                <Link href="/dashboard/wallet">
                    <Button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300'>
                        <WalletIcon className='w-4 h-4 mr-2' />
                        Manage Wallet
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
})

EnhancedQuickStatsCard.displayName = 'EnhancedQuickStatsCard'

// Smart Recommendations Card
const SmartRecommendationsCard = memo(() => {
    const recommendations = [
        {
            icon: Sparkles,
            title: "Smart Investment",
            description: "Consider investing $500 in index funds",
            action: "Learn More",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Star,
            title: "Budget Optimization",
            description: "You can save $200/month on subscriptions",
            action: "Review",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: TrendingUpIcon,
            title: "Savings Goal",
            description: "Increase emergency fund by $1000",
            action: "Set Goal",
            color: "from-blue-500 to-blue-600"
        }
    ]

    return (
        <Card className='border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm'>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions for you</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={index}
                        className="p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/20 hover:bg-white/70 dark:hover:bg-black/30 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg bg-gradient-to-br", rec.color)}>
                                <rec.icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                                <Button size="sm" variant="outline" className="text-xs h-6">
                                    {rec.action}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    )
})

SmartRecommendationsCard.displayName = 'SmartRecommendationsCard'
