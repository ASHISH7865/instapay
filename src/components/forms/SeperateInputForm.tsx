/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '../ui/button'
import Spinner from '../shared/spinner'
import { useWalletContext } from '@/provider/wallet-provider'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: 'Your pin must be 6 characters.',
    }),
})

const SeperateInput = ({ numberOfInput, close }: { numberOfInput: number; close?: () => void }) => {
    const [loading, setLoading] = useState(false)
    const { userId } = useAuth()
    const { setBalance } = useWalletContext()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: '',
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (data.pin && userId) {
            setLoading(true)
            // TODO: Replace with real wallet pin verification
            const res = { success: true, message: 'Wallet pin verified' } // Placeholder
            if (!res?.success) {
                form.setError('pin', { message: res?.message })
                setLoading(false)
            } else {
                setBalance(12450.75) // Mock balance for now
                setLoading(false)
                if (close) {
                    close()
                }
            }
        }
    }

    return (
        <article className='flex flex-col items-center gap-4 mt-10'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
                    <FormField
                        control={form.control}
                        name='pin'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter Wallet Pin</FormLabel>
                                <FormControl>
                                    <InputOTP
                                        maxLength={numberOfInput}
                                        render={({ slots }) => (
                                            <InputOTPGroup>
                                                {slots.map((slot, index) => (
                                                    <InputOTPSlot key={index} {...slot} />
                                                ))}
                                            </InputOTPGroup>
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type='submit' variant='secondary' className='w-full' disabled={loading}>
                        {loading ? <Spinner size={4} /> : null}
                        <p className='ml-2'>Submit</p>
                    </Button>
                </form>
            </Form>
        </article>
    )
}

export default SeperateInput
