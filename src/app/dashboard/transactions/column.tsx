'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export type Transaction = {
  id: string
  trnxType: string
  type?: 'CREDIT' | 'DEBIT'
  purpose: string
  description?: string
  senderId: string
  recipientId: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | string
  trnxSummary: string
  createdAt: Date
  updatedAt: Date
  walletId: string
  category?: string
  sender?: {
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
  recipient?: {
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
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
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Transaction Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
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
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      return formattedDate
    },
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
