'use client'
import React from 'react'
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SendMoneyToWalletFormValuesType,
  sendMoneyToWalletSchema,
} from '@/lib/ZodShemas/sendMoneyToWalletSchema'
import { useToast } from '../ui/use-toast'
import { checkValidWallet } from '@/lib/actions/wallet.actions'
import { BadgeCheck } from 'lucide-react'
import Spinner from '../shared/spinner'
import { useUser } from '@clerk/nextjs'

interface SendMoneyToWalletFormProps {
  transactionLimit: number
}

const SendMoneyToWalletForm = ({ transactionLimit }: SendMoneyToWalletFormProps) => {
  const { toast } = useToast()
  const [isWalletVerified, setIsWalletVerified] = React.useState(false)
  const [walletVerificationLoading, setWalletVerificationLoading] = React.useState(false)
  const { user } = useUser()

  const form = useForm<SendMoneyToWalletFormValuesType>({
    resolver: zodResolver(sendMoneyToWalletSchema),
    defaultValues: {
      recieverEmail: '',
      amount: 0,
    },
  })

  const onSubmit = async (data: SendMoneyToWalletFormValuesType) => {
    try {
      if (data.amount > transactionLimit) {
        toast({
          title: 'Transaction Limit',
          description: `You can send upto ₹ ${transactionLimit} in a single transaction`,
          variant: 'destructive',
        })
        return
      }
      if (data.recieverEmail === user?.primaryEmailAddress?.emailAddress) {
        toast({
          title: 'Transaction Limit',
          description: `You can't send money to yourself`,
          variant: 'destructive',
        })
        return
      }
      if (!isWalletVerified) {
        setWalletVerificationLoading(true)
        const walletVerfication = await checkValidWallet(data.recieverEmail)
        if (walletVerfication?.wallet) {
          setIsWalletVerified(true)
          setWalletVerificationLoading(false)
        } else {
          setWalletVerificationLoading(false)
          toast({
            title: 'Wallet Verification',
            description: `Wallet not found with email: ${data.recieverEmail}`,
            variant: 'destructive',
          })
          form.setError('recieverEmail', { message: 'Wallet not found' })
        }
      } else {
        console.log('sending money')
      }
    } catch (error) {
      setWalletVerificationLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>Amount</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='enter amount' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='recieverEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>Reciever Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='enter reciever email'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setIsWalletVerified(false)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {walletVerificationLoading && (
            <div className='flex justify-center items-center'>
              <Spinner size={4} />
            </div>
          )}
          {isWalletVerified && (
            <div className='flex justify-end items-end gap-2'>
              <BadgeCheck size={24} className='text-green-700' />
              <span className='text-green-700'> Wallet Verified</span>
            </div>
          )}

          <Button type='submit' variant='secondary' className='w-full'>
            {isWalletVerified ? 'Send Money' : 'Verify Wallet'}
          </Button>
        </form>
      </Form>
      <div className='mt-5'>
        <h2 className='text-lg font-bold'>Note</h2>
        <p className='text-xs text-gray-500'>
          * Please make sure you have entered the correct user email and amount
        </p>
        <p className='text-xs text-gray-500'>
          * Please make sure you have enough balance in your wallet to send money
        </p>
        <p className='text-xs text-gray-500'>* Before sending money please verify the wallet id</p>
      </div>
      {transactionLimit && (
        <div className=''>
          <h2 className='text-lg font-bold'>Transaction Limit</h2>
          <p className='text-xs text-gray-500'>
            * You can send upto
            <span className='text-primary'> ₹ {transactionLimit} </span>
            in a single transaction
          </p>
        </div>
      )}
    </>
  )
}

export default SendMoneyToWalletForm
