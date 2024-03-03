import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import React from 'react'

const Transactions = () => {
  return (
    <div className="flex flex-col p-4">
    <Breadcrumbs>
    <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/transactions">Transaction</BreadcrumbItem>
    </Breadcrumbs>
  </div>
  )
}

export default Transactions