import { Wallet2, Github, Twitter, Linkedin, Shield } from 'lucide-react'
import Link from 'next/link'

export const Footer = () => {
    return (
        <footer className='border-t bg-slate-50/50 dark:bg-slate-900/50'>
            <div className='container py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {/* Brand section */}
                    <div className='space-y-4'>
                        <Link href='/' className='flex gap-2 items-center group'>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Wallet2 className='text-white h-5 w-5' />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Instapay
                            </span>
                        </Link>
                        <p className='text-muted-foreground text-sm leading-relaxed max-w-xs'>
                            The future of digital payments. Secure, instant, and designed for the modern world.
                        </p>
                        <div className='flex gap-4'>
                            <a href='#' className='p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors'>
                                <Twitter className='h-5 w-5' />
                            </a>
                            <a href='#' className='p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors'>
                                <Linkedin className='h-5 w-5' />
                            </a>
                            <a href='#' className='p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors'>
                                <Github className='h-5 w-5' />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Product</h3>
                        <div className='space-y-2'>
                            <Link href='#features' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Features
                            </Link>
                            <Link href='#security' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Security
                            </Link>
                            <Link href='#pricing' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Pricing
                            </Link>
                            <Link href='#how-it-works' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                How it Works
                            </Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Company</h3>
                        <div className='space-y-2'>
                            <Link href='#about' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                About Us
                            </Link>
                            <Link href='#' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Careers
                            </Link>
                            <Link href='#' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Press
                            </Link>
                            <Link href='#' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Blog
                            </Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div className='space-y-4'>
                        <h3 className='font-semibold text-lg'>Support</h3>
                        <div className='space-y-2'>
                            <Link href='#faq' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Help Center
                            </Link>
                            <Link href='#' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Contact Us
                            </Link>
                            <Link href='#' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Privacy Policy
                            </Link>
                            <Link href='#' className='block text-sm text-muted-foreground hover:text-foreground transition-colors'>
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className='border-t mt-12 pt-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <p className='text-sm text-muted-foreground'>
                            &copy; 2024 Instapay. All rights reserved.
                        </p>
                        <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                                <span>SOC 2 Type II Certified</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Shield className='h-4 w-4' />
                                <span>256-bit Encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
