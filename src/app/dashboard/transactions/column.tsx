'use client'

import { ColumnDef } from '@tanstack/react-table'

export type Transaction = {
  id: string
  trnxType: string
  purpose: string
  senderId: string
  recipientId: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  status: string
  trnxSummary: string
  createdAt: Date
  updatedAt: Date
  walletId: string
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'senderId',
    header: 'Sender ID',
  },
  {
    accessorKey: 'recipientId',
    header: 'Recipient ID',
  },
  {
    accessorKey: 'trnxType',
    header: 'Type',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'purpose',
    header: 'Purpose',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date of Transaction',
    cell : ({row}) => {
      const date = new Date(row.original.createdAt)
      const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      return formattedDate
    }
  },
  {
    accessorKey: 'balanceBefore',
    header: 'Balance Before',
  },
  {
    accessorKey: 'balanceAfter',
    header: 'Balance After',
  },

]
