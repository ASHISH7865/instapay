'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Settings, Globe, DollarSign, Bell, Mail, Shield, Search } from 'lucide-react'
import {
  PreferencesType,
  preferencesSchema,
  defaultPreferences
} from '@/lib/ZodShemas/onboardingSchema'
import { useGeoData } from '@/hooks/useGeoData'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PreferencesStepProps {
  data: Partial<PreferencesType>
  onNext: (data: PreferencesType) => void
  onBack: () => void
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
]

export default function PreferencesStep({ data, onNext, onBack }: PreferencesStepProps) {
  const { loading: geoLoading, searchCurrencies, searchTimezones } = useGeoData()
  const [currencySearch, setCurrencySearch] = useState('')
  const [timezoneSearch, setTimezoneSearch] = useState('')

  const filteredCurrencies = searchCurrencies(currencySearch)
  const filteredTimezones = searchTimezones(timezoneSearch)

  const form = useForm<PreferencesType>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      ...defaultPreferences,
      ...data,
    },
    mode: 'onChange'
  })

  const onSubmit = (formData: PreferencesType) => {
    onNext(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center border-4 border-primary/20">
            <Settings className="w-10 h-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Customize your experience
        </CardTitle>
        <p className="text-muted-foreground">
          Set your preferences for currency, language, and notifications
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Regional Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Globe className="w-5 h-5 text-primary" />
                Regional Settings
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Primary Currency
                      </FormLabel>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search currencies..."
                          value={currencySearch}
                          onChange={(e) => setCurrencySearch(e.target.value)}
                          className="pl-10 mb-2"
                        />
                      </div>
                      <Select onValueChange={field.onChange} value={field.value} disabled={geoLoading.currencies}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                            <SelectValue placeholder={geoLoading.currencies ? "Loading currencies..." : "Select currency"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {filteredCurrencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{currency.symbol}</span>
                                <span>{currency.name}</span>
                                <span className="text-xs text-muted-foreground">({currency.code})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This will be your default currency for transactions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Language</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Interface language for the app
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Timezone</FormLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search timezones..."
                        value={timezoneSearch}
                        onChange={(e) => setTimezoneSearch(e.target.value)}
                        className="pl-10 mb-2"
                      />
                    </div>
                    <Select onValueChange={field.onChange} value={field.value} disabled={geoLoading.timezones}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                          <SelectValue placeholder={geoLoading.timezones ? "Loading timezones..." : "Select timezone"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {filteredTimezones.map((timezone) => (
                          <SelectItem key={timezone.value} value={timezone.value}>
                            <div className="flex items-center gap-2">
                              <span>{timezone.label}</span>
                              <span className="text-xs text-muted-foreground">({timezone.offset})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Used for transaction timestamps and notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notification Settings */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="transactionNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-muted-foreground/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Transaction Alerts</FormLabel>
                        <FormDescription>
                          Get notified for all incoming and outgoing transactions
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

                <FormField
                  control={form.control}
                  name="securityAlerts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-muted-foreground/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Security Alerts
                        </FormLabel>
                        <FormDescription>
                          Important security notifications and login alerts
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

                <FormField
                  control={form.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-muted-foreground/20 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Marketing Emails
                        </FormLabel>
                        <FormDescription>
                          Product updates, tips, and special offers
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
            </div>

            {/* Info Box */}
            <div className="bg-muted/30 border border-muted-foreground/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">You can change these later</h4>
                  <p className="text-xs text-muted-foreground">
                    All these preferences can be updated anytime from your account settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="h-12 px-8"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                disabled={!form.formState.isValid}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
