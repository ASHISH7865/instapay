'use client'
import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'emerald'
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  subtitle?: string
  badge?: string
  loading?: boolean
}

const StatsCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'blue',
  trend = 'neutral',
  className,
  subtitle,
  badge,
  loading = false
}: StatsCardProps) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-200/50 dark:border-blue-800/50',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/20'
    },
    green: {
      bg: 'from-green-500/10 to-green-600/5',
      border: 'border-green-200/50 dark:border-green-800/50',
      icon: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-500/20'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-200/50 dark:border-emerald-800/50',
      icon: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/20'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-200/50 dark:border-purple-800/50',
      icon: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/20'
    },
    orange: {
      bg: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-200/50 dark:border-orange-800/50',
      icon: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500/20'
    },
    red: {
      bg: 'from-red-500/10 to-red-600/5',
      border: 'border-red-200/50 dark:border-red-800/50',
      icon: 'text-red-600 dark:text-red-400',
      iconBg: 'bg-red-500/20'
    }
  }

  const trendColor = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground'
  }

  const colorClass = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative p-6 rounded-2xl bg-gradient-to-br backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300',
        'bg-white/80 dark:bg-slate-900/80',
        colorClass.bg,
        colorClass.border,
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-slate-800/20 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
            colorClass.iconBg
          )}>
            <Icon className={cn('h-6 w-6', colorClass.icon)} />
          </div>

          {badge && (
            <Badge variant="secondary" className="bg-white/50 dark:bg-slate-800/50 text-xs">
              {badge}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            {change !== undefined && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trendColor[trend]
              )}>
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                {change > 0 ? '+' : ''}{change}%
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-muted/30 rounded animate-pulse" />
              {subtitle && <div className="h-4 bg-muted/20 rounded animate-pulse w-2/3" />}
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-foreground">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </>
          )}

          {changeLabel && (
            <p className="text-xs text-muted-foreground">
              {changeLabel}
            </p>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl',
        colorClass.bg
      )} />
    </motion.div>
  )
}

export default StatsCard

// Enhanced Stats Grid Component for consistent layout
interface StatsGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export const StatsGrid = memo(({ children, className, columns = 4 }: StatsGridProps) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <motion.div
      className={cn(
        'grid gap-6',
        gridClasses[columns],
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        staggerChildren: 0.1,
        delayChildren: 0.2
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            type: "spring",
            stiffness: 300,
            damping: 24
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
})

StatsGrid.displayName = 'StatsGrid'
