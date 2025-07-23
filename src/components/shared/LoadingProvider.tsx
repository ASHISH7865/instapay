'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingContextType {
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    showLoading: (message?: string) => void
    hideLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}

interface LoadingProviderProps {
    children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('Loading...')

    const showLoading = useCallback((message?: string) => {
        setLoadingMessage(message || 'Loading...')
        setIsLoading(true)
    }, [])

    const hideLoading = useCallback(() => {
        setIsLoading(false)
        setLoadingMessage('Loading...')
    }, [])

    const value = useMemo(() => ({
        isLoading,
        setIsLoading,
        showLoading,
        hideLoading
    }), [isLoading, showLoading, hideLoading])

    return (
        <LoadingContext.Provider value={value}>
            {children}

            {/* Global Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-4"
                        >
                            <div className="relative">
                                <motion.div
                                    className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary/60 rounded-full"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-primary animate-pulse" />
                                </div>
                            </div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-muted-foreground font-medium"
                            >
                                {loadingMessage}
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </LoadingContext.Provider>
    )
}
