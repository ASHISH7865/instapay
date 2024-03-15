import React from 'react'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'

const Beneficiary = async () => {
  return (
    <div className='p-4 relative'>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
        <BreadcrumbItem href='/dashboard/beneficiaries'>Beneficiaries</BreadcrumbItem>
      </Breadcrumbs>
      <p className='text-2xl font-bold'> Beneficiaries Dashboard</p>
      <div className='mt-5'>{/* <AllBeneficiary beneficiaries={{}} /> */}</div>
    </div>
  )
}

export default Beneficiary
