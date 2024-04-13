/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { AreaChartComponent } from '@/components/charts/Charts'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import { getRecentTransactions, getTotalAmount, getTotalBalanceChartData } from '@/lib/actions/dashboard.actions'
import { months } from '@/lib/utils'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { isLoaded, userId } = useAuth()
  const { user: userData } = useUser()

  const { isLoaded: isUserLoaded, isSignedIn } = useUser()
  const [depositData, setDepositData] = useState<any>([])
  const [recentTransactions, setRecentTransactions] = useState<any>([])
  const [totalTransactionsAmount, setTotalTransactionsAmount] = useState<any>(null)

  // In case the user signs out while on the page.
  if (!isLoaded || !userId || !isUserLoaded || !isSignedIn) {
    return null
  }


  useEffect(() => {
    getTotalBalanceChartData(userId).then((data) => {
      setDepositData(data?.totalBalanceChartData)
    })

    getRecentTransactions(userId).then((data) => {
      setRecentTransactions(data?.recentTransactions)
    })

    getTotalAmount(userId).then((data) => {
      setTotalTransactionsAmount(data)
    })
  }, [userId])
  console.log(recentTransactions)
  return (
    <div className='flex flex-col p-4'>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className='text-2xl font-bold '>
        Welcome back, {userData?.fullName}
      </h1>
      <div className="grid grid-cols-3 w-full gap-10  mt-20">
        <div className='h-[200px] col-span-3 mb-20'>
          {depositData.length > 1 ?
            <>
              <AreaChartComponent data={depositData} />
              <p className='text-md text-center'>Credit and Debit Transactions</p>
            </> :
            <p className='text-md text-center'>No transactions yet</p>
          }
        </div>
        <div className='col-span-full lg:col-span-1'>
          <StatisticsCard title='Credit' amount={totalTransactionsAmount?.totalCreditAmount} />
        </div>
        <div className='col-span-full lg:col-span-1'>
          <StatisticsCard title='Debit' amount={totalTransactionsAmount?.totalDebitAmount} />
        </div>
        <div className='col-span-full lg:col-span-1'>
          {
            recentTransactions.length > 1 && <RecentTransactionCard transactions={recentTransactions} />
          }
        </div>
      </div>
    </div>
  )
}


const RecentTransactionCard = ({ transactions }: { transactions: any }) => {
  console.log(transactions)
  return (
    <div className='border p-4 rounded-lg shadow-md'>
      <h2 className='text-md font-bold text-center'>Recent Transactions</h2>
      {transactions.map((transaction: any) => {
        return (
          <div key={transaction.id} className='flex justify-between items-center mt-4'>
            <div>
              <p className='text-md font-semibold'>{transaction?.purpose}</p>
              <p className='text-sm text-gray-500'>{transaction.createdAt.getDate() + "-" + months[transaction.createdAt.getMonth()].short + "-" + transaction.createdAt.getFullYear()}</p>
            </div>
            <div>
              <p className='text-lg font-semibold'>{transaction?.amount}</p>
              <p className='text-sm text-gray-500'>{transaction?.currency}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const StatisticsCard = ({ title, amount }: { title: string, amount: any }) => {

  return (
    <div className='border p-4 rounded-lg shadow-md'>
      <div className='flex justify-between items-center mt-4'>
        <div>
          <p className='text-md font-semibold'>Total {title} Amount</p>
          <p className='text-sm text-gray-500'>Total amount of {title} transactions</p>
        </div>
        <div>
          <p className='text-lg font-semibold'>{amount}</p>
        </div>
      </div>
    </div>
  )
}