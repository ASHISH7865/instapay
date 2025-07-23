'use client'
import { useState } from 'react'
import { X, Sparkles, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export const NotificationBanner = () => {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
            <div className="container px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-medium">Special Offer</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                <span>100K+ users trust us</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>50+ countries supported</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/sign-up"
                            className="text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                        >
                            Get 50% off first month
                        </Link>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
