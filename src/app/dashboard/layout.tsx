'use client'
import Sidebar from '@/components/shared/sidebar'
import { useWalletContext } from '@/provider/wallet-provider'
import CreateWalletOverlay from '@/components/shared/CreateWalletOverlay'
import MobileNav from '@/components/shared/MobileNav'
import { getUserInfo } from '@/lib/actions/onbaording.action'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'


interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userWallet } = useWalletContext()
  const [userInfoExist, setUserInfoExist] = useState(false)
  const { userId } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (userId) {
      getUserInfo(userId)
        .then((res) => {
          if (res) {
            setUserInfoExist(true)
          } else {
            setUserInfoExist(false)
            router.push('/onboarding')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])
  
  if( !userInfoExist) {
    return null
  }

  return (
    <div className='flex flex-col md:flex-row md:h-screen '>
      <div className='w-64 md:h-[calc(100vh-16px)] bg-primary-800 border-r border-primary-700 transition-colors duration-300 hidden md:block '>
        <Sidebar />
      </div>
      <div className='md:hidden'>
        <MobileNav />
      </div>
      <div className='flex-1  transition-colors duration-300 p-2'>
        <div className=' bg-transparent  rounded-md'>
          <div className='relative min-h-[calc(100vh-16px)]  md:overflow-auto  dark:bg-dot-white/[0.1] bg-dot-black/[0.2] mb-10'>
            {userWallet ? children : <CreateWalletOverlay />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
