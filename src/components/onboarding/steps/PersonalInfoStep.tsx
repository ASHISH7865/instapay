'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PersonalInfoType,
  personalInfoSchema,
  defaultPersonalInfo
} from '@/lib/ZodShemas/onboardingSchema'
import { checkUsernameAvailability } from '@/lib/actions/onbaording.action'
import { useAuth, useUser } from '@clerk/nextjs'

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface PersonalInfoStepProps {
  data: Partial<PersonalInfoType>
  onNext: (data: PersonalInfoType) => void
  onBack?: () => void
}

export default function PersonalInfoStep({ data, onNext, onBack }: PersonalInfoStepProps) {
  const { user } = useUser()
  const { userId } = useAuth()
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [checkingUsername, setCheckingUsername] = useState(false)

  // Track date parts separately for better control
  const [dateParts, setDateParts] = useState<{
    month: string
    day: string
    year: string
  }>({
    month: '',
    day: '',
    year: ''
  })

  // State for phone number formatting
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')

  const form = useForm<PersonalInfoType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ...defaultPersonalInfo,
      ...data,
      firstName: data.firstName || user?.firstName || '',
      lastName: data.lastName || user?.lastName || '',
      username: data.username || user?.username || '',
    },
    mode: 'onChange'
  })

  const watchedUsername = form.watch('username')

  // Watch the dateOfBirth field separately to avoid issues
  const watchedDateOfBirth = form.watch('dateOfBirth')

  // Sync dateParts with form value
  useEffect(() => {
    if (watchedDateOfBirth && !dateParts.month && !dateParts.day && !dateParts.year) {
      const date = new Date(watchedDateOfBirth)
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      setDateParts({
        month: months[date.getMonth()],
        day: date.getDate().toString(),
        year: date.getFullYear().toString()
      })
    }
  }, [watchedDateOfBirth, dateParts.month, dateParts.day, dateParts.year])

  // Check username availability
  useEffect(() => {
    if (watchedUsername && watchedUsername.length >= 3) {
      setCheckingUsername(true)
      const timeoutId = setTimeout(async () => {
        try {
          const result = await checkUsernameAvailability(watchedUsername, userId || undefined)
          setUsernameStatus(result.available ? 'available' : 'taken')
        } catch (error) {
          setUsernameStatus('idle')
        } finally {
          setCheckingUsername(false)
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setUsernameStatus('idle')
      setCheckingUsername(false)
    }
  }, [watchedUsername, userId])

  const onSubmit = (formData: PersonalInfoType) => {
    onNext(formData)
  }

  const getUserInitials = () => {
    const firstName = form.watch('firstName')
    const lastName = form.watch('lastName')
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

    // Handle phone number formatting
  const handlePhoneNumberChange = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '')

    // Limit to 10 digits for US/Canada, 15 for international
    const maxDigits = phoneCountryCode === '+1' ? 10 : 15
    const limitedDigits = digitsOnly.slice(0, maxDigits)

    // Format based on country code for display
    let formatted = ''
    if (phoneCountryCode === '+1') {
      // US/Canada formatting: (123) 456-7890
      if (limitedDigits.length >= 6) {
        formatted = `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`
      } else if (limitedDigits.length >= 3) {
        formatted = `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}`
      } else {
        formatted = limitedDigits
      }
    } else {
      // International formatting: add spaces every 3-4 digits
      formatted = limitedDigits.replace(/(\d{2,3})(?=\d)/g, '$1 ')
    }

    setPhoneNumber(formatted)

    // Store in form as digits only with country code (for validation)
    const cleanPhoneNumber = phoneCountryCode + limitedDigits
    form.setValue('phoneNumber', cleanPhoneNumber)
  }

  // Initialize phone number from form data
  useEffect(() => {
    const currentPhoneNumber = form.watch('phoneNumber')
    if (currentPhoneNumber && !phoneNumber) {
      // Try to parse existing phone number (format: +1234567890)
      const countryCodeMatch = currentPhoneNumber.match(/^(\+\d{1,3})(\d+)$/)
      if (countryCodeMatch) {
        const [, countryCode, digits] = countryCodeMatch
        setPhoneCountryCode(countryCode)

        // Format the digits for display
        let formatted = ''
        if (countryCode === '+1') {
          // US/Canada formatting
          if (digits.length >= 6) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
          } else if (digits.length >= 3) {
            formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}`
          } else {
            formatted = digits
          }
        } else {
          // International formatting
          formatted = digits.replace(/(\d{2,3})(?=\d)/g, '$1 ')
        }
        setPhoneNumber(formatted)
      }
    }
  }, [form.watch('phoneNumber'), phoneNumber])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto mb-4">
          <Avatar className="w-20 h-20 border-4 border-primary/20">
            <AvatarImage src={user?.imageUrl} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xl font-bold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Tell us about yourself
        </CardTitle>
        <p className="text-muted-foreground">
          We need some basic information to create your personalized InstaPay experience
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Display Name */}
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Display Name
                    <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="How would you like to be called?"
                      className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Choose a unique username"
                        className={cn(
                          "h-12 bg-background/50 border-muted-foreground/20 focus:border-primary pr-10",
                          {
                            'border-green-500 focus:border-green-500': usernameStatus === 'available',
                            'border-red-500 focus:border-red-500': usernameStatus === 'taken',
                          }
                        )}
                        {...field}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {checkingUsername && (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                        {!checkingUsername && usernameStatus === 'available' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {!checkingUsername && usernameStatus === 'taken' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  {usernameStatus === 'available' && (
                    <p className="text-xs text-green-600">✓ Username is available</p>
                  )}
                  {usernameStatus === 'taken' && (
                    <p className="text-xs text-red-600">✗ Username is already taken</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => {
                const selectedDate = field.value ? new Date(field.value) : null
                const currentYear = new Date().getFullYear()
                const years = Array.from({ length: currentYear - 1900 }, (_, i) => currentYear - 18 - i)
                const months = [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ]
                const getDaysInMonth = (month: number, year: number) => {
                  return new Date(year, month + 1, 0).getDate()
                }

                const selectedYear = selectedDate?.getFullYear()
                const selectedMonth = selectedDate?.getMonth()
                const selectedDay = selectedDate?.getDate()

                // Calculate days for current month/year selection or default to 31
                const daysInSelectedMonth = selectedYear && selectedMonth !== undefined
                  ? getDaysInMonth(selectedMonth, selectedYear)
                  : 31
                const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1)

                                                const handleDateChange = (type: 'year' | 'month' | 'day', value: string) => {
                  // Update the date parts state
                  const newDateParts = { ...dateParts }
                  newDateParts[type] = value
                  setDateParts(newDateParts)

                  // Get current values from either existing date or new selections
                  let newYear: number
                  let newMonth: number
                  let newDay: number

                  if (type === 'year') {
                    newYear = parseInt(value)
                    newMonth = newDateParts.month ? months.indexOf(newDateParts.month) : (selectedMonth !== undefined ? selectedMonth : 0)
                    newDay = newDateParts.day ? parseInt(newDateParts.day) : (selectedDay || 1)
                  } else if (type === 'month') {
                    newMonth = months.indexOf(value)
                    newYear = newDateParts.year ? parseInt(newDateParts.year) : (selectedYear || currentYear - 25)
                    newDay = newDateParts.day ? parseInt(newDateParts.day) : (selectedDay || 1)
                  } else if (type === 'day') {
                    newDay = parseInt(value)
                    newMonth = newDateParts.month ? months.indexOf(newDateParts.month) : (selectedMonth !== undefined ? selectedMonth : 0)
                    newYear = newDateParts.year ? parseInt(newDateParts.year) : (selectedYear || currentYear - 25)
                  } else {
                    return
                  }

                  // Ensure the day is valid for the selected month/year
                  const maxDays = getDaysInMonth(newMonth, newYear)
                  if (newDay > maxDays) {
                    newDay = maxDays
                    setDateParts(prev => ({ ...prev, day: newDay.toString() }))
                  }

                  // Create new date
                  const newDate = new Date(newYear, newMonth, newDay)

                  // Always update the form field to allow selection
                  if (!isNaN(newDate.getTime())) {
                    field.onChange(newDate)
                  }
                }

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Date of Birth</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {/* Month Dropdown */}
                      <Select
                        value={dateParts.month || (selectedMonth !== undefined ? months[selectedMonth] : "")}
                        onValueChange={(value) => handleDateChange('month', value)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Day Dropdown */}
                      <Select
                        value={dateParts.day || (selectedDay ? selectedDay.toString() : "")}
                        onValueChange={(value) => handleDateChange('day', value)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day} value={day.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Year Dropdown */}
                      <Select
                        value={dateParts.year || (selectedYear ? selectedYear.toString() : "")}
                        onValueChange={(value) => handleDateChange('year', value)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Selected: {selectedDate.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {/* Gender and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background/50 border-muted-foreground/20">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                        <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Select
                          value={phoneCountryCode}
                          onValueChange={(value) => {
                            setPhoneCountryCode(value)
                            // Re-format phone number with new country code
                            if (phoneNumber) {
                              // Extract digits from formatted phone number
                              const digits = phoneNumber.replace(/\D/g, '')
                              // Update form with clean format
                              form.setValue('phoneNumber', `${value}${digits}`)
                            }
                          }}
                        >
                          <SelectTrigger className="h-12 w-[140px] bg-background/50 border-muted-foreground/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+1">🇨🇦 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                            <SelectItem value="+33">🇫🇷 +33</SelectItem>
                            <SelectItem value="+49">🇩🇪 +49</SelectItem>
                            <SelectItem value="+39">🇮🇹 +39</SelectItem>
                            <SelectItem value="+34">🇪🇸 +34</SelectItem>
                            <SelectItem value="+31">🇳🇱 +31</SelectItem>
                            <SelectItem value="+41">🇨🇭 +41</SelectItem>
                            <SelectItem value="+43">🇦🇹 +43</SelectItem>
                            <SelectItem value="+32">🇧🇪 +32</SelectItem>
                            <SelectItem value="+45">🇩🇰 +45</SelectItem>
                            <SelectItem value="+46">🇸🇪 +46</SelectItem>
                            <SelectItem value="+47">🇳🇴 +47</SelectItem>
                            <SelectItem value="+358">🇫🇮 +358</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91</SelectItem>
                            <SelectItem value="+86">🇨🇳 +86</SelectItem>
                            <SelectItem value="+81">🇯🇵 +81</SelectItem>
                            <SelectItem value="+82">🇰🇷 +82</SelectItem>
                            <SelectItem value="+61">🇦🇺 +61</SelectItem>
                            <SelectItem value="+64">🇳🇿 +64</SelectItem>
                            <SelectItem value="+55">🇧🇷 +55</SelectItem>
                            <SelectItem value="+52">🇲🇽 +52</SelectItem>
                            <SelectItem value="+7">🇷🇺 +7</SelectItem>
                            <SelectItem value="+380">🇺🇦 +380</SelectItem>
                            <SelectItem value="+48">🇵🇱 +48</SelectItem>
                            <SelectItem value="+420">🇨🇿 +420</SelectItem>
                            <SelectItem value="+36">🇭🇺 +36</SelectItem>
                            <SelectItem value="+40">🇷🇴 +40</SelectItem>
                            <SelectItem value="+30">🇬🇷 +30</SelectItem>
                            <SelectItem value="+351">🇵🇹 +351</SelectItem>
                            <SelectItem value="+90">🇹🇷 +90</SelectItem>
                            <SelectItem value="+27">🇿🇦 +27</SelectItem>
                            <SelectItem value="+234">🇳🇬 +234</SelectItem>
                            <SelectItem value="+254">🇰🇪 +254</SelectItem>
                            <SelectItem value="+20">🇪🇬 +20</SelectItem>
                            <SelectItem value="+971">🇦🇪 +971</SelectItem>
                            <SelectItem value="+966">🇸🇦 +966</SelectItem>
                            <SelectItem value="+92">🇵🇰 +92</SelectItem>
                            <SelectItem value="+880">🇧🇩 +880</SelectItem>
                            <SelectItem value="+94">🇱🇰 +94</SelectItem>
                            <SelectItem value="+60">🇲🇾 +60</SelectItem>
                            <SelectItem value="+65">🇸🇬 +65</SelectItem>
                            <SelectItem value="+66">🇹🇭 +66</SelectItem>
                            <SelectItem value="+84">🇻🇳 +84</SelectItem>
                            <SelectItem value="+63">🇵🇭 +63</SelectItem>
                            <SelectItem value="+62">🇮🇩 +62</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => handlePhoneNumberChange(e.target.value)}
                          placeholder="Enter your phone number"
                          className="h-12 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors flex-1"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    {phoneNumber && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete number: {phoneCountryCode} {phoneNumber}
                        <span className="ml-2 text-green-600">
                          ✓ Valid format
                        </span>
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="h-12 px-8"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 ml-auto"
                disabled={!form.formState.isValid || usernameStatus === 'taken' || checkingUsername}
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
