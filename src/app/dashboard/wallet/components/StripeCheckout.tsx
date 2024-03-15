import { useToast } from '@/components/ui/use-toast'
import { loadStripe } from '@stripe/stripe-js'
import { checkoutWalletMoney } from '@/lib/actions/transactions.actions'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { Data } from '@/types/transaction.types'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { useWalletContext } from '@/provider/wallet-provider'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addMoneySchema } from '@/lib/ZodShemas/addmoneySchema'

type AddMoneyFormValuesType = {
  amount: number
}

const StripeCheckout = () => {
  const { toast } = useToast()
  const { userWallet } = useWalletContext()
  const methods = useForm<AddMoneyFormValuesType>({
    defaultValues: {
      amount: 0,
    },
    resolver: zodResolver(addMoneySchema),
  })

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }, [])

  useEffect(() => {
    // check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      toast({
        title: 'Transaction Completed',
        variant: 'default',
        className: 'bg-green-500',
      })
    }

    if (query.get('canceled')) {
      toast({
        title: 'Transaction Canceled',
        variant: 'default',
        className: 'bg-red-500',
      })
    }
  }, [])

  const handleCheckout = async (formData: AddMoneyFormValuesType) => {
    const data: Data = {
      amountToBeAdded: formData.amount,
      currentCurrency: userWallet?.currencyPreference || 'INR',
      transactionName: 'Wallet_Top_Up',
      userId: userWallet?.userId || '',
      balanceBefore: userWallet?.balance || 0,
    }
    await checkoutWalletMoney(data)
  }

  return (
    <Form {...methods}>
      <form
        className='flex flex-col space-y-4'
        onSubmit={methods.handleSubmit((data) => handleCheckout(data))}
      >
        <FormField
          control={methods.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to be add</FormLabel>
              <FormControl>
                <Input type='number' placeholder='enter amount' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' variant='default'>
          Add Money
        </Button>
      </form>
    </Form>
  )
}

export default StripeCheckout
