'use client'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import React, { useEffect } from 'react'

import { getAllTransactionsByUserId } from '@/lib/actions/transactions.actions'
import { useAuth } from '@clerk/nextjs'
import { Transaction } from '@prisma/client'
import TransactionsTable from '../wallet/components/WalletTransactionsTable'

const Transactions = () => {
  const { userId } = useAuth()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (userId) {
      setLoading(true)
      getAllTransactionsByUserId(userId).then((res) => {
        setTransactions(res.transactions!)
        setLoading(false)
      })
    }
  }, [userId])

  return (
    <div className='flex flex-col p-4 relative '>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
        <BreadcrumbItem href='/dashboard/transactions'>Transaction</BreadcrumbItem>
      </Breadcrumbs>
      <TransactionsTable
        transactionHeading='All Transactions'
        transactions={transactions}
        loading={loading}
        itemsPerPage={20}
      />
    </div>
  )
}

export default Transactions
