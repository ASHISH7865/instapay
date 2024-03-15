import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Transaction } from '@prisma/client'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

const Table_Header = [
  'ID',
  'Type',
  'Amount Added',
  'Status',
  'Purpose',
  'Date of Transaction',
  'Balance Before',
  'Balance After',
]

const renderSkeletonRow = () => (
  <TableRow>
    <TableCell>
      <Skeleton className='w-10 h-5' />
    </TableCell>
    <TableCell>
      <Skeleton className='w-10 h-5' />
    </TableCell>
    <TableCell>
      <Skeleton className='w-10 h-5' />
    </TableCell>
    <TableCell>
      <Skeleton className='w-10 h-5' />
    </TableCell>
    <TableCell>
      <Skeleton className='w-10 h-5' />
    </TableCell>
  </TableRow>
)

interface TransactionsTableProps {
  transactions: Transaction[]
  loading: boolean
  transactionHeading?: string
  itemsPerPage?: number
}

const TransactionsTable = ({
  transactions,
  loading,
  transactionHeading,
  itemsPerPage = 5,
}: TransactionsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1) // initial page

  if (loading) {
    return renderSkeletonRow()
  }

  if (!transactions) {
    return (
      <div className='flex flex-col items-center justify-center mt-5'>
        <p>No transactions found</p>
      </div>
    )
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(transactions?.length / itemsPerPage!)) {
      return
    }
    setCurrentPage(page)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, transactions?.length || 0)
  const paginatedTransactions = transactions?.slice(startIndex, endIndex)
  const numberOfPages = Math.ceil(transactions?.length / itemsPerPage!)

  return (
    <div className='mt-5'>
      <p className='text-2xl font-bold'>{transactionHeading}</p>
      <div className='mt-5 border-2 rounded-md overflow-hidden'>
        <Table className='w-full'>
          <TableHeader className='bg-secondary'>
            <TableRow>
              {Table_Header.map((item) => (
                <TableHead key={item}>{item}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className='dark:bg-black bg-white'>
            {paginatedTransactions?.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>
                  <Badge
                    variant={'secondary'}
                    color={transaction.trnxType === 'CREDIT' ? 'green' : 'red'}
                  >
                    {transaction.trnxType}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={'secondary'}
                    color={transaction.status === 'COMPLETED' ? 'green' : 'red'}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.purpose}</TableCell>
                <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                <TableCell>{transaction.balanceBefore}</TableCell>
                <TableCell>{transaction.balanceAfter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {numberOfPages > 1 && (
        <div className='flex justify-center mt-4'>
          <Pagination>
            <PaginationContent className='cursor-pointer'>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </PaginationPrevious>
              </PaginationItem>
              {Array.from({ length: numberOfPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
