'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { getUserInfo } from '@/lib/actions/onbaording.action'
import Sidebar from '@/components/shared/sidebar'
import MobileNav from '@/components/shared/MobileNav'
import NavigationLoading from '@/components/shared/NavigationLoading'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface DashboardLayoutProps {
    children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const [userInfoExist, setUserInfoExist] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { userId } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (userId) {
            getUserInfo(userId)
                .then((res) => {
                    if (res) {
                        setUserInfoExist(true)
                    } else {
                        setUserInfoExist(false)
                        router.push('/onboarding')
                    }
                })
                .catch((err) => {
                    console.log('Error getting user info:', err)
                    router.push('/onboarding')
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [userId, router])

    // Show loading state with modern spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/60 rounded-full animate-spin animate-reverse"></div>
                </div>
            </div>
        )
    }

    // Redirect to onboarding if user doesn't exist
    if (!userInfoExist) {
        return null
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
            <NavigationLoading />
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-72">
                    <Sidebar />
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
                        >
                            <Sidebar onClose={() => setSidebarOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden">
                    <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-white/50 dark:hover:bg-slate-800/50"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-primary-foreground font-bold text-sm">I</span>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                InstaPay
                            </h1>
                        </div>

                        <div className="w-10" /> {/* Spacer for centering */}
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                    >
                        <div className="relative min-h-full">
                            {/* Glass morphism container */}
                            <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl" />

                            {/* Content */}
                            <div className="relative z-10 h-full">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </main>

                {/* Mobile Bottom Navigation */}
                <div className="lg:hidden">
                    <MobileNav />
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
