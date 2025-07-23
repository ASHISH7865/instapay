'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ModeToggle } from './mode-toggle'
import { SidebarContent, QuickActions } from '@/constant/sidebar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useWallets } from '@/hooks/useWalletRTK'
import { useLogout } from '@/hooks/useLogout'
import type { Wallet } from '@/lib/store/slices/walletApi'
import {
  X,
  TrendingUp,
  Bell,
  Sparkles,
  Loader2,
  LogOut,
  User
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarProps {
  onClose?: () => void
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user } = useClerk()
  const pathname = usePathname()
  const { wallets, isLoading: walletsLoading } = useWallets()
  const { logout, isLoggingOut } = useLogout()

  // Calculate total balance from all wallets
  const totalBalance = wallets?.data?.reduce((sum: number, wallet: Wallet) => sum + Number(wallet.balance), 0) || 0
  const availableBalance = wallets?.data?.reduce((sum: number, wallet: Wallet) => sum + Number(wallet.availableBalance), 0) || 0

  // Calculate percentage change (mock data for now)
  const percentageChange = 12.5 // This could be calculated from transaction history

  // Get user initials for avatar fallback
  const getUserInitials = React.useCallback((name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className='flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 shadow-2xl'
    >
      {/* Header */}
      <div className='flex items-center justify-between p-6 border-b border-white/10 dark:border-slate-700/50'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20'>
            <span className='text-primary-foreground font-bold text-lg'>I</span>
          </div>
          <div>
            <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
              InstaPay
            </h1>
            <p className='text-xs text-muted-foreground'>Digital Wallet</p>
          </div>
        </div>

        {/* Close button for mobile */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Balance */}
      <div className='p-6 border-b border-white/10 dark:border-slate-700/50'>
        <div className='flex items-center justify-between mb-3'>
          <span className='text-sm font-medium text-muted-foreground'>Quick Balance</span>
          {walletsLoading ? (
            <Loader2 className='h-4 w-4 text-emerald-500 animate-spin' />
          ) : (
            <TrendingUp className='h-4 w-4 text-emerald-500' />
          )}
        </div>
        {walletsLoading ? (
          <div className='space-y-2'>
            <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse' />
          </div>
        ) : (
          <>
            <p className='text-2xl font-bold text-foreground'>
              ${totalBalance.toLocaleString()}
            </p>
            <div className='flex items-center justify-between'>
              <p className='text-xs text-emerald-600 dark:text-emerald-400 font-medium'>
                +{percentageChange}% this month
              </p>
              <p className='text-xs text-muted-foreground'>
                Available: ${availableBalance.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 px-4 py-2 space-y-2 overflow-y-auto'>
        <div className='space-y-1'>
          {SidebarContent.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group relative overflow-hidden',
                    isActive
                      ? 'text-primary bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50'
                  )}
                >
                  {/* Active background glow */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-sm'
                    />
                  )}

                  <div className={cn(
                    'relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg'
                      : 'group-hover:bg-white/50 dark:group-hover:bg-slate-800/50'
                  )}>
                    <item.icon
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                  </div>

                  <span className={cn(
                    'font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    {item.name}
                  </span>

                  {/* Feature badges */}
                  {item.name === 'Analytics' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='ml-auto'
                    >
                      <Badge variant="secondary" className='text-xs px-1.5 py-0.5 h-5 min-w-5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/30'>
                        <Sparkles className='h-2.5 w-2.5' />
                      </Badge>
                    </motion.div>
                  )}

                  {item.name === 'Wallet' && (
                    <div className='ml-auto w-3 h-3 bg-emerald-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900' />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        <Separator className='my-6 bg-white/10 dark:bg-slate-700/50' />

        {/* Quick Actions */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between px-4'>
            <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
              Quick Actions
            </p>
            <Bell className='h-4 w-4 text-muted-foreground' />
          </div>

          <div className='space-y-2'>
            {QuickActions.map((action, index) => {
              const Icon = action.icon
              const colorClasses = {
                emerald: 'from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400',
                blue: 'from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400',
                purple: 'from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400',
                orange: 'from-orange-500/20 to-orange-600/20 text-orange-600 dark:text-orange-400'
              }

              return (
                <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={action.href}
                    onClick={onClose}
                    className='flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200 group'
                  >
                    <div className={cn(
                      'w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform',
                      colorClasses[action.color as keyof typeof colorClasses]
                    )}>
                      <Icon className='h-4 w-4' />
                    </div>
                    <div>
                      <span className='font-medium'>{action.name}</span>
                      <p className='text-xs text-muted-foreground'>{action.description}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className='p-4 border-t border-white/10 dark:border-slate-700/50 space-y-4'>
        {/* Theme Controls */}
        <div className='flex items-center justify-between px-2'>
          <span className='text-xs font-medium text-muted-foreground'>Theme</span>
          <div className='flex items-center space-x-2'>
            <ModeToggle />
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            className='flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-800/50 dark:to-slate-800/30 border border-white/20 dark:border-slate-700/50 backdrop-blur-sm'
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto w-auto">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
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
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-foreground truncate'>
                {user?.fullName || user?.firstName}
              </p>
              <p className='text-xs text-muted-foreground truncate'>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
          </motion.div>
        )}

        {/* Version */}
        <div className='text-center'>
          <p className='text-xs text-muted-foreground'>
            InstaPay v2.0.1 • <span className='text-emerald-500'>Premium</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar
