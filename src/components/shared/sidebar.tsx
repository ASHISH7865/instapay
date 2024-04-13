'use client'
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { ThemeCustomizer } from '@/components/shared/theme-customizer'
import { ModeToggle } from './mode-toggle'
import { SidebarContent } from '@/constant/sidebar'



const Sidebar = () => {
  const { user } = useUser()

  return (
    <div className=' h-screen w-64 relative'>
      <div className='flex items-center justify-center p-5'>
        <h1 className=' text-2xl'>InstaPay</h1>
      </div>
      <nav className='mt-10 flex  flex-col items-start ml-10  '>
        {SidebarContent.map((item, index) => (
          <Link key={index} href={item.href} className='flex items-center gap-2 p-2 m-2 text-sm'>
            <item.icon className={`${item.current ? 'text-primary-1' : ''}`} size={20} />
            <span className={`${item.current ? 'text-primary' : ''}`}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className='absolute bottom-0 w-full p-2 flex flex-col gap-2'>
        <div className='theme_customizer flex  items-center p-2 '>
          <ModeToggle />
          <ThemeCustomizer />
        </div>
        {user && (
          <div className='flex border p-2  items-center gap-2 border-primary rounded-md'>
            <UserButton afterSignOutUrl='/' />
            <div className='flex flex-col ml-2'>
              <span className='text-md font-bold'>{user?.fullName}</span>
              <span className='text-xs text-muted-foreground'>
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
