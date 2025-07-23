'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface SimpleLoadingProps {
    message?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function SimpleLoading({
    message = "Loading...",
    size = 'md',
    className = ""
}: SimpleLoadingProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    }

    return (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                <motion.div
                    className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'} text-primary animate-pulse`} />
                </div>
            </motion.div>

            {message && (
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className={`${textSizes[size]} text-muted-foreground font-medium`}
                >
                    {message}
                </motion.p>
            )}
        </div>
    )
}
