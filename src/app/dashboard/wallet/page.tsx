'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Eye,
    EyeOff,
    CreditCard,
    History,
    ArrowUpRight,
    ArrowDownLeft,
    MoreVertical,
    Sparkles,
    Zap,
    Brain,
    Target,
    PieChart,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    ChevronRight,
    Activity,
    DollarSign,
    Coins,
    TrendingUpIcon,
    Send
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import AddMoneyModal from '@/components/modal/add-money-v2'
import { SendMoneyModal } from '@/components/modal/send-money-v3'
import WalletActionsModal from '@/components/modal/wallet-actions'
import { formatDistanceToNow } from 'date-fns'
import { useWalletContext } from '@/provider/wallet-provider'
import { useWallets } from '@/hooks/useWalletRTK'
import { useWalletAnalytics } from '@/hooks/useWalletRTK'

// Types
interface SmartInsight {
    type: 'warning' | 'info' | 'alert' | 'success'
    title: string
    description: string
    action: string
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    }
}

const glassVariants = {
    hover: {
        y: -2,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    }
}

const WalletPage = () => {
    const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false)
    const { userId } = useAuth()
    const { userWallet, setUserWallet } = useWalletContext()
    const [recentTransactions, setRecentTransactions] = useState<Array<{
        id: string
        type: string
        amount: number
        purpose: string
        createdAt: Date
        currency: string
        status: string
    }>>([])
    const [smartInsights, setSmartInsights] = useState<SmartInsight[]>([])
    const [balanceVisible, setBalanceVisible] = useState(true)
    const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month')
    const [refreshing, setRefreshing] = useState(false)

    // Real API hooks
    const { wallets, isLoading: walletsLoading } = useWallets()
    const defaultWallet = wallets?.data?.find((wallet) => wallet.isDefault)
    const { analytics, isLoading: analyticsLoading } = useWalletAnalytics({
        timeframe: selectedTimeframe,
        walletId: defaultWallet?.id,
    })

    // Fetch other data - now using real APIs
    const fetchOtherData = async () => {
        if (!userId) return

        try {
            // Use real analytics data instead of mock data
            if (analytics) {
                const recentTxns = analytics.recentTransactions?.map(t => ({
                    id: t.id,
                    type: t.type,
                    amount: Number(t.amount),
                    purpose: t.description,
                    createdAt: new Date(t.createdAt),
                    currency: 'INR',
                    status: 'COMPLETED'
                })) || []

                setRecentTransactions(recentTxns)

                // Generate smart insights from real data
                const insights: SmartInsight[] = []
                if (analytics?.savingsRate < 90) {
                    insights.push({
                        type: 'warning',
                        title: 'Payment Success Rate',
                        description: `Your payment success rate is 90%. Consider reviewing failed transactions.`,
                        action: 'Review Transactions'
                    })
                }
                setSmartInsights(insights)
            }
        } catch (error) {
            console.error('Error fetching other data:', error)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchOtherData()
        setRefreshing(false)
    }

    // Update user wallet context when default wallet changes
    useEffect(() => {
        if (defaultWallet) {
            setUserWallet(defaultWallet)
        }
    }, [defaultWallet, setUserWallet])

    useEffect(() => {
        fetchOtherData()
    }, [userId, selectedTimeframe])

    const loading = walletsLoading || analyticsLoading

    // Memoized calculations (use analytics)
    const balanceChange = analytics?.balanceChange ?? 0
    const savingsProgress = analytics ? Math.min((analytics.savingsRate / 20) * 100, 100) : 0

    if (loading) {
        return <WalletSkeleton />
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header with Glass Morphism */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                                <Wallet className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Wallet Dashboard
                                </h1>
                                <p className="text-lg text-muted-foreground">Your financial command center</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select value={selectedTimeframe} onValueChange={(value: 'week' | 'month' | 'year') => setSelectedTimeframe(value)}>
                            <SelectTrigger className="w-[140px] bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-0 shadow-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>

                        <Button variant="outline" size="sm" className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </motion.div>

                {/* Smart Insights Banner */}
                <AnimatePresence>
                    {smartInsights.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            variants={itemVariants}
                        >
                            <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 border-0 shadow-xl backdrop-blur-md">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                            <Brain className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-purple-500" />
                                                AI Financial Insights
                                            </h3>
                                            <div className="grid gap-3">
                                                {smartInsights.slice(0, 2).map((insight, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm">{insight.title}</p>
                                                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="text-xs">
                                                            {insight.action} <ChevronRight className="h-3 w-3 ml-1" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Balance Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Primary Balance Card */}
                    <motion.div
                        className="xl:col-span-2"
                        whileHover="hover"
                        variants={glassVariants}
                    >
                        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5" />
                            <CardHeader className="relative pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            <DollarSign className="h-5 w-5" />
                                        </div>
                                        Available Balance
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setBalanceVisible(!balanceVisible)}
                                        className="hover:bg-white/50 dark:hover:bg-gray-800/50"
                                    >
                                        {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="space-y-6">
                                    {/* Main Balance Display */}
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <motion.div
                                                className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                                                animate={{ scale: balanceVisible ? 1 : 0.9 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {balanceVisible
                                                    ? `$${Number(userWallet?.balance || 0).toLocaleString()}`
                                                    : '••••••'
                                                }
                                            </motion.div>
                                            <div className="flex items-center gap-2">
                                                {balanceChange >= 0 ? (
                                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                                )}
                                                <span className={`text-sm font-medium ${balanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {balanceChange >= 0 ? '+' : ''}{balanceChange.toFixed(1)}% this {selectedTimeframe}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                                            <Wallet className="h-12 w-12 text-blue-600" />
                                        </div>
                                    </div>

                                    {/* Financial Overview */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-muted-foreground">Income</span>
                                            </div>
                                            <p className="text-xl font-semibold text-green-600">
                                                +${analytics?.monthlyIncome?.toLocaleString() || '0'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <ArrowUpRight className="h-4 w-4 text-red-500" />
                                                <span className="text-sm text-muted-foreground">Expenses</span>
                                            </div>
                                            <p className="text-xl font-semibold text-red-600">
                                                -${analytics?.monthlySpending?.toLocaleString() || '0'}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Target className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm text-muted-foreground">Savings</span>
                                            </div>
                                            <p className="text-xl font-semibold text-blue-600">
                                                {analytics?.savingsRate?.toFixed(1) || '0'}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Savings Progress */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Savings Goal Progress</span>
                                            <span className="text-sm text-muted-foreground">{savingsProgress.toFixed(0)}%</span>
                                        </div>
                                        <Progress value={savingsProgress} className="h-2" />
                                        <p className="text-xs text-muted-foreground">Target: 20% savings rate</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div whileHover="hover" variants={glassVariants}>
                        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-green-600 text-white">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className=" flex flex-col gap-4">
                                <AddMoneyModal />
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 bg-white/50 dark:bg-gray-800/50 border-0 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                                    onClick={() => setIsSendMoneyModalOpen(true)}
                                >
                                    <Send className="h-4 w-4 mr-3" />
                                    Send Money
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-12 bg-white/50 dark:bg-gray-800/50 border-0 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                                    <CreditCard className="h-4 w-4 mr-3" />
                                    Pay Bills
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-12 bg-white/50 dark:bg-gray-800/50 border-0 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                                    <Activity className="h-4 w-4 mr-3" />
                                    Invest Money
                                </Button>
                                <WalletActionsModal />
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Analytics Dashboard */}
                <motion.div variants={itemVariants}>
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg p-1">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md">
                                Analytics
                            </TabsTrigger>
                            <TabsTrigger value="transactions" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md">
                                Transactions
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                {/* Stats Cards */}
                                <motion.div whileHover="hover" variants={glassVariants}>
                                    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                                                    <p className="text-2xl font-bold">{analytics?.totalTransactions || 0}</p>
                                                </div>
                                                <div className="p-3 rounded-full bg-blue-500/20">
                                                    <History className="h-6 w-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div whileHover="hover" variants={glassVariants}>
                                    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Daily Average</p>
                                                    <p className="text-2xl font-bold">${analytics?.dailySpending?.toFixed(0) || 0}</p>
                                                </div>
                                                <div className="p-3 rounded-full bg-purple-500/20">
                                                    <Calendar className="h-6 w-6 text-purple-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div whileHover="hover" variants={glassVariants}>
                                    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Projected Balance</p>
                                                    <p className="text-2xl font-bold">${analytics?.projectedBalance?.toFixed(0) || 0}</p>
                                                </div>
                                                <div className="p-3 rounded-full bg-green-500/20">
                                                    <TrendingUpIcon className="h-6 w-6 text-green-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div whileHover="hover" variants={glassVariants}>
                                    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Available</p>
                                                    <p className="text-2xl font-bold">${Number(userWallet?.availableBalance || 0).toLocaleString()}</p>
                                                </div>
                                                <div className="p-3 rounded-full bg-teal-500/20">
                                                    <Coins className="h-6 w-6 text-teal-600" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </div>

                            {/* Top Categories */}
                            {analytics?.topCategories && analytics.topCategories.length > 0 && (
                                <motion.div whileHover="hover" variants={glassVariants}>
                                    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <PieChart className="h-5 w-5" />
                                                Top Spending Categories
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {analytics.topCategories.slice(0, 5).map((category, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${index === 0 ? 'from-blue-500 to-blue-600' :
                                                                index === 1 ? 'from-purple-500 to-purple-600' :
                                                                    index === 2 ? 'from-teal-500 to-teal-600' :
                                                                        index === 3 ? 'from-orange-500 to-orange-600' :
                                                                            'from-pink-500 to-pink-600'
                                                                }`} />
                                                            <span className="font-medium capitalize">{category.category.toLowerCase().replace('_', ' ')}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">${category.amount.toLocaleString()}</p>
                                                            <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </TabsContent>

                        {/* Analytics Tab */}
                        <TabsContent value="analytics" className="space-y-6">
                            <motion.div whileHover="hover" variants={glassVariants}>
                                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Spending Trend</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                                            <p>Advanced analytics charts coming soon...</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        {/* Transactions Tab */}
                        <TabsContent value="transactions" className="space-y-6">
                            <motion.div whileHover="hover" variants={glassVariants}>
                                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Recent Transactions</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    Filter
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {recentTransactions.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 w-fit mx-auto mb-4">
                                                    <Wallet className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                                                <p className="text-muted-foreground mb-4">Your transaction history will appear here</p>
                                                <div className="flex gap-2 justify-center">
                                                    <AddMoneyModal />
                                                    <Button
                                                        onClick={() => setIsSendMoneyModalOpen(true)}
                                                        className="bg-gradient-to-r from-blue-500 to-blue-600"
                                                    >
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Send Money
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {recentTransactions.slice(0, 8).map((transaction, index: number) => (
                                                    <motion.div
                                                        key={transaction.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 border border-gray-200/20"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-3 rounded-full ${transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT'
                                                                ? 'bg-green-100 dark:bg-green-900/20'
                                                                : 'bg-red-100 dark:bg-red-900/20'
                                                                }`}>
                                                                {transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT' ? (
                                                                    <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                                ) : (
                                                                    <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{transaction.purpose}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className={`font-semibold ${transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT'
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-foreground'
                                                                }`}>
                                                                {transaction.type === 'DEPOSIT' || transaction.type === 'CREDIT' ? '+' : '-'}${Number(transaction.amount).toLocaleString()}
                                                            </p>
                                                            <Badge variant="secondary" className="mt-1">
                                                                {transaction.status}
                                                            </Badge>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* Send Money Modal */}
            <SendMoneyModal
                isOpen={isSendMoneyModalOpen}
                onClose={() => setIsSendMoneyModalOpen(false)}
            />
        </motion.div>
    )
}

// Enhanced Loading skeleton component
const WalletSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-14 w-14 rounded-2xl" />
                            <div>
                                <Skeleton className="h-8 w-64 mb-2" />
                                <Skeleton className="h-5 w-48" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>

                {/* Main Cards Skeleton */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl">
                            <CardContent className="p-6">
                                <Skeleton className="h-16 w-64 mb-6" />
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
                                            <Skeleton className="h-4 w-16 mb-2" />
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-2 w-full" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-2xl">
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-6 w-32 mb-4" />
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-8 w-16" />
                                    </div>
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Transactions Skeleton */}
                <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-0 shadow-lg">
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div>
                                            <Skeleton className="h-4 w-32 mb-1" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-3 w-12" />
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

export default WalletPage
