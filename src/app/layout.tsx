import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/provider/theme-provider'
import { WalletContextProvider } from '@/provider/wallet-provider'
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'
import { Suspense } from 'react'
import GlobalLoading from '@/components/shared/GlobalLoading'
import { LoadingProvider } from '@/components/shared/LoadingProvider'
import ReduxProvider from '@/provider/redux-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Instapay - The Future of Digital Payments | Secure, Instant Money Transfers',
    description: 'Send money instantly, manage your finances effortlessly, and experience banking that works for you. Secure, fast, and designed for the modern world. Join 100K+ users worldwide.',
    keywords: 'digital payments, money transfer, e-wallet, instant transfers, secure payments, mobile banking, fintech, online payments',
    authors: [{ name: 'Instapay Team' }],
    creator: 'Instapay',
    publisher: 'Instapay',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://insta-pay-wallet.vercel.app/'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Instapay - The Future of Digital Payments',
        description: 'Send money instantly, manage your finances effortlessly, and experience banking that works for you.',
        url: 'https://instapay.com',
        siteName: 'Instapay',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Instapay - Digital Payments Platform',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Instapay - The Future of Digital Payments',
        description: 'Send money instantly, manage your finances effortlessly, and experience banking that works for you.',
        images: ['/twitter-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#3B82F6" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </head>
            <body className={inter.className}>
                <Suspense fallback={<GlobalLoading />}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ClerkProvider>
                            <ReduxProvider>
                                <LoadingProvider>
                                    <UserPreferencesProvider>
                                        <WalletContextProvider>{children}</WalletContextProvider>
                                    </UserPreferencesProvider>
                                </LoadingProvider>
                            </ReduxProvider>
                        </ClerkProvider>
                    </ThemeProvider>
                    <Toaster />
                </Suspense>
            </body>
        </html>
    )
}
