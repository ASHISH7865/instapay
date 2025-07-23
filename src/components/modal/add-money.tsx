'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { Separator } from '../ui/separator'
import {
    Plus,
    CreditCard,
    Wallet,
    ArrowRight,
    DollarSign,
    Lock,
    Shield,
    Zap,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '../ui/use-toast'
import { useWalletContext } from '@/provider/wallet-provider'

import { Data } from '@/types/transaction.types'

const addMoneySchema = z.object({
    amount: z.number().min(1, 'Amount must be at least $1').max(10000, 'Amount cannot exceed $10,000'),
    paymentMethod: z.string().min(1, 'Please select a payment method')
})

type AddMoneyFormValues = z.infer<typeof addMoneySchema>

const quickAmounts = [10, 25, 50, 100, 250, 500]

const paymentMethods = [
    {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: CreditCard,
        description: 'Instant transfer',
        fee: '2.9% + $0.30',
        instant: true
    },
    {
        id: 'bank',
        name: 'Bank Transfer',
        icon: Wallet,
        description: '1-3 business days',
        fee: 'Free',
        instant: false
    }
]

const AddMoneyModal = () => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState<'amount' | 'method' | 'confirm'>('amount')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { userWallet } = useWalletContext()

    const form = useForm<AddMoneyFormValues>({
        resolver: zodResolver(addMoneySchema),
        defaultValues: {
            amount: 0,
            paymentMethod: ''
        }
    })

    const selectedAmount = form.watch('amount')
    const selectedMethod = form.watch('paymentMethod')
    const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)

    const calculateFee = (amount: number, methodId: string) => {
        if (methodId === 'card') {
            return Math.round((amount * 0.029 + 0.30) * 100) / 100
        }
        return 0
    }

    const fee = calculateFee(selectedAmount, selectedMethod)
    const total = selectedAmount + fee

    const handleQuickAmount = (amount: number) => {
        form.setValue('amount', amount)
    }

    const handleMethodSelect = (methodId: string) => {
        form.setValue('paymentMethod', methodId)
        setStep('confirm')
    }

    const handleSubmit = async (data: AddMoneyFormValues) => {
        try {
            setIsLoading(true)

            const transactionData: Data = {
                amountToBeAdded: data.amount,
                currentCurrency: userWallet?.currency || 'USD',
                transactionName: 'Wallet_Top_Up',
                userId: userWallet?.userId || '',
                balanceBefore: Number(userWallet?.balance) || 0,
            }

            // TODO: Implement checkout wallet money functionality
            console.log('Checkout wallet money:', transactionData)

            toast({
                title: 'Payment initiated',
                description: 'You will be redirected to complete the payment',
            })

            setOpen(false)
            resetModal()
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

    const resetModal = () => {
        setStep('amount')
        form.reset()
    }

    const handleBack = () => {
        if (step === 'method') setStep('amount')
        if (step === 'confirm') setStep('method')
    }

    const renderAmountStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Current Balance */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Balance</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                ${Number(userWallet?.balance)?.toLocaleString() || '0'}
                            </p>
                        </div>
                        <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardContent>
            </Card>

            {/* Amount Input */}
            <div className="space-y-4">
                <Label htmlFor="amount" className="text-base font-semibold">
                    How much would you like to add?
                </Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="amount"
                        type="number"
                        placeholder="0"
                        className="pl-10 text-xl h-14 text-center font-semibold"
                        {...form.register('amount', { valueAsNumber: true })}
                    />
                </div>
                {form.formState.errors.amount && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {form.formState.errors.amount.message}
                    </p>
                )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Quick amounts</Label>
                <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((amount) => (
                        <Button
                            key={amount}
                            type="button"
                            variant={selectedAmount === amount ? "default" : "outline"}
                            className="h-12 text-base font-semibold"
                            onClick={() => handleQuickAmount(amount)}
                        >
                            ${amount}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Continue Button */}
            <Button
                type="button"
                className="w-full h-12 text-base font-semibold"
                onClick={() => setStep('method')}
                disabled={!selectedAmount || selectedAmount <= 0}
            >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </motion.div>
    )

    const renderMethodStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h3 className="text-lg font-semibold">Add ${selectedAmount}</h3>
                <p className="text-sm text-muted-foreground">Choose your payment method</p>
            </div>

            <div className="space-y-3">
                {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                        <Card
                            key={method.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${selectedMethod === method.id
                                ? 'ring-2 ring-primary border-primary'
                                : 'hover:border-primary/50'
                                }`}
                            onClick={() => handleMethodSelect(method.id)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{method.name}</p>
                                            <p className="text-sm text-muted-foreground">{method.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{method.fee}</p>
                                        {method.instant && (
                                            <Badge variant="secondary" className="mt-1">
                                                <Zap className="h-3 w-3 mr-1" />
                                                Instant
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBack}
            >
                Back
            </Button>
        </motion.div>
    )

    const renderConfirmStep = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">Confirm your payment</h3>
                <p className="text-sm text-muted-foreground">Review the details below</p>
            </div>

            {/* Transaction Summary */}
            <Card>
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold">${selectedAmount.toLocaleString()}</span>
                    </div>

                    {fee > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Processing fee</span>
                            <span className="font-semibold">${fee.toFixed(2)}</span>
                        </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method Summary */}
            {selectedMethodData && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <selectedMethodData.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">{selectedMethodData.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedMethodData.description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100">Secure payment</p>
                    <p className="text-blue-700 dark:text-blue-300">
                        Your payment is protected by 256-bit SSL encryption
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBack}
                    disabled={isLoading}
                >
                    Back
                </Button>
                <Button
                    type="button"
                    className="flex-1"
                    onClick={() => handleSubmit(form.getValues())}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Lock className="mr-2 h-4 w-4" />
                            Pay ${total.toFixed(2)}
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    )

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) resetModal()
        }}>
            <DialogTrigger asChild>
                <Button className="h-12">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Money
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Add Money to Wallet
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'amount' && 'Enter the amount you want to add to your wallet'}
                        {step === 'method' && 'Choose how you want to pay'}
                        {step === 'confirm' && 'Review and confirm your payment'}
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {step === 'amount' && (
                        <motion.div key="amount">
                            {renderAmountStep()}
                        </motion.div>
                    )}
                    {step === 'method' && (
                        <motion.div key="method">
                            {renderMethodStep()}
                        </motion.div>
                    )}
                    {step === 'confirm' && (
                        <motion.div key="confirm">
                            {renderConfirmStep()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}

export default AddMoneyModal
