'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import ReduxToolkitProvider from "@/provider/redux-toolkit-provider";
import {Toaster} from "@/components/ui/toaster";
import { WalletContextProvider } from "@/provider/wallet-provider";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
          <ClerkProvider>
            <WalletContextProvider>
              {children}
              </WalletContextProvider>
          </ClerkProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
