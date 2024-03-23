/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'

import { getAllTransactionsByUserId } from '@/lib/actions/transactions.actions'
import { auth } from '@clerk/nextjs'
import { DataTable } from './data-table'
import { columns } from './column'

const Transactions = async () => {
  const { userId } = auth()

  const transactions = await getAllTransactionsByUserId(userId ?? '')

  return (
    <div className='flex flex-col p-4 relative '>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
        <BreadcrumbItem href='/dashboard/transactions'>Transaction</BreadcrumbItem>
      </Breadcrumbs>
      {/* <TransactionsTable
        transactionHeading='All Transactions'
        transactions={transactions}
        loading={loading}
        itemsPerPage={20}
      /> */}
      <p className='text-2xl font-bold text-primary-100'>All Transactions</p>
        <DataTable columns={columns} data={transactions.transactions as any} />
    </div>
  )
}

export default Transactions
