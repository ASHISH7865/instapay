'use client'
import React, { useEffect } from 'react'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import AddMoneyModal from '@/components/modal/add-money'
import CheckBalance from './components/CheckBalance'
import TransactionsTable from './components/WalletTransactionsTable'
import { Transaction } from '@prisma/client'
import { useAuth } from '@clerk/nextjs'
import { getWalletDepositTransactions } from '@/lib/actions/transactions.actions'
import PaymentCard from '../payments/components/PaymentCard'

const Wallet = () => {
  const { userId } = useAuth()
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (userId) {
      setLoading(true)
      getWalletDepositTransactions(userId).then((res) => {
        setTransactions(res.transactions!)
        setLoading(false)
      })
    }
  }, [userId])

  return (
    <div className='flex flex-col p-4 relative'>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
        <BreadcrumbItem href='/dashboard/Wallet'>Wallet</BreadcrumbItem>
      </Breadcrumbs>

      <div className='mt-5 flex justify-between'>
        <p className='text-2xl font-bold'>Wallet Dashboard</p>
        <AddMoneyModal />
      </div>
      <div className='flex flex-row  gap-2 flex-wrap mt-10'>
        <CheckBalance />
        <PaymentCard
          title='Send Money'
          buttonText='Send Money'
          description='Send money to another wallet'
          transactionLimit={2000}
        />
      </div>
      <TransactionsTable
        transactionHeading='Deposit Transactions'
        transactions={transactions}
        loading={loading}
      />
    </div>
  )
}

export default Wallet
