import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export const Hero = () => {
    return (
        <section className='container relative py-20 md:py-32 lg:py-40'>
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
                <div className='space-y-8'>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        <Sparkles className="h-4 w-4" />
                        Trusted by 100K+ users worldwide
                    </div>

                    {/* Main heading */}
                    <div className='space-y-6'>
                        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight'>
                            The Future of
                            <span className='block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent'>
                                Digital Payments
                            </span>
                        </h1>

                        <p className='text-xl text-muted-foreground leading-relaxed max-w-lg'>
                            Send money instantly, manage your finances effortlessly, and experience banking that works for you.
                            Secure, fast, and designed for the modern world.
                        </p>
                    </div>

                    {/* CTA buttons */}
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Button size="lg" className="group">
                            <Link href="/sign-up" className="flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg">
                            <Link href="#features">See How It Works</Link>
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className='flex items-center gap-6 pt-4'>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4 text-green-500" />
                            Bank-level security
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Zap className="h-4 w-4 text-blue-500" />
                            Instant transfers
                        </div>
                    </div>
                </div>

                {/* Hero visual */}
                <div className='relative'>
                    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

                        {/* Mock phone interface */}
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">IP</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Instapay</p>
                                        <p className="text-xs text-muted-foreground">Connected</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold">$2,847.50</p>
                                    <p className="text-xs text-muted-foreground">Available Balance</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <ArrowRight className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Send Money</p>
                                            <p className="text-xs text-muted-foreground">Instant transfer</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Security</p>
                                            <p className="text-xs text-muted-foreground">256-bit encryption</p>
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
