import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LucideIcon, ArrowLeft, MoreHorizontal } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  badge?: string
  showBack?: boolean
  onBack?: () => void
  children?: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

const PageHeader = ({
  title,
  description,
  icon: Icon,
  badge,
  showBack = false,
  onBack,
  children,
  className,
  actions
}: PageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50',
        className
      )}
    >
      <div className='px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            {/* Back Button */}
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}

            {/* Header Content */}
            <div className='flex items-center gap-3'>
              {Icon && (
                <div className='w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center'>
                  <Icon className='h-5 w-5 text-primary' />
                </div>
              )}

              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-2xl font-bold text-foreground'>
                    {title}
                  </h1>
                  {badge && (
                    <Badge variant="secondary" className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/30'>
                      {badge}
                    </Badge>
                  )}
                </div>
                {description && (
                  <p className='text-sm text-muted-foreground mt-1'>
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            {actions}
            {!actions && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Additional Content */}
        {children && (
          <div className='mt-4'>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PageHeader
