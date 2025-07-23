'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface PageLoadingSpinnerProps {
    message?: string
    size?: 'sm' | 'md' | 'lg'
}

export default function PageLoadingSpinner({
    message = "Loading...",
    size = 'md'
}: PageLoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                {/* Outer ring */}
                <motion.div
                    className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner ring */}
                <motion.div
                    className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-primary/60 rounded-full`}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-primary animate-pulse`} />
                </div>
            </motion.div>

            {/* Loading text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center"
            >
                <p className={`${textSizes[size]} text-muted-foreground font-medium`}>
                    {message}
                </p>
                <motion.div
                    className="flex space-x-1 mt-2 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}
