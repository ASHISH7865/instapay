import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import CreateWalletOverlay from '@/components/shared/CreateWalletOverlay';
const transactions = [
  { transactionId: "1", type: "credit", amount: 1000, status: "success" },
  { transactionId: "2", type: "debit", amount: 200, status: "failed" },
  { transactionId: "3", type: "credit", amount: 500, status: "success" },
  { transactionId: "4", type: "debit", amount: 100, status: "success" },
  { transactionId: "5", type: "credit", amount: 1000, status: "success" },
  { transactionId: "6", type: "debit", amount: 200, status: "failed" },
  { transactionId: "7", type: "credit", amount: 500, status: "success" },
  { transactionId: "8", type: "debit", amount: 100, status: "success" },
]

const Transactions = () => {
  return (
    <div className="flex flex-col p-4 relative ">
    <Breadcrumbs>
    <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/transactions">Transaction</BreadcrumbItem>
    </Breadcrumbs>
    <div className="mt-5">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.transactionId}>
              <TableCell className="font-medium">{item.amount}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <Badge>{item.status}</Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Trash2 size={20} className="text-red-800" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      </div>
      <CreateWalletOverlay />
  </div>
  )
}

export default Transactions