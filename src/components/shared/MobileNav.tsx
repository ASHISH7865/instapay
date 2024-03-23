import React from 'react'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'
import { ThemeCustomizer } from './theme-customizer'
import { SidebarContent } from '@/constant/sidebar'

const MobileNav = () => {
 

  const { user } = useUser()

  return (
    <nav className='md:hidden'>
      <ul className='flex justify-around py-4 fixed bottom-0 left-0 right-0 rounded-t-3xl bg-secondary z-10 '>
        {SidebarContent.map((item, index) => (
          <li key={index}>
            <Link href={item.href} className='flex flex-col items-center '>
              <item.icon className={`${item.current ? '' : ''}`} size={20} />
              {/* <span className='text-xs'>{item.name}</span> */}
            </Link>
          </li>
        ))}
      </ul>

      {user && (
        <div className='flex justify-between items-center py-2 px-4  border-t bg-secondary '>
          <div className='flex items-center justify-between w-full'>
            <h1 className=' text-2xl'>InstaPay</h1>
            <div className='flex items-center justify-center gap-2 '>
              <ModeToggle />
              <ThemeCustomizer />
              <UserButton afterSignOutUrl='/' />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default MobileNav
