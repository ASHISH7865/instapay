'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  User,
  Mail,
  Phone,
  Building2,
  Heart,
  Star,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Enhanced beneficiary form schema
const beneficiarySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits').optional().or(z.literal('')),
  relationship: z.enum(['family', 'friend', 'business', 'other']).default('other'),
  nickname: z.string().max(30, 'Nickname must be less than 30 characters').optional().or(z.literal('')),
  isFavorite: z.boolean().default(false)
})

type BeneficiaryFormData = z.infer<typeof beneficiarySchema>

interface BeneficiaryFormProps {
  beneficiary?: Partial<BeneficiaryFormData>
  onSubmit: (data: BeneficiaryFormData) => Promise<void>
  onCancel?: () => void
  mode?: 'create' | 'edit'
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
}

const BeneficiaryForm = ({
  beneficiary,
  onSubmit,
  onCancel,
  mode = 'create'
}: BeneficiaryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<BeneficiaryFormData>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: beneficiary?.name || '',
      email: beneficiary?.email || '',
      phoneNumber: beneficiary?.phoneNumber || '',
      relationship: beneficiary?.relationship || 'other',
      nickname: beneficiary?.nickname || '',
      isFavorite: beneficiary?.isFavorite || false
    }
  })

  const { watch, trigger } = form
  const watchedFields = watch()

  // Calculate form completion percentage
  const calculateProgress = () => {
    const requiredFields = ['name']
    const optionalFields = ['email', 'phoneNumber']
        const filledRequired = requiredFields.filter(field => watchedFields[field as keyof BeneficiaryFormData])
    const filledOptional = optionalFields.filter(field => watchedFields[field as keyof BeneficiaryFormData])

    const requiredWeight = 0.7
    const optionalWeight = 0.3

    const requiredScore = (filledRequired.length / requiredFields.length) * requiredWeight
    const optionalScore = (filledOptional.length / optionalFields.length) * optionalWeight

    return Math.round((requiredScore + optionalScore) * 100)
  }

  const progress = calculateProgress()

  const handleSubmit = async (data: BeneficiaryFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      toast.success(mode === 'create' ? 'Beneficiary added successfully!' : 'Beneficiary updated successfully!')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Error submitting beneficiary:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextStep = async () => {
    const fieldsToValidate = currentStep === 1
      ? ['name', 'email', 'phoneNumber']
      : ['relationship']

    const isValid = await trigger(fieldsToValidate as (keyof BeneficiaryFormData)[])
    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'family': return <Heart className="h-4 w-4" />
      case 'friend': return <User className="h-4 w-4" />
      case 'business': return <Building2 className="h-4 w-4" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'family': return 'from-pink-500 to-rose-500'
      case 'friend': return 'from-blue-500 to-indigo-500'
      case 'business': return 'from-emerald-500 to-teal-500'
      default: return 'from-purple-500 to-violet-500'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'family': return 'Family'
      case 'friend': return 'Friend'
      case 'business': return 'Business'
      default: return 'Other'
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center border-4 border-primary/20">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {mode === 'create' ? 'Add New Beneficiary' : 'Edit Beneficiary'}
          </CardTitle>
          <p className="text-muted-foreground">
            {mode === 'create' ? 'Add someone to your beneficiaries list for quick transfers' : 'Update beneficiary information'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Form Completion</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3" />
              <span>{progress >= 100 ? 'All required fields completed' : 'Complete the form to continue'}</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Basic Information
                    </h3>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter full name"
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="email@example.com"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="nickname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Nickname (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Mom, John, Work"
                              className="h-12"
                            />
                          </FormControl>
                          <FormDescription>
                            A friendly name to help you identify this beneficiary quickly
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!watchedFields.name}
                        className="flex items-center gap-2"
                      >
                        Next Step
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Preferences & Settings
                    </h3>

                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold">Relationship Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {['family', 'friend', 'business', 'other'].map((category) => (
                                <SelectItem key={category} value={category}>
                                  <div className="flex items-center gap-2">
                                    <Badge className={cn(
                                      "bg-gradient-to-r",
                                      getCategoryColor(category)
                                    )}>
                                      {getCategoryIcon(category)}
                                      {getCategoryLabel(category)}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the relationship category for better organization
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFavorite"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold">Mark as Favorite</FormLabel>
                            <FormDescription>
                              Favorite beneficiaries appear at the top of your list
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

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {mode === 'create' ? 'Adding...' : 'Updating...'}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            {mode === 'create' ? 'Add Beneficiary' : 'Update Beneficiary'}
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cancel Button */}
              {onCancel && (
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BeneficiaryForm
