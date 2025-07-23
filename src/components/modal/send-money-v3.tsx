/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useSendMoney } from '@/hooks/useSendMoneyRTK'
import { useUserVerification } from '@/hooks/useUserRTK'
import { useWallets } from '@/hooks/useWalletRTK'
import type { Wallet } from '@/lib/store/slices/walletApi'
import { toast } from 'sonner'
import { Loader2, Send, Shield, AlertCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Validation schema
const sendMoneySchema = z.object({
    recipientEmail: z.string().email('Please enter a valid email address'),
    amount: z.number().min(0.01, 'Amount must be at least $0.01').max(10000, 'Amount cannot exceed $10,000'),
    description: z.string().min(1, 'Description is required').max(255, 'Description too long'),
    walletId: z.string().min(1, 'Please select a wallet'),
})

type SendMoneyFormData = z.infer<typeof sendMoneySchema>

interface SendMoneyModalProps {
    isOpen: boolean
    onClose: () => void
    defaultRecipient?: string
    defaultAmount?: number
}

export function SendMoneyModal({ isOpen, onClose, defaultRecipient, defaultAmount }: SendMoneyModalProps) {
    const [step, setStep] = useState<'form' | 'review' | 'pin' | 'success'>('form')
    const [formData, setFormData] = useState<SendMoneyFormData | null>(null)
    const [pin, setPin] = useState('')

    const { wallets } = useWallets()
    const { sendMoney, isLoading: isSending, error: sendMoneyError } = useSendMoney()

    const form = useForm<SendMoneyFormData>({
        resolver: zodResolver(sendMoneySchema),
        defaultValues: {
            recipientEmail: defaultRecipient || '',
            amount: defaultAmount || 0,
            description: '',
            walletId: '',
        },
    })

    // Function to clear field error on focus
    const clearFieldError = (fieldName: keyof SendMoneyFormData) => {
        if (form.formState.errors[fieldName]) {
            form.clearErrors(fieldName)
        }
    }

    const selectedWallet = wallets?.data?.find((w: Wallet) => w.id === form.watch('walletId'));
    const amount = form.watch('amount')
    const recipientEmail = form.watch('recipientEmail')

    // Real-time user verification
    const { verifyUserHandler, data: userVerification, isLoading: verifyingUser, error: userVerificationError } = useUserVerification()

    const handleVerifyUser = async () => {
        await verifyUserHandler(recipientEmail)
    }
    const onSubmit = async (data: SendMoneyFormData) => {
        // Check if user exists before proceeding
        if (!userVerification?.data?.exists) {
            toast.error('Please enter a valid recipient email address')
            return
        }

        setFormData(data)
        setStep('review')
    }

    const handleReviewConfirm = () => {
        setStep('pin')
    }

    const handlePinConfirm = async () => {
        if (!formData || pin.length !== 4) return

        try {
            await sendMoney({ ...formData, pin })
            setStep('success')

            // Reset form
            form.reset()
            setFormData(null)
            setPin('')

            // Close modal after 2 seconds
            setTimeout(() => {
                onClose()
                setStep('form')
            }, 2000)
        } catch (error) {
            // Error is handled by the mutation
        }
    }

    const handleClose = () => {
        if (isSending) return // Prevent closing during transaction

        onClose()
        setStep('form')
        form.reset()
        setFormData(null)
        setPin('')
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Money
                    </DialogTitle>
                </DialogHeader>

                {step === 'form' && (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Recipient Section */}
                        <div className="space-y-2">
                            <Label htmlFor="recipientEmail">Recipient Email</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        id="recipientEmail"
                                        type="email"
                                        placeholder="Enter recipient's email"
                                        {...form.register('recipientEmail')}
                                        onFocus={() => clearFieldError('recipientEmail')}
                                        className={cn(
                                            form.formState.errors.recipientEmail && 'border-red-500',
                                            userVerification?.data?.exists && 'border-green-500',
                                            userVerification?.data?.exists === false && 'border-red-500'
                                        )}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleVerifyUser}
                                    disabled={!recipientEmail || !recipientEmail.includes('@') || verifyingUser}
                                    className="shrink-0"
                                >
                                    {verifyingUser ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Verify'
                                    )}
                                </Button>
                            </div>

                            {/* Verification Status */}
                            {recipientEmail && recipientEmail.includes('@') && (
                                <div className="mt-2">
                                    {verifyingUser ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Verifying user...</span>
                                        </div>
                                    ) : userVerification?.data?.exists ? (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>{userVerification.data?.user?.displayName} will receive the money</span>
                                        </div>
                                    ) : userVerification?.data?.exists === false ? (
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <XCircle className="h-4 w-4" />
                                            <span>User not found in our system</span>
                                        </div>
                                    ) : null}

                                    {userVerificationError && (userVerificationError as any)?.data?.data && (
                                        <div className="flex items-center gap-2 text-sm text-red-600">
                                            <XCircle className="h-4 w-4" />
                                            <span>{(userVerificationError as any)?.data?.data?.error || 'Verification failed'}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {form.formState.errors.recipientEmail && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.recipientEmail.message}
                                </p>
                            )}
                        </div>

                        {/* Amount Section */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                    $
                                </span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    {...form.register('amount', { valueAsNumber: true })}
                                    onFocus={() => clearFieldError('amount')}
                                    className="pl-8"
                                />
                            </div>
                            {form.formState.errors.amount && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.amount.message}
                                </p>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="What's this payment for?"
                                {...form.register('description')}
                                onFocus={() => clearFieldError('description')}
                                maxLength={255}
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Wallet Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="walletId">From Wallet</Label>
                            <Select
                                value={form.watch('walletId')}
                                onValueChange={(value) => {
                                    form.setValue('walletId', value)
                                    clearFieldError('walletId')
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a wallet" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets?.data?.map((wallet: Wallet) => (
                                        <SelectItem key={wallet.id} value={wallet.id}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{wallet.name}</span>
                                                <Badge variant="secondary" className="ml-2">
                                                    {formatCurrency(wallet.balance)}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.walletId && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.walletId.message}
                                </p>
                            )}
                        </div>

                        {/* Balance Check */}
                        {selectedWallet && amount > 0 &&
                            amount > selectedWallet.balance && (<Card className="">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>Insufficient balance</span>
                                    </div>
                                </CardContent>
                            </Card>
                            )}



                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isSending || !userVerification?.data?.exists || verifyingUser}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Continue
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'review' && formData && (
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Review Transaction</CardTitle>
                                <CardDescription>
                                    Please review the details before proceeding
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">To:</span>
                                    <span className="font-medium">{formData.recipientEmail}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Amount:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {formatCurrency(formData.amount)}
                                    </span>
                                </div>
                                {formData.description && (
                                    <>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Description:</span>
                                            <span className="font-medium">{formData.description}</span>
                                        </div>
                                    </>
                                )}
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">From Wallet:</span>
                                    <span className="font-medium">{selectedWallet?.name}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Fee:</span>
                                    <span className="font-medium text-green-600">$0.00</span>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('form')}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleReviewConfirm}
                                className="flex-1"
                            >
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'pin' && formData && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold">Enter Wallet PIN</h3>
                            <p className="text-sm text-muted-foreground">Enter your 4-digit PIN to complete the transaction</p>
                        </div>

                        {/* Transaction Summary */}
                        <Card className="bg-muted/50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Sending to:</span>
                                    <span className="font-medium">{formData.recipientEmail}</span>
                                </div>
                                <div className="flex items-center justify-between text-lg font-bold mt-2">
                                    <span>Amount:</span>
                                    <span className="text-green-600">{formatCurrency(formData.amount)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PIN Input */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-base font-semibold">
                                <Shield className="h-4 w-4" />
                                Wallet PIN
                            </Label>
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={4}
                                    value={pin}
                                    onChange={(value) => setPin(value)}
                                    render={({ slots }) => (
                                        <InputOTPGroup>
                                            {slots.map((slot, index) => (
                                                <InputOTPSlot key={index} {...slot} />
                                            ))}
                                        </InputOTPGroup>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep('review')}
                                className="flex-1"
                                disabled={isSending}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handlePinConfirm}
                                className="flex-1"
                                disabled={isSending || pin.length !== 4}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Money
                                    </>
                                )}
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            {
                                sendMoneyError && (
                                    <div className="flex items-center gap-2 text-sm text-red-600">
                                        <XCircle className="h-4 w-4" />
                                        <span>Something went wrong.</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Send className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-green-600">Money Sent Successfully!</h3>
                            <p className="text-muted-foreground mt-1">
                                Your transaction has been completed and the recipient will be notified.
                            </p>
                        </div>
                        <Button onClick={handleClose} className="w-full">
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
