'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp, Download, X } from 'lucide-react'
import Link from 'next/link'

export const FloatingCTA = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [showDownload, setShowDownload] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show floating CTA after scrolling down 300px
            setIsVisible(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:hidden">
            {/* Download app CTA */}
            {showDownload && (
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border p-3 mb-2 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Download App</span>
                        <button
                            onClick={() => setShowDownload(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <Link href="#" className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium">
                            iOS
                        </Link>
                        <Link href="#" className="flex-1 text-center px-3 py-2 bg-purple-600 text-white rounded-md text-xs font-medium">
                            Android
                        </Link>
                    </div>
                </div>
            )}

            {/* Floating action buttons */}
            <div className="flex flex-col gap-2">
                <Button
                    onClick={() => setShowDownload(!showDownload)}
                    size="sm"
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                    <Download className="h-5 w-5" />
                </Button>

                <Button
                    onClick={scrollToTop}
                    size="sm"
                    variant="outline"
                    className="w-12 h-12 rounded-full shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                >
                    <ArrowUp className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
