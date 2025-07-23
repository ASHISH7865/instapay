
'use client'
import React, { useState, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { DataTable } from './data-table'
import { columns } from './column'
import {
    Search,
    Filter,
    Eye,
    TrendingUp,
    TrendingDown,
    DollarSign,
    BarChart3,
    PieChart,
    Sparkles,
    Brain,
    Zap,
    Target,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    FileText,
    type LucideIcon
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Import Transaction type from column.tsx to maintain consistency
import { Transaction } from './column'

interface TransactionStats {
    totalTransactions: number
    totalAmount: number
    totalIncome: number
    totalExpenses: number
    successfulTransactions: number
    pendingTransactions: number
    failedTransactions: number
    avgTransactionAmount: number
    successRate: number
}

interface CategoryData {
    [key: string]: number
}

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

interface TransactionsPageProps {
    transactions: Transaction[]
}

const TransactionsPage = ({ transactions: initialTransactions }: TransactionsPageProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [filterTimeframe, setFilterTimeframe] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [isExporting, setIsExporting] = useState(false)

    // Enhanced filtering and calculations with real data
    const { filteredTransactions, transactionStats, categoryData } = useMemo(() => {
        const filtered = (initialTransactions || []).filter((transaction: Transaction) => {
            const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.trnxType?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
            const matchesType = filterType === 'all' || transaction.type === filterType

            let matchesTimeframe = true
            if (filterTimeframe !== 'all') {
                const transactionDate = new Date(transaction.createdAt)
                const now = new Date()

                switch (filterTimeframe) {
                    case 'today': {
                        matchesTimeframe = transactionDate.toDateString() === now.toDateString()
                        break
                    }
                    case 'week': {
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        matchesTimeframe = transactionDate >= weekAgo
                        break
                    }
                    case 'month': {
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        matchesTimeframe = transactionDate >= monthAgo
                        break
                    }
                }
            }

            return matchesSearch && matchesStatus && matchesType && matchesTimeframe
        })

        // Calculate transaction statistics
        const stats: TransactionStats = {
            totalTransactions: filtered.length,
            totalAmount: filtered.reduce((sum: number, t: Transaction) => sum + Math.abs(Number(t.amount || 0)), 0),
            totalIncome: filtered.filter((t: Transaction) => t.type === 'CREDIT').reduce((sum: number, t: Transaction) => sum + Number(t.amount || 0), 0),
            totalExpenses: filtered.filter((t: Transaction) => t.type === 'DEBIT').reduce((sum: number, t: Transaction) => sum + Number(t.amount || 0), 0),
            successfulTransactions: filtered.filter((t: Transaction) => t.status === 'COMPLETED').length,
            pendingTransactions: filtered.filter((t: Transaction) => t.status === 'PENDING').length,
            failedTransactions: filtered.filter((t: Transaction) => t.status === 'FAILED').length,
            avgTransactionAmount: filtered.length > 0 ? filtered.reduce((sum: number, t: Transaction) => sum + Math.abs(Number(t.amount || 0)), 0) / filtered.length : 0,
            successRate: 0
        }

        const successRate = stats.totalTransactions > 0 ? Math.round((stats.successfulTransactions / stats.totalTransactions) * 100) : 0
        stats.successRate = successRate

        // Enhanced category analysis based on transaction types
        const categories: CategoryData = {
            'Deposits': filtered.filter((t: Transaction) => t.trnxType === 'DEPOSIT').length,
            'Withdrawals': filtered.filter((t: Transaction) => t.trnxType === 'WITHDRAWAL').length,
            'Transfers': filtered.filter((t: Transaction) => t.trnxType === 'TRANSFER').length,
            'Payments': filtered.filter((t: Transaction) => t.trnxType === 'PAYMENT').length,
            'Refunds': filtered.filter((t: Transaction) => t.trnxType === 'REFUND').length,
            'Fees': filtered.filter((t: Transaction) => t.trnxType === 'FEE').length,
            'Other': filtered.filter((t: Transaction) => !['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT', 'REFUND', 'FEE'].includes(t.trnxType)).length
        }

        return {
            filteredTransactions: filtered,
            transactionStats: stats,
            categoryData: categories
        }
    }, [initialTransactions, searchTerm, filterStatus, filterType, filterTimeframe])

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
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
        switch (status?.toLowerCase()) {
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

    // Export transactions to CSV
    const exportToCSV = () => {
        setIsExporting(true)

        const headers = ['ID', 'Type', 'Amount', 'Status', 'Description', 'Date', 'Category']
        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                t.id,
                t.trnxType,
                t.amount,
                t.status,
                t.description || t.purpose,
                new Date(t.createdAt).toLocaleDateString(),
                t.category || 'Other'
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setIsExporting(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40">
            <motion.div
                className="p-6 space-y-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Breadcrumbs */}
                <motion.div variants={itemVariants}>
                    <Breadcrumbs>
                        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem href='/dashboard/transactions'>Transactions</BreadcrumbItem>
                    </Breadcrumbs>
                </motion.div>

                {/* AI-Powered Insights Banner */}
                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 opacity-50" />
                        <motion.div
                            className="absolute top-4 right-4"
                            animate={{
                                y: [-5, 5, -5],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <BarChart3 className="h-6 w-6 text-emerald-500" />
                        </motion.div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl shadow-lg">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-foreground">Transaction Intelligence</h3>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                            <Zap className="h-3 w-3 mr-1" />
                                            Smart Analytics
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground mb-3">
                                        {transactionStats.successRate >= 95 ? "🎉 Outstanding transaction success rate! Your financial operations are highly reliable." :
                                            transactionStats.successRate >= 85 ? "👍 Great transaction performance with excellent success rate." :
                                                "💡 Consider optimizing transaction processes for better success rate."}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Success Rate</p>
                                            <p className="text-xl font-bold text-emerald-600">{transactionStats.successRate}%</p>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Total Volume</p>
                                            <p className="text-xl font-bold text-blue-600">${transactionStats.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Avg Amount</p>
                                            <p className="text-xl font-bold text-purple-600">${Math.round(transactionStats.avgTransactionAmount).toLocaleString()}</p>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                                            <p className="text-sm text-muted-foreground">Net Flow</p>
                                            <p className={`text-xl font-bold ${transactionStats.totalIncome >= transactionStats.totalExpenses ? 'text-emerald-600' : 'text-red-600'}`}>
                                                ${Math.abs(transactionStats.totalIncome - transactionStats.totalExpenses).toLocaleString()}
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
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Transaction Center
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Comprehensive view of all your financial transactions
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={exportToCSV}
                            disabled={isExporting}
                            className="border-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isExporting ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <FileText className="h-4 w-4 mr-2" />
                            )}
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                            className="border-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {viewMode === 'grid' ? <BarChart3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
                        </Button>
                    </div>
                </motion.div>

                {/* Enhanced Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EnhancedStatsCard
                        title="Total Transactions"
                        value={transactionStats.totalTransactions.toString()}
                        subtitle="All time"
                        icon={BarChart3}
                        gradient="from-emerald-500 to-emerald-600"
                        trend={{ value: "+18%", isPositive: true }}
                    />
                    <EnhancedStatsCard
                        title="Total Income"
                        value={`$${transactionStats.totalIncome.toLocaleString()}`}
                        subtitle="Credit transactions"
                        icon={TrendingUp}
                        gradient="from-blue-500 to-blue-600"
                        trend={{ value: "+12%", isPositive: true }}
                    />
                    <EnhancedStatsCard
                        title="Total Expenses"
                        value={`$${transactionStats.totalExpenses.toLocaleString()}`}
                        subtitle="Debit transactions"
                        icon={TrendingDown}
                        gradient="from-orange-500 to-red-500"
                        trend={{ value: "+5%", isPositive: false }}
                    />
                    <EnhancedStatsCard
                        title="Success Rate"
                        value={`${transactionStats.successRate}%`}
                        subtitle="Completed transactions"
                        icon={Target}
                        gradient="from-purple-500 to-purple-600"
                        trend={{ value: "+3%", isPositive: true }}
                    />
                </motion.div>

                {/* Enhanced Tabs Section */}
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="transactions" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm border shadow-lg">
                            <TabsTrigger value="transactions" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                                <PieChart className="h-4 w-4 mr-2" />
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value="insights" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                                <Brain className="h-4 w-4 mr-2" />
                                AI Insights
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="transactions" className="space-y-6">
                            {/* Filters and Search */}
                            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <Filter className="h-5 w-5 text-emerald-500" />
                                            All Transactions ({filteredTransactions.length})
                                        </CardTitle>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search transactions..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 w-64 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20"
                                                />
                                            </div>
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger className="w-32 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20">
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Status</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="FAILED">Failed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={filterType} onValueChange={setFilterType}>
                                                <SelectTrigger className="w-32 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Types</SelectItem>
                                                    <SelectItem value="CREDIT">Credit</SelectItem>
                                                    <SelectItem value="DEBIT">Debit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={filterTimeframe} onValueChange={setFilterTimeframe}>
                                                <SelectTrigger className="w-32 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20">
                                                    <SelectValue placeholder="Time" />
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
                                        {viewMode === 'table' ? (
                                            <motion.div
                                                key="table"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="rounded-xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                                            >
                                                <DataTable columns={columns} data={filteredTransactions} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="grid"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="space-y-3"
                                            >
                                                {filteredTransactions.length > 0 ? (
                                                    filteredTransactions.map((transaction: Transaction, index: number) => (
                                                        <motion.div
                                                            key={transaction.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.03 }}
                                                            className="p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 hover:bg-white/70 dark:hover:bg-black/30 transition-all duration-300"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={cn(
                                                                        'p-3 rounded-xl shadow-lg',
                                                                        transaction.type === 'CREDIT'
                                                                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                                                                            : 'bg-gradient-to-br from-red-500 to-red-600'
                                                                    )}>
                                                                        {transaction.type === 'CREDIT' ? (
                                                                            <ArrowDownLeft className="h-5 w-5 text-white" />
                                                                        ) : (
                                                                            <ArrowUpRight className="h-5 w-5 text-white" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold text-foreground">
                                                                            {transaction.purpose || transaction.description || 'Transaction'}
                                                                        </h3>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-right">
                                                                        <p className={cn(
                                                                            "text-lg font-bold",
                                                                            transaction.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'
                                                                        )}>
                                                                            {transaction.type === 'CREDIT' ? '+' : '-'}${Number(transaction.amount || 0).toLocaleString()}
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
                                                    ))
                                                ) : (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-center py-12"
                                                    >
                                                        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                            <BarChart3 className="w-10 h-10 text-emerald-500" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                                                        <p className="text-muted-foreground mb-4">
                                                            {searchTerm || filterStatus !== 'all' || filterType !== 'all' ? 'Try adjusting your filters' : 'Start making transactions to see them here'}
                                                        </p>
                                                        <Link href="/dashboard/wallet">
                                                            <Button className="bg-gradient-to-r from-emerald-500 to-blue-600">
                                                                Create Transaction
                                                            </Button>
                                                        </Link>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analytics" className="space-y-6">
                            <TransactionAnalytics transactionStats={transactionStats} categoryData={categoryData} />
                        </TabsContent>

                        <TabsContent value="insights" className="space-y-6">
                            <TransactionInsights transactionStats={transactionStats} />
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
    icon: LucideIcon
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

// Transaction Analytics Component
const TransactionAnalytics = memo(({ transactionStats, categoryData }: { transactionStats: TransactionStats, categoryData: CategoryData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-emerald-500" />
                        Transaction Categories
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(categoryData).map(([category, count]: [string, number]) => (
                        <div key={category} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{category}</span>
                                <span>{count} transactions</span>
                            </div>
                            <Progress
                                value={transactionStats.totalTransactions > 0 ? (count / transactionStats.totalTransactions) * 100 : 0}
                                className="h-2"
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        Financial Health
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                            <p className="text-2xl font-bold text-emerald-600">${transactionStats.totalIncome.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Income</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
                            <p className="text-2xl font-bold text-red-600">${transactionStats.totalExpenses.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Expenses</p>
                        </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                        <p className={`text-2xl font-bold ${transactionStats.totalIncome >= transactionStats.totalExpenses ? 'text-emerald-600' : 'text-red-600'}`}>
                            ${Math.abs(transactionStats.totalIncome - transactionStats.totalExpenses).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
})

TransactionAnalytics.displayName = 'TransactionAnalytics'

// Transaction Insights Component
const TransactionInsights = memo(({ transactionStats }: { transactionStats: TransactionStats }) => {
    const insights = [
        {
            icon: Brain,
            title: "Spending Pattern",
            value: "Consistent",
            description: "Your transaction patterns show consistent behavior",
            color: "from-emerald-500 to-emerald-600"
        },
        {
            icon: TrendingUp,
            title: "Growth Rate",
            value: "+23% Monthly",
            description: "Transaction volume is growing steadily",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Target,
            title: "Success Rate",
            value: `${transactionStats.successRate}%`,
            description: "Excellent transaction completion rate",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: DollarSign,
            title: "Avg Transaction",
            value: `$${Math.round(transactionStats.avgTransactionAmount)}`,
            description: "Average transaction amount this period",
            color: "from-orange-500 to-orange-600"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

TransactionInsights.displayName = 'TransactionInsights'

export default TransactionsPage
