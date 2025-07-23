'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield, Eye, EyeOff, Lock, FileText, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SecurityType,
  securitySchema,
  defaultSecurity
} from '@/lib/ZodShemas/onboardingSchema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SecurityStepProps {
  data: Partial<SecurityType>
  onNext: (data: SecurityType) => void
  onBack: () => void
  isLoading?: boolean
}

export default function SecurityStep({ data, onNext, onBack, isLoading = false }: SecurityStepProps) {
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)

  const form = useForm<SecurityType>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      ...defaultSecurity,
      ...data,
    },
    mode: 'onChange'
  })

  const watchedPin = form.watch('walletPin')
  const watchedConfirmPin = form.watch('confirmPin')

  const onSubmit = (formData: SecurityType) => {
    onNext(formData)
  }

  const getPinStrength = (pin: string) => {
    if (!pin) return { strength: 0, label: '', color: '' }
    if (pin.length < 6) return { strength: 1, label: 'Too short', color: 'text-red-500' }

    // Check for patterns
    const hasPattern = /(\d)\1{2,}/.test(pin) || // Repeated digits
                      /012345|123456|234567|345678|456789|567890/.test(pin) || // Sequential
                      /987654|876543|765432|654321|543210|432109|321098|210987|109876|098765/.test(pin) // Reverse sequential

    if (hasPattern) return { strength: 2, label: 'Avoid patterns', color: 'text-orange-500' }

    return { strength: 3, label: 'Strong', color: 'text-green-500' }
  }

  const pinStrength = getPinStrength(watchedPin)
  const pinsMatch = watchedPin && watchedConfirmPin && watchedPin === watchedConfirmPin

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center border-4 border-primary/20">
            <Shield className="w-10 h-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Secure your account
        </CardTitle>
        <p className="text-muted-foreground">
          Set up security features to protect your wallet and transactions
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Wallet PIN Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Lock className="w-5 h-5 text-primary" />
                Wallet PIN
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="walletPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Create PIN</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPin ? "text" : "password"}
                            placeholder="Enter 6-digit PIN"
                            maxLength={6}
                            className={cn(
                              "h-12 bg-background/50 border-muted-foreground/20 focus:border-primary pr-10 font-mono text-center tracking-widest",
                              {
                                'border-green-500 focus:border-green-500': pinStrength.strength === 3,
                                'border-orange-500 focus:border-orange-500': pinStrength.strength === 2,
                                'border-red-500 focus:border-red-500': pinStrength.strength === 1,
                              }
                            )}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                              field.onChange(value)
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      {watchedPin && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((level) => (
                              <div
                                key={level}
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  level <= pinStrength.strength
                                    ? pinStrength.strength === 3
                                      ? "bg-green-500"
                                      : pinStrength.strength === 2
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                    : "bg-muted"
                                )}
                              />
                            ))}
                          </div>
                          <span className={pinStrength.color}>{pinStrength.label}</span>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Confirm PIN</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPin ? "text" : "password"}
                            placeholder="Confirm your PIN"
                            maxLength={6}
                            className={cn(
                              "h-12 bg-background/50 border-muted-foreground/20 focus:border-primary pr-10 font-mono text-center tracking-widest",
                              {
                                'border-green-500 focus:border-green-500': pinsMatch,
                                'border-red-500 focus:border-red-500': watchedConfirmPin && !pinsMatch,
                              }
                            )}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                              field.onChange(value)
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPin(!showConfirmPin)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      {watchedConfirmPin && (
                        <div className="flex items-center gap-2 text-xs">
                          {pinsMatch ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span>PINs match</span>
                            </div>
                          ) : (
                            <span className="text-red-600">PINs don&apos;t match</span>
                          )}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 text-blue-900 dark:text-blue-100">PIN Security Tips</h4>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Avoid using birthdates or obvious patterns</li>
                      <li>• Don&apos;t use repeated numbers (111111, 222222)</li>
                      <li>• Avoid sequential numbers (123456, 654321)</li>
                      <li>• Keep your PIN confidential and secure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-muted-foreground/20 p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-medium">Two-Factor Authentication</FormLabel>
                      <FormDescription>
                        Add an extra layer of security to your account (recommended)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="w-5 h-5 text-primary" />
                Terms & Agreements
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the{' '}
                          <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => window.open('/terms', '_blank')}
                          >
                            Terms of Service
                          </button>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I agree to the{' '}
                          <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => window.open('/privacy', '_blank')}
                          >
                            Privacy Policy
                          </button>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="h-12 px-8"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
