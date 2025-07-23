import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Download, Smartphone, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

const appFeatures = [
    {
        icon: <Zap className="h-5 w-5" />,
        title: "Instant Transfers",
        description: "Send money in seconds"
    },
    {
        icon: <Shield className="h-5 w-5" />,
        title: "Biometric Security",
        description: "Fingerprint & face unlock"
    },
    {
        icon: <Smartphone className="h-5 w-5" />,
        title: "Offline Mode",
        description: "View balance without internet"
    }
]

const appStats = [
    { value: "4.9", label: "App Store Rating" },
    { value: "2M+", label: "Downloads" },
    { value: "50+", label: "Countries" }
]

export const MobileShowcase = () => {
    return (
        <section className="container py-24 sm:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            Mobile App
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Banking in your
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> pocket</span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Download our mobile app and take your finances with you everywhere.
                            Send money, track spending, and manage your account with just a few taps.
                        </p>
                    </div>

                    {/* App features */}
                    <div className="space-y-4">
                        {appFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* App stats */}
                    <div className="grid grid-cols-3 gap-6 pt-6">
                        {appStats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Download buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="group">
                            <Link href="#" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download for iOS
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="group">
                            <Link href="#" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Download for Android
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile mockup */}
                <div className="relative">
                    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

                        {/* Phone mockup */}
                        <div className="relative bg-black rounded-3xl p-2 shadow-xl">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 h-96 overflow-hidden">
                                {/* App interface mockup */}
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">IP</span>
                                            </div>
                                            <span className="font-semibold text-sm">Instapay</span>
                                        </div>
                                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                                    </div>

                                    {/* Balance card */}
                                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                                        <p className="text-xs opacity-80">Available Balance</p>
                                        <p className="text-2xl font-bold">$2,847.50</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                            <span className="text-xs">Connected</span>
                                        </div>
                                    </div>

                                    {/* Quick actions */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <ArrowRight className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-medium">Send</p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                                            <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <Download className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-medium">Receive</p>
                                        </div>
                                    </div>

                                    {/* Recent activity */}
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">Recent Activity</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                                                    <div>
                                                        <p className="text-xs font-medium">Payment received</p>
                                                        <p className="text-xs text-muted-foreground">From John Doe</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs font-medium text-green-600">+$50.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
