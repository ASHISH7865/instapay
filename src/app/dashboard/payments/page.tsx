/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CreditCard,
    Filter,
    Search,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    DollarSign,
    TrendingUp,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    Download,
    Sparkles,
    Brain,
    Zap,
    Target,
    PieChart
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useTransactions } from '@/hooks/useTransactionsRTK'
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Transaction } from '@/lib/store/slices/transactionApi'

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

const PaymentsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterTimeframe, setFilterTimeframe] = useState('all')

    // Get dashboard analytics data
    const { analytics, isLoading: analyticsLoading } = useDashboardAnalytics({
        timeframe: filterTimeframe === 'all' ? 'month' : filterTimeframe,
    })

    const { transactions: apiTransactions, isLoading: transactionsLoading } = useTransactions({
        limit: 100,
        page: 1
    })

    useEffect(() => {
        if (apiTransactions) {
            setTransactions(apiTransactions)
            setLoading(false)
        }
    }, [transactionsLoading])

    // Enhanced filtering and calculations
    const { filteredTransactions, paymentStats, categoryData } = useMemo(() => {
        const filtered = transactions.filter((transaction: Transaction) => {
            const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus

            let matchesTimeframe: boolean = true
            if (filterTimeframe !== 'all') {
                const transactionDate = new Date(transaction.createdAt)
                const now = new Date()

                switch (filterTimeframe) {
                    case 'today':
                        matchesTimeframe = transactionDate.toDateString() === now.toDateString()
                        break
                    case 'week':
                        // eslint-disable-next-line no-case-declarations
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        matchesTimeframe = transactionDate >= weekAgo
                        break
                    case 'month':
                        // eslint-disable-next-line no-case-declarations
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        matchesTimeframe = transactionDate >= monthAgo
                        break
                }
            }

            return matchesSearch && matchesFilter && matchesTimeframe
        })

        // Use real analytics data if available, otherwise fallback to calculated data
        const stats = analytics?.paymentStats || {
            totalPayments: filtered.length,
            totalAmount: filtered.reduce((sum, t) => sum + Number(t.amount || 0), 0),
            successfulPayments: filtered.filter(t => t.status === 'COMPLETED').length,
            pendingPayments: filtered.filter(t => t.status === 'PENDING').length,
            failedPayments: filtered.filter(t => t.status === 'FAILED').length,
            uniqueRecipients: new Set(filtered.map(t => t.recipientId || t.senderId)).size,
            successRate: filtered.length > 0 ? Math.round((filtered.filter(t => t.status === 'COMPLETED').length / filtered.length) * 100) : 0,
            averagePayment: filtered.length > 0 ? Math.round(filtered.reduce((sum, t) => sum + Number(t.amount || 0), 0) / filtered.length) : 0,
            trends: {
                paymentGrowth: 0,
                amountGrowth: 0,
                successRateGrowth: 0,
            }
        }

        const categories = analytics?.categoryData || {
            'Transfer': filtered.filter(t => t.type === 'TRANSFER').length,
            'Payment': filtered.filter(t => t.type === 'PAYMENT').length,
            'Top Up': filtered.filter(t => t.type === 'DEPOSIT').length,
            'Withdrawal': filtered.filter(t => t.type === 'WITHDRAWAL').length,
            'Other': filtered.filter(t => !['TRANSFER', 'PAYMENT', 'DEPOSIT', 'WITHDRAWAL'].includes(t.type)).length,
        }

        return {
            filteredTransactions: filtered,
            paymentStats: stats,
            categoryData: categories
        }
    }, [transactions, searchTerm, filterStatus, filterTimeframe, analytics])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4" />
            case 'pending':
                return <Clock className="h-4 w-4" />
            case 'failed':
                return <XCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    if (loading || transactionsLoading || analyticsLoading) {
        return <PaymentsSkeleton />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
            <motion.div
                className="p-6 space-y-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* AI-Powered Insights Banner */}
                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 backdrop-blur-sm shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 opacity-50" />
                        <motion.div
                            className="absolute top-4 right-4"
                            animate={{
                                y: [-5, 5, -5],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Brain className="h-6 w-6 text-blue-500" />
                        </motion.div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-foreground">Smart Payment Insights</h3>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                            <Zap className="h-3 w-3 mr-1" />
                                            AI Powered
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground mb-3">
                                        {paymentStats.successRate >= 90 ? "🎉 Excellent payment reliability! Your success rate is outstanding." :
                                            paymentStats.successRate >= 70 ? "👍 Good payment performance with room for optimization." :
                                                "💡 Consider reviewing failed payments to improve success rate."}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Success Rate</p>
                                            <p className="text-xl font-bold text-emerald-600">{paymentStats.successRate}%</p>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Total Volume</p>
                                            <p className="text-xl font-bold text-blue-600">${paymentStats.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Recipients</p>
                                            <p className="text-xl font-bold text-purple-600">{paymentStats.uniqueRecipients}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Avg Payment</p>
                                            <p className="text-xl font-bold text-orange-600">
                                                ${paymentStats.totalPayments > 0 ? Math.round(paymentStats.totalAmount / paymentStats.totalPayments).toLocaleString() : '0'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                            Payment Center
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage and analyze your payment transactions
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="lg" className="border-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Link href="/dashboard/wallet">
                            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                <Plus className="h-4 w-4 mr-2" />
                                New Payment
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Enhanced Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EnhancedStatsCard
                        title="Total Payments"
                        value={paymentStats.totalPayments.toString()}
                        subtitle="All time"
                        icon={CreditCard}
                        gradient="from-blue-500 to-blue-600"
                        trend={{ value: `${paymentStats.trends.paymentGrowth >= 0 ? '+' : ''}${paymentStats.trends.paymentGrowth}%`, isPositive: paymentStats.trends.paymentGrowth >= 0 }}
                    />
                    <EnhancedStatsCard
                        title="Total Volume"
                        value={`$${paymentStats.totalAmount.toLocaleString()}`}
                        subtitle="This month"
                        icon={DollarSign}
                        gradient="from-emerald-500 to-emerald-600"
                        trend={{ value: `${paymentStats.trends.amountGrowth >= 0 ? '+' : ''}${paymentStats.trends.amountGrowth}%`, isPositive: paymentStats.trends.amountGrowth >= 0 }}
                    />
                    <EnhancedStatsCard
                        title="Success Rate"
                        value={`${paymentStats.successRate}%`}
                        subtitle="Last 30 days"
                        icon={TrendingUp}
                        gradient="from-purple-500 to-purple-600"
                        trend={{ value: `${paymentStats.trends.successRateGrowth >= 0 ? '+' : ''}${paymentStats.trends.successRateGrowth}%`, isPositive: paymentStats.trends.successRateGrowth >= 0 }}
                    />
                    <EnhancedStatsCard
                        title="Recipients"
                        value={paymentStats.uniqueRecipients.toString()}
                        subtitle="Unique contacts"
                        icon={Users}
                        gradient="from-orange-500 to-orange-600"
                        trend={{ value: `+${paymentStats.uniqueRecipients}`, isPositive: true }}
                    />
                </motion.div>

                {/* Enhanced Tabs Section */}
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="payments" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm border shadow-lg">
                            <TabsTrigger value="payments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Payments
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                                <PieChart className="h-4 w-4 mr-2" />
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value="insights" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                                <Brain className="h-4 w-4 mr-2" />
                                AI Insights
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="payments" className="space-y-6">
                            {/* Filters and Search */}
                            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <Filter className="h-5 w-5 text-blue-500" />
                                            Payment History
                                        </CardTitle>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search payments..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 w-64 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20"
                                                />
                                            </div>
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger className="w-40 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Status</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="FAILED">Failed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                                                <SelectTrigger className="w-40 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20">
                                                    <SelectValue placeholder="Timeframe" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Time</SelectItem>
                                                    <SelectItem value="today">Today</SelectItem>
                                                    <SelectItem value="week">This Week</SelectItem>
                                                    <SelectItem value="month">This Month</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <AnimatePresence mode="wait">
                                        {filteredTransactions.length > 0 ? (
                                            <motion.div
                                                key="transactions"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-3"
                                            >
                                                {filteredTransactions.map((transaction, index) => (
                                                    <motion.div
                                                        key={transaction.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-white/70 dark:hover:bg-black/30 transition-all duration-300"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn(
                                                                    'p-3 rounded-xl shadow-lg',
                                                                    transaction.type === 'DEPOSIT'
                                                                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                                                                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                                                )}>
                                                                    {transaction.type === 'DEPOSIT' ? (
                                                                        <ArrowDownLeft className="h-5 w-5 text-white" />
                                                                    ) : (
                                                                        <ArrowUpRight className="h-5 w-5 text-white" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-foreground">
                                                                        {transaction.description || 'Payment Transaction'}
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right">
                                                                    <p className="text-lg font-bold text-foreground">
                                                                        ${Number(transaction.amount || 0).toLocaleString()}
                                                                    </p>
                                                                    <div className="flex items-center gap-1">
                                                                        {getStatusIcon(transaction.status)}
                                                                        <Badge className={getStatusColor(transaction.status)}>
                                                                            {transaction.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="empty"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center py-12"
                                            >
                                                <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                    <CreditCard className="w-10 h-10 text-blue-500" />
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                                                <p className="text-muted-foreground mb-4">
                                                    {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Start making payments to see them here'}
                                                </p>
                                                <Link href="/dashboard/wallet">
                                                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Make Payment
                                                    </Button>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analytics" className="space-y-6">
                            <PaymentAnalytics paymentStats={paymentStats} categoryData={categoryData} />
                        </TabsContent>

                        <TabsContent value="insights" className="space-y-6">
                            <PaymentInsights paymentStats={paymentStats} insights={analytics?.insights} />
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </motion.div>
        </div>
    )
}

// Enhanced Stats Card Component
interface EnhancedStatsCardProps {
    title: string
    value: string
    subtitle: string
    icon: React.ElementType | React.ComponentType<{ className?: string }>
    gradient: string
    trend?: {
        value: string
        isPositive: boolean
    }
}

const EnhancedStatsCard = memo(({ title, value, subtitle, icon: Icon, gradient, trend }: EnhancedStatsCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
                <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', gradient)} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

                <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                            <p className="text-3xl font-bold tracking-tight">{value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        </div>

                        <div className={cn('p-3 rounded-xl bg-gradient-to-br shadow-lg', gradient)}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {trend && (
                        <div className="flex items-center gap-1">
                            <span className={cn(
                                'text-sm font-semibold',
                                trend.isPositive ? 'text-emerald-600' : 'text-red-500'
                            )}>
                                {trend.isPositive ? '↗' : '↘'} {trend.value}
                            </span>
                            <span className="text-xs text-muted-foreground">vs last period</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
})

EnhancedStatsCard.displayName = 'EnhancedStatsCard'

// Payment Analytics Component
const PaymentAnalytics = memo(({ paymentStats, categoryData }: { paymentStats: any, categoryData: any }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-purple-500" />
                        Payment Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(categoryData).map(([category, data]: [string, any]) => (
                        <div key={category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{category}</span>
                                <div className="text-right">
                                    <div className="font-semibold">{data.count} payments</div>
                                    <div className="text-xs text-muted-foreground">${data.amount?.toLocaleString() || 0}</div>
                                </div>
                            </div>
                            <Progress
                                value={data.percentage || 0}
                                className="h-2"
                            />
                            <div className="text-xs text-muted-foreground">
                                {data.percentage || 0}% of total transactions
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-emerald-500" />
                        Performance Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                            <p className="text-2xl font-bold text-emerald-600">{paymentStats.successfulPayments}</p>
                            <p className="text-sm text-muted-foreground">Successful</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl">
                            <p className="text-2xl font-bold text-yellow-600">{paymentStats.pendingPayments}</p>
                            <p className="text-sm text-muted-foreground">Pending</p>
                        </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
                        <p className="text-2xl font-bold text-red-600">{paymentStats.failedPayments}</p>
                        <p className="text-sm text-muted-foreground">Failed Payments</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
})

PaymentAnalytics.displayName = 'PaymentAnalytics'

// Payment Insights Component
const PaymentInsights = memo(({ paymentStats, insights }: { paymentStats: any, insights?: any[] }) => {
    const defaultInsights = [
        {
            icon: Brain,
            title: "Payment Patterns",
            value: "Peak Hours: 2-4 PM",
            description: "Most payments occur during afternoon hours",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: TrendingUp,
            title: "Growth Trend",
            value: "+15% Monthly",
            description: "Payment volume is increasing steadily",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: Target,
            title: "Optimization",
            value: "Reduce Failed Rate",
            description: "Focus on improving payment success rate",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: Users,
            title: "User Behavior",
            value: "Repeat Customers",
            description: `${Math.round(paymentStats.uniqueRecipients / paymentStats.totalPayments * 100)}% are returning recipients`,
            color: "from-blue-500 to-blue-600"
        }
    ]

    const displayInsights = insights || defaultInsights

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayInsights.map((insight, index) => {
                const IconComponent = insight.icon === 'Brain' ? Brain :
                                    insight.icon === 'TrendingUp' ? TrendingUp :
                                    insight.icon === 'Target' ? Target :
                                    insight.icon === 'Users' ? Users : Brain

                return (
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
                                        <IconComponent className="h-6 w-6 text-white" />
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
            )
            })}
        </div>
    )
})

PaymentInsights.displayName = 'PaymentInsights'

// Loading Skeleton
const PaymentsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
            <div className="p-6 space-y-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
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

                <Card className="border-0 shadow-lg bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="animate-pulse flex justify-between items-center p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-muted rounded-xl"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-muted rounded w-32"></div>
                                            <div className="h-3 bg-muted rounded w-24"></div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="h-4 bg-muted rounded w-20"></div>
                                        <div className="h-3 bg-muted rounded w-16"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default PaymentsPage
