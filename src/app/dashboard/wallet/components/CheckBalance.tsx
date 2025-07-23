/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet2 } from 'lucide-react'
import WalletPinModal from '@/components/modal/wallet-pin-modal'
import { useWalletContext } from '@/provider/wallet-provider'
import { useWallets } from '@/hooks/useWalletRTK'
import { Skeleton } from '@/components/ui/skeleton'

const WalletSkeleton = (): JSX.Element => {
    return (
        <Card className='w-[350px] mt-5'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Skeleton className='w-6 h-6' />
                    <Skeleton className='w-24 h-6' />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='text-4xl font-bold'>
                    <Skeleton className='w-44 h-5' />
                </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Skeleton className='w-24 h-10' />
            </CardFooter>
        </Card>
    )
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'CNY' | 'BTC' | 'ETH'

const CurrencySymbols: Record<CurrencyCode, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CHF: 'CHF',
    CNY: '¥',
    BTC: '₿',
    ETH: 'Ξ',
}

const CheckBalance = (): JSX.Element => {
    const { balance, userWallet, setBalance } = useWalletContext()
    const { wallets, isLoading } = useWallets()
    const defaultWallet = wallets?.data?.find((wallet: any) => wallet.isDefault)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setBalance(undefined)
        }, 10000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [balance])

    // Use default wallet if no userWallet in context
    const wallet = userWallet || defaultWallet

    if (isLoading) {
        return <WalletSkeleton />
    }

    return (
        <div className=''>
            {wallet && (
                <Card className='w-[350px] min-h-[200px]'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Wallet2 size={24} />
                            {wallet.name} Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-4xl font-bold'>
                            {balance === undefined
                                ? '****'
                                : `${CurrencySymbols[wallet.currency as CurrencyCode] || '$'} ${wallet.balance.toLocaleString()}`}
                        </div>
                        <div className='text-sm text-muted-foreground mt-2'>
                            Available: {CurrencySymbols[wallet.currency as CurrencyCode] || '$'} {wallet.availableBalance.toLocaleString()}
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-end'>
                        {balance === undefined && <WalletPinModal />}
                    </CardFooter>
                </Card>
            )}
            {!wallet && <WalletSkeleton />}
        </div>
    )
}

export default CheckBalance
