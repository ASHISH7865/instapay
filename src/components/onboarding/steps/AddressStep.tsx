'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Home, Globe } from 'lucide-react'
import {
  AddressType,
  addressSchema,
  defaultAddress
} from '@/lib/ZodShemas/onboardingSchema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AddressStepProps {
  data: Partial<AddressType>
  onNext: (data: AddressType) => void
  onBack: () => void
}

// Common countries list
const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Switzerland',
  'Austria',
  'Belgium',
  'Ireland',
  'Portugal',
  'Finland',
  'New Zealand',
  'Japan',
  'South Korea',
  'Singapore',
  'Hong Kong',
  'India',
  'Brazil',
  'Mexico',
  'Argentina',
  'Chile',
  'South Africa',
  'Other'
].sort()

// US States
const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
]

// Canadian Provinces
const canadianProvinces = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Yukon'
]

export default function AddressStep({ data, onNext, onBack }: AddressStepProps) {
  const form = useForm<AddressType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      ...defaultAddress,
      ...data,
    },
    mode: 'onChange'
  })

  const watchedCountry = form.watch('country')

  const getStateOptions = () => {
    if (watchedCountry === 'United States') return usStates
    if (watchedCountry === 'Canada') return canadianProvinces
    return []
  }

  const onSubmit = (formData: AddressType) => {
    onNext(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center border-4 border-primary/20">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Where are you located?
        </CardTitle>
        <p className="text-muted-foreground">
          We need your address for security and compliance purposes
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Street Address */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Street Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Main Street, Apt 4B"
                      className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City and State/Province */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your city"
                        className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => {
                  const stateOptions = getStateOptions()

                  if (stateOptions.length > 0) {
                    return (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          {watchedCountry === 'Canada' ? 'Province' : 'State'}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                              <SelectValue placeholder={`Select ${watchedCountry === 'Canada' ? 'province' : 'state'}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {stateOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">State/Province</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter state or province"
                          className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>

            {/* Country and Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Country
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      {watchedCountry === 'United States' ? 'ZIP Code' : 'Postal Code'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={watchedCountry === 'United States' ? '12345' : 'Enter postal code'}
                        className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Info Box */}
            <div className="bg-muted/30 border border-muted-foreground/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">Why do we need your address?</h4>
                  <p className="text-xs text-muted-foreground">
                    Your address helps us verify your identity, comply with financial regulations,
                    and ensure the security of your account. This information is kept private and secure.
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
