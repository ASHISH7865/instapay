/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent } from '../ui/card'

import {
  Plus,
  CreditCard,
  Wallet,
  DollarSign,
  Lock,
  Shield,
  AlertCircle,
  ArrowRight,
  Loader2,
  Banknote,
  Smartphone
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '../ui/use-toast'
import { useWalletContext } from '@/provider/wallet-provider'

import { Data } from '@/types/transaction.types'

const addMoneySchema = z.object({
  amount: z.number().min(1, 'Amount must be at least $1').max(10000, 'Amount cannot exceed $10,000'),
  paymentMethod: z.enum(['card', 'bank', 'apple_pay', 'google_pay'], {
    required_error: 'Please select a payment method'
  })
})

type AddMoneyFormValues = z.infer<typeof addMoneySchema>

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Instant transfer',
    fee: '2.9% + $0.30',
    processingTime: 'Instant',
    popular: true
  },
  {
    id: 'bank',
    name: 'Bank Transfer (ACH)',
    icon: Banknote,
    description: '1-3 business days',
    fee: 'Free',
    processingTime: '1-3 days',
    popular: false
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    icon: Smartphone,
    description: 'Touch ID / Face ID',
    fee: '2.9% + $0.30',
    processingTime: 'Instant',
    popular: false
  },
  {
    id: 'google_pay',
    name: 'Google Pay',
    icon: Smartphone,
    description: 'Fingerprint / PIN',
    fee: '2.9% + $0.30',
    processingTime: 'Instant',
    popular: false
  }
]

const AddMoneyModalV2 = () => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { userWallet } = useWalletContext()

  const form = useForm<AddMoneyFormValues>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: 0,
      paymentMethod: 'card' // Default to most popular
    }
  })

  const { watch, formState: { errors, isValid } } = form
  const selectedAmount = watch('amount')
  const selectedMethod = watch('paymentMethod')

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)

  const calculateFee = (amount: number, methodId: string) => {
    if (['card', 'apple_pay', 'google_pay'].includes(methodId)) {
      return Math.round((amount * 0.029 + 0.30) * 100) / 100
    }
    return 0
  }

  const fee = calculateFee(selectedAmount, selectedMethod)
  const total = selectedAmount + fee

  const quickAmounts = [10, 25, 50, 100, 250, 500]

  const handleQuickAmount = (amount: number) => {
    form.setValue('amount', amount)
  }

  const handleSubmit = async (data: AddMoneyFormValues) => {
    setIsLoading(true)
    try {
      const transactionData: Data = {
        amountToBeAdded: total, // Include fees in total
        currentCurrency: userWallet?.currency || 'USD',
        transactionName: 'Wallet_Top_Up',
        userId: userWallet?.userId || '',
        balanceBefore: Number(userWallet?.balance) || 0,
      }

      // TODO: Replace with real API call when available
      // For now, simulate a successful transaction
      console.log('Transaction data:', transactionData)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: '🚀 Payment initiated successfully!',
        description: `Adding $${data.amount.toLocaleString()} via ${selectedMethodData?.name}`,
      })

      setOpen(false)
      form.reset()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Payment failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = selectedAmount > 0 && selectedMethod && isValid

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Money
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto ">
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <Plus className="h-5 w-5" />
            </div>
            Add Money to Wallet
          </DialogTitle>
          <DialogDescription>
            Add money instantly with secure payment methods
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Current Balance */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ${Number(userWallet?.balance || 0).toLocaleString()}
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-base font-semibold">
              How much would you like to add?
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-10 text-xl h-14 text-center font-semibold"
                {...form.register('amount', { valueAsNumber: true })}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  className="h-10"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            {errors.amount && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Choose payment method</Label>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const isSelected = selectedMethod === method.id

                return (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all border-2 ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                      onClick={() => form.setValue('paymentMethod', method.id as 'card' | 'bank' | 'apple_pay' | 'google_pay')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                isSelected ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{method.name}</p>
                                {method.popular && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{method.fee}</p>
                            <p className="text-xs text-muted-foreground">{method.processingTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {errors.paymentMethod && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Transaction Summary */}
          {selectedAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <Card className="bg-gray-50 dark:bg-gray-900/50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Amount</span>
                    <span>${selectedAmount.toLocaleString()}</span>
                  </div>
                  {fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Processing fee</span>
                      <span>${fee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canProceed || isLoading}
            className="w-full h-12  text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700  disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Add ${selectedAmount > 0 ? total.toFixed(2) : '0.00'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-sm text-green-700 dark:text-green-300">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Secured by 256-bit SSL encryption. Your payment information is never stored on our servers.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddMoneyModalV2
