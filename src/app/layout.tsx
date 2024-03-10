import { ThemeProvider } from '@/provider/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import { WalletContextProvider } from '@/provider/wallet-provider';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <ClerkProvider>
            <WalletContextProvider>{children}</WalletContextProvider>
          </ClerkProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
