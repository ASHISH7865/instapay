import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export const Cta = () => {
    return (
        <section className='container py-24 sm:py-32'>
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-8 md:p-12 lg:p-16'>
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                <div className='relative z-10 grid lg:grid-cols-2 gap-12 items-center'>
                    <div className='space-y-6'>
                        <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
                            Ready to transform your
                            <span className='block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent'>
                                financial future?
                            </span>
                        </h2>

                        <p className='text-xl text-blue-100 leading-relaxed max-w-lg'>
                            Join over 100,000 users who&apos;ve already discovered the power of instant, secure, and smart money management.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Button size="lg" className="group bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg">
                                <Link href="/sign-up" className="flex items-center gap-2">
                                    Get Started Free
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="group border-white/20  hover:bg-white/60">
                                <Link href="#features" className="flex items-center gap-2">
                                    See How It Works
                                </Link>
                            </Button>
                        </div>

                        {/* Trust indicators */}
                        <div className='flex items-center gap-6 pt-4'>
                            <div className="flex items-center gap-2 text-blue-100">
                                <Shield className="h-4 w-4 text-green-300" />
                                <span className="text-sm">Bank-level security</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100">
                                <Zap className="h-4 w-4 text-yellow-300" />
                                <span className="text-sm">Instant setup</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-100">
                                <CheckCircle className="h-4 w-4 text-green-300" />
                                <span className="text-sm">No hidden fees</span>
                            </div>
                        </div>
                    </div>

                    <div className='relative'>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">IP</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">Instapay</p>
                                            <p className="text-blue-200 text-xs">Premium Account</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">$0</p>
                                        <p className="text-blue-200 text-xs">Monthly Fee</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <CheckCircle className="h-4 w-4 text-green-300" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">Unlimited Transfers</p>
                                                <p className="text-blue-200 text-xs">No limits</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <Shield className="h-4 w-4 text-blue-300" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">Premium Security</p>
                                                <p className="text-blue-200 text-xs">256-bit encryption</p>
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
