'use client'
import { useState, useEffect } from 'react'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '../ui/button'
import { Menu, Wallet2, Download, Star, Shield } from 'lucide-react'
import { ModeToggle } from '../shared/mode-toggle'
import Link from 'next/link'

interface RouteProps {
    href: string
    label: string
    badge?: string
}

const routeList: RouteProps[] = [
    {
        href: '#features',
        label: 'Features',
    },
    {
        href: '#security',
        label: 'Security',
        badge: 'Secure'
    },
    {
        href: '#pricing',
        label: 'Pricing',
    },
    {
        href: '#faq',
        label: 'FAQ',
    },
]

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [scrolled, setScrolled] = useState<boolean>(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
            ? 'border-b bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm'
            : 'border-b border-transparent bg-white/80 dark:bg-slate-950/80 backdrop-blur-md'
            }`}>
            <NavigationMenu className='mx-auto'>
                <NavigationMenuList className='container h-16 px-4 w-screen flex justify-between items-center'>
                    <NavigationMenuItem className='font-bold flex'>
                        <Link href='/' className='flex gap-2 items-center group'>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                                <Wallet2 className='text-white h-5 w-5' />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Instapay
                                </span>
                                <span className="text-xs text-muted-foreground -mt-1">Digital Payments</span>
                            </div>
                        </Link>
                    </NavigationMenuItem>

                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex gap-1'>
                        {routeList.map((route: RouteProps, i) => (
                            <div key={i} className="relative group">
                                <Link
                                    href={route.href}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 ${buttonVariants({
                                        variant: 'ghost',
                                    })}`}
                                >
                                    {route.label}
                                    {route.badge && (
                                        <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-0">
                                            {route.badge}
                                        </Badge>
                                    )}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className='hidden md:flex gap-3 items-center'>
                        {/* Trust indicator */}
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-green-700 dark:text-green-300">Live</span>
                        </div>

                        <Link
                            href='/sign-in'
                            className={`text-sm font-medium ${buttonVariants({
                                variant: 'ghost',
                            })}`}
                        >
                            Sign in
                        </Link>
                        <Link
                            href='/sign-up'
                            className={`text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white ${buttonVariants({
                                variant: 'default',
                            })}`}
                        >
                            Get Started Free
                        </Link>
                        <ModeToggle />
                    </div>

                    {/* Mobile Menu */}
                    <div className='flex md:hidden items-center gap-2'>
                        <ModeToggle />
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                                    <Menu className='h-5 w-5' />
                                </button>
                            </SheetTrigger>
                            <SheetContent side={'right'} className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                                            <Wallet2 className='text-white h-4 w-4' />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-lg">Instapay</span>
                                            <span className="text-xs text-muted-foreground">Digital Payments</span>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>

                                {/* Trust indicator in mobile */}
                                <div className="flex items-center gap-2 px-4 py-2 mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">System Online</span>
                                </div>

                                <nav className='flex flex-col gap-2 mt-6'>
                                    {routeList.map(({ href, label, badge }: RouteProps) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            onClick={() => setIsOpen(false)}
                                            className={`px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between ${buttonVariants({
                                                variant: 'ghost',
                                            })}`}
                                        >
                                            <span>{label}</span>
                                            {badge && (
                                                <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 border-0">
                                                    {badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    ))}

                                    {/* Mobile app download */}
                                    <div className="px-4 py-3 mt-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Download className="h-5 w-5 text-blue-600" />
                                            <span className="font-medium text-sm">Download App</span>
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

                                    <div className="border-t pt-4 mt-4 space-y-2">
                                        <Link
                                            href='/sign-in'
                                            onClick={() => setIsOpen(false)}
                                            className={`w-full justify-center ${buttonVariants({
                                                variant: 'ghost',
                                            })}`}
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href='/sign-up'
                                            onClick={() => setIsOpen(false)}
                                            className={`w-full justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white ${buttonVariants({
                                                variant: 'default',
                                            })}`}
                                        >
                                            Get Started Free
                                        </Link>
                                    </div>

                                    {/* Mobile footer */}
                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Shield className="h-3 w-3" />
                                            <span>256-bit encryption</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <Star className="h-3 w-3" />
                                            <span>4.9/5 rating</span>
                                        </div>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}
