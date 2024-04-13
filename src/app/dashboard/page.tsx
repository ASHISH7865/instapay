/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
// import TotalBalanceChart from '@/components/charts/TotalBalanceChart'
import { BreadcrumbItem, Breadcrumbs } from '@/components/ui/breadcrumb'
import { getTotalBalanceChartData } from '@/lib/actions/chart.actions'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { isLoaded, userId } = useAuth()

  const { isLoaded: isUserLoaded, isSignedIn } = useUser()
  const [depositData, setDepositData] = useState<any>([])

  // In case the user signs out while on the page.
  if (!isLoaded || !userId || !isUserLoaded || !isSignedIn) {
    return null
  }


  useEffect(() => {
    getTotalBalanceChartData(userId).then((data) => {
      setDepositData(data.totalBalanceChartData)
    }
    )
  }, [userId])
  console.log(depositData)
  return (
    <div className='flex flex-col p-4'>
      <Breadcrumbs>
        <BreadcrumbItem href='/dashboard'>Dashboard</BreadcrumbItem>
      </Breadcrumbs>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <div className='flex flex-col mt-4'>
        <h2 className='text-xl font-semibold'>Welcome, {userId}</h2>
        <p className='text-gray-500'>This is your dashboard</p>
       {/* <TotalBalanceChart /> */}
      </div>
    </div>
  )
}
