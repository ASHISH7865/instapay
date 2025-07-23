import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { ModeToggle } from './mode-toggle'

import { SidebarContent } from '@/constant/sidebar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useLogout } from '@/hooks/useLogout'
import { Sparkles, LogOut, User, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const MobileNav = () => {
  const { user } = useClerk()
  const pathname = usePathname()
  const { logout, isLoggingOut } = useLogout()

  // Get user initials for avatar fallback
  const getUserInitials = React.useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }, [])

  return (
    <div className='lg:hidden'>
      {/* Top Header */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex justify-between items-center py-4 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20'>
              <span className='text-primary-foreground font-bold text-sm'>I</span>
            </div>
            <div>
              <h1 className='text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                InstaPay
              </h1>
              <p className='text-xs text-muted-foreground'>Digital Wallet</p>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <div className='flex items-center space-x-2'>
              <ModeToggle />

            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto w-auto">
                  <Avatar className="w-9 h-9 ring-2 ring-primary/20">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                      {getUserInitials(user?.fullName || user?.firstName || 'User')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                      {getUserInitials(user?.fullName || user?.firstName || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.fullName || user?.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                                <DropdownMenuItem
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      )}

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 shadow-2xl'
      >
        <div className='relative'>
          {/* Gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-white/10 to-transparent dark:from-slate-800/10 pointer-events-none' />

          <div className='grid grid-cols-4 h-20 relative z-10'>
            {SidebarContent.slice(0, 4).map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='relative'
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 h-full transition-all duration-300 relative group',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {/* Active background glow */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='absolute inset-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl blur-lg'
                      />
                    )}

                    {/* Active top indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className='absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-primary/80 rounded-b-full shadow-lg'
                      />
                    )}

                    {/* Icon container */}
                    <div className={cn(
                      'relative p-2 rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg'
                        : 'group-hover:bg-white/50 dark:group-hover:bg-slate-800/50'
                    )}>
                      <item.icon
                        className={cn(
                          'w-5 h-5 transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                    </div>

                    {/* Label */}
                    <span className={cn(
                      'text-xs font-medium truncate max-w-12 text-center transition-colors',
                      isActive ? 'text-primary font-semibold' : 'text-muted-foreground group-hover:text-foreground'
                    )}>
                      {item.name}
                    </span>

                    {/* Feature badges */}
                    {item.name === 'Analytics' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className='absolute -top-1 -right-1'
                      >
                        <Badge variant="secondary" className='text-xs px-1.5 py-0.5 h-5 min-w-5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/30'>
                          <Sparkles className='h-2.5 w-2.5' />
                        </Badge>
                      </motion.div>
                    )}

                    {item.name === 'Wallet' && (
                      <div className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900' />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.nav>
    </div>
  )
}

export default MobileNav
