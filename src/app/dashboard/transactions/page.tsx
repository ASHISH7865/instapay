'use client'

import React from 'react'
import { useTransactions, useTransactionSummary } from '@/hooks/useTransactionsRTK'
import { useWallets } from '@/hooks/useWalletRTK'
import type { Transaction } from '@/lib/store/slices/transactionApi'
import { useAuth } from '@clerk/nextjs'
import TransactionsPage from './TransactionPage'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

// Loading skeleton component
const TransactionsSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40 p-6 space-y-8 max-w-7xl mx-auto">
        <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
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

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
)

// Client Component
const Transactions = () => {
    useAuth() // Ensure authentication is checked

    // Fetch real data using our hooks
    const { transactions: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useTransactions({
        limit: 100, // Get more transactions for better filtering
        page: 1
    })

    const { isLoading: summaryLoading } = useTransactionSummary('month')
    const { isLoading: walletsLoading } = useWallets()

    // Show loading skeleton while data is loading
    if (transactionsLoading || summaryLoading || walletsLoading) {
        return <TransactionsSkeleton />
    }

    // Handle error state
    if (transactionsError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/40 p-6">
                <div className="max-w-7xl mx-auto text-center py-12">
                    <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mx-auto mb-4">
                        <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Failed to load transactions</h3>
                    <p className="text-muted-foreground mb-4">
                        {'An error occurred while loading your transactions'}
                    </p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    // Transform API data to match the expected Transaction type
    const transformedTransactions = (transactionsData || []).map((transaction: Transaction) => ({
        id: transaction.id,
        trnxType: transaction.type,
        type: (transaction.type === 'DEPOSIT' ? 'CREDIT' : 'DEBIT') as 'CREDIT' | 'DEBIT',
        purpose: transaction.description,
        description: transaction.description,
        senderId: transaction.senderId || transaction.userId,
        recipientId: transaction.recipientId || 'unknown',
        amount: transaction.amount,
        balanceBefore: transaction.balanceBefore,
        balanceAfter: transaction.balanceAfter,
        status: transaction.status,
        trnxSummary: transaction.description,
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
        walletId: transaction.walletId,
        category: transaction.category,
        sender: transaction.sender,
        recipient: transaction.recipient
    }))

    return <TransactionsPage transactions={transformedTransactions} />
}

export default Transactions
