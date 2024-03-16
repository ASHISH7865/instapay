/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { checkValidWallet, checkWalletPin } from '@/lib/actions/wallet.actions'
import Spinner from '../shared/spinner'
import { useUser } from '@clerk/nextjs'
import Lottie from 'lottie-react'
import VerfyTick from '@/LotteFiles/VerifyTick.json'
import { WalletPin } from '../shared/WalletPin'
import { moneyTransfer } from '@/lib/actions/transactions.actions'
import { checkUserExistsByEmail } from '@/lib/actions/user.actions'
import { PaymentSuccessModal } from '../modal/PaymentStatusModal'

interface SendMoneyToWalletFormProps {
  transactionLimit: number
}

const SendMoneyToWalletForm = ({ transactionLimit }: SendMoneyToWalletFormProps) => {
  const { toast } = useToast()
  const [isWalletVerified, setIsWalletVerified] = React.useState(false)
  const [walletVerificationLoading, setWalletVerificationLoading] = React.useState(false)
  const { user } = useUser()
  const [openModal, setOpenModal] = React.useState(false)
  const [sendMoneyLoading, setSendMoneyLoading] = React.useState(false)
  const [openSuccessModal, setOpenSuccessModal] = React.useState(false)
  const [transaction, setTransaction] = React.useState<any>()

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
        const walletVerfication = await checkValidWallet(data.recieverEmail.toLowerCase())
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
      }
    } catch (error) {
      setWalletVerificationLoading(false)
    }
  }

  const sendMoney = async (walletPin: string) => {
    try {
      setSendMoneyLoading(true)
      if (user) {
        const isWalletPinCorrect = await checkWalletPin(user.id, walletPin)
        if (isWalletPinCorrect?.wallet) {
          const recieiver = await checkUserExistsByEmail(form.getValues('recieverEmail'))

          const transaction = await moneyTransfer(
            user.id,
            recieiver.user?.userId as string,
            parseFloat(form.getValues('amount').toString()),
          )
          if (transaction?.status === 'success') {
            setOpenSuccessModal(true)
            setTransaction(transaction)
            console.log(transaction)
          } else {
            toast({
              title: 'Transaction Failed',
              description: transaction?.message,
              variant: 'destructive',
            })
          }
          form.reset()
        } else {
          toast({
            title: 'Wallet Pin',
            description: `Invalid Wallet Pin`,
            variant: 'destructive',
          })
        }
        setOpenModal(false)
        setIsWalletVerified(false)
        setSendMoneyLoading(false)
      }
    } catch (error) {
      console.log(error)
      setSendMoneyLoading(false)
    }
  }

  return sendMoneyLoading ? (
    <div className='flex justify-center items-center h-40'>
      <Spinner size={6} />
    </div>
  ) : (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 relative'>
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
                <FormLabel className='text-sm'>Email</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='enter  email'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setIsWalletVerified(false)
                      }}
                    />
                    {isWalletVerified && (
                      <div className='flex  items-center gap-1 absolute right-2 top-[50%] transform translate-y-[-50%]'>
                        <Lottie animationData={VerfyTick} loop={false} style={{ width: '24px' }} />
                      </div>
                    )}
                    {walletVerificationLoading && (
                      <div className='flex  items-center gap-1 absolute right-2 top-[50%] transform translate-y-[-50%]'>
                        <Spinner size={4} />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isWalletVerified && (
            <p className='text-green-500 text-sm float-right '> Wallet Verified</p>
          )}
          {!isWalletVerified ? (
            <Button type='submit' variant='secondary' className='self-start'>
              Veryfy Wallet
            </Button>
          ) : (
            <WalletPin
              setOpenModal={setOpenModal}
              openModal={openModal}
              handlerFunction={sendMoney}
            />
          )}
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

      <PaymentSuccessModal
        openModal={openSuccessModal}
        setOpenModal={setOpenSuccessModal}
        amount={transaction?.data?.amount || 0}
        recieverName={transaction?.data?.receiverId || ""}
        transactionId={transaction?.data?.transactionID || ''}
      />
    </>
  )
}

export default SendMoneyToWalletForm
