import React from 'react'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'

const Payments = () => {
  return (
    <div className=' relative'>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
        <BreadcrumbItem href='/dashboard/payments'>Payment</BreadcrumbItem>
      </Breadcrumbs>
      <div>
        <p className='text-2xl font-bold'> Payment Dashboard</p>
      </div>
      <div className='flex flex-row items-center justify-center gap-2 flex-wrap mt-10'>
        
      </div>
    </div>
  )
}

export default Payments
