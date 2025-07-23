'use client'

import { motion } from 'framer-motion'
import { useNavigationLoading } from '@/hooks/useNavigationLoading'

export default function NavigationLoading() {
    const { isNavigating } = useNavigationLoading()

    if (!isNavigating) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 px-4 py-2 flex items-center space-x-2"
        >
            <motion.div
                className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm text-muted-foreground font-medium">
                Navigating...
            </span>
        </motion.div>
    )
}
