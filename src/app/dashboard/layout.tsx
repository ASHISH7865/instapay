'use client'
import Sidebar from '@/components/shared/sidebar'
import { useWalletContext } from '@/provider/wallet-provider'
import CreateWalletOverlay from '@/components/shared/CreateWalletOverlay'
import MobileNav from '@/components/shared/MobileNav'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userWallet } = useWalletContext()

  return (
    <div className='flex flex-col md:flex-row md:h-screen bg-background'>
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
