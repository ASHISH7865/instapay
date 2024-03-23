import React, { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet2 } from 'lucide-react'
import WalletPinModal from '@/components/modal/wallet-pin-modal'
import { useWalletContext } from '@/provider/wallet-provider'
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

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP'

const CurrencySymbols: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

const CheckBalance = (): JSX.Element => {
  const { balance, userWallet, setBalance } = useWalletContext()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBalance(undefined)
    }, 10000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [balance])

  return (
    <div className=''>
      {userWallet && (
        <Card className='w-[350px] min-h-[200px]'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Wallet2 size={24} />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-bold'>
              {balance === undefined
                ? '****'
                : userWallet &&
                  `${CurrencySymbols[userWallet?.currencyPreference as CurrencyCode]} ${userWallet?.balance}`}
            </div>
          </CardContent>
          <CardFooter className='flex justify-end'>
            {balance === undefined && <WalletPinModal />}
          </CardFooter>
        </Card>
      )}
      {/**
       * create a skeleton loader for the wallet balance card
       */}
      {!userWallet && <WalletSkeleton />}
    </div>
  )
}

export default CheckBalance
