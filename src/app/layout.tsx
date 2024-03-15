import { ThemeProvider } from '@/provider/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'
import { WalletContextProvider } from '@/provider/wallet-provider'
import './globals.css'
import { Suspense } from 'react'
import Spinner from '@/components/shared/spinner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body>
        <Suspense fallback={<Spinner size={8} />}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem={true}
            disableTransitionOnChange
          >
            <ClerkProvider>
              <WalletContextProvider>{children}</WalletContextProvider>
            </ClerkProvider>
          </ThemeProvider>
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
