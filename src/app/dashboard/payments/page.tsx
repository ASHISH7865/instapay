import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import React from 'react'

const Payments = () => {
  return (
    <div className="flex flex-col p-4">
    <Breadcrumbs>
    <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/payments">Payment</BreadcrumbItem>
    </Breadcrumbs>
  </div>
  )
}

export default Payments