/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Star,
  Heart,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Enhanced beneficiary form schema
const beneficiarySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number must be less than 15 digits'),
  accountNumber: z.string().min(8, 'Account number must be at least 8 digits').max(20, 'Account number must be less than 20 digits'),
  bankName: z.string().min(2, 'Bank name is required'),
  routingNumber: z.string().min(8, 'Routing number must be at least 8 digits').max(12, 'Routing number must be less than 12 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
  nickname: z.string().max(30, 'Nickname must be less than 30 characters').optional(),
  category: z.enum(['family', 'friend', 'business', 'other']).default('other'),
  isFavorite: z.boolean().default(false)
})

type BeneficiaryFormData = z.infer<typeof beneficiarySchema>

interface UpsertBeneficiaryFormProps {
  beneficiary?: any
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

const UpsertBeneficiaryForm = ({
  beneficiary,
  onSubmit,
  onCancel,
  mode = 'create'
}: UpsertBeneficiaryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [emailVerified] = useState(false)

  const form = useForm<BeneficiaryFormData>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: beneficiary?.name || '',
      email: beneficiary?.email || '',
      phone: beneficiary?.phone || '',
      accountNumber: beneficiary?.accountNumber || '',
      bankName: beneficiary?.bankName || '',
      routingNumber: beneficiary?.routingNumber || '',
      address: beneficiary?.address || '',
      nickname: beneficiary?.nickname || '',
      category: beneficiary?.category || 'other',
      isFavorite: beneficiary?.isFavorite || false
    }
  })

  const { watch, trigger } = form
  const watchedFields = watch()

  // Calculate form completion percentage
  const calculateProgress = () => {
    const requiredFields = ['name', 'email', 'phone', 'accountNumber', 'bankName', 'routingNumber']
    const filledFields = requiredFields.filter(field => watchedFields[field as keyof BeneficiaryFormData])
    return Math.round((filledFields.length / requiredFields.length) * 100)
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
      ? ['name', 'email', 'phone']
      : ['accountNumber', 'bankName', 'routingNumber']

    const isValid = await trigger(fieldsToValidate as any)
    if (isValid) {
      setCurrentStep(currentStep + 1)
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header with AI Enhancement Banner */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 backdrop-blur-sm shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 opacity-50" />
            <motion.div
              className="absolute top-4 right-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-6 w-6 text-blue-500" />
            </motion.div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {mode === 'create' ? 'Add New Beneficiary' : 'Edit Beneficiary'}
                    </h2>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Zap className="h-3 w-3 mr-1" />
                      Secure & Encrypted
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {mode === 'create'
                      ? 'Add trusted recipients for quick and secure money transfers. All information is encrypted and secure.'
                      : 'Update beneficiary information. All changes are automatically validated and secured.'
                    }
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Form Completion</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Multi-step Form */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-2xl bg-white/70 dark:bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 1 && <User className="h-5 w-5 text-blue-500" />}
                  {currentStep === 2 && <CreditCard className="h-5 w-5 text-emerald-500" />}
                  {currentStep === 3 && <MapPin className="h-5 w-5 text-purple-500" />}
                  Step {currentStep} of 3
                </CardTitle>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                        step <= currentStep
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step < currentStep ? <CheckCircle2 className="h-4 w-4" /> : step}
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-foreground mb-2">Personal Information</h3>
                          <p className="text-muted-foreground">Enter the recipient&apos;s basic details</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Full Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter full name"
                                    {...field}
                                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-blue-500 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="nickname"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Star className="h-4 w-4" />
                                  Nickname (Optional)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Easy to remember name"
                                    {...field}
                                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-blue-500 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Email Address
                                  {emailVerified && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="email"
                                      placeholder="Enter email address"
                                      {...field}
                                      className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-blue-500 transition-all duration-300"
                                    />
                                    {field.value && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                      >
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                      </motion.div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Phone Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    {...field}
                                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-blue-500 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Category Selection */}
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship Category</FormLabel>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                                {['family', 'friend', 'business', 'other'].map((category) => (
                                  <motion.div
                                    key={category}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => field.onChange(category)}
                                      className={cn(
                                        "w-full p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                                        field.value === category
                                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                                          : "border-border hover:border-blue-300"
                                      )}
                                    >
                                      <div className={cn(
                                        "p-2 rounded-lg bg-gradient-to-br",
                                        getCategoryColor(category)
                                      )}>
                                        {getCategoryIcon(category)}
                                      </div>
                                      <span className="text-sm font-medium capitalize">{category}</span>
                                    </button>
                                  </motion.div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Continue to Banking Details
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Banking Information */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-foreground mb-2">Banking Information</h3>
                          <p className="text-muted-foreground">Secure banking details for transfers</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  Bank Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter bank name"
                                    {...field}
                                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-emerald-500 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  Account Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter account number"
                                    {...field}
                                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-emerald-500 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="routingNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Routing Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter routing number"
                                    {...field}
                                    className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-emerald-500 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="isFavorite"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-center">
                                <div className="space-y-2 text-center">
                                  <FormLabel>Mark as Favorite</FormLabel>
                                  <motion.button
                                    type="button"
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => field.onChange(!field.value)}
                                    className={cn(
                                      "p-4 rounded-full transition-all duration-300",
                                      field.value
                                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                                        : "bg-muted hover:bg-muted/80"
                                    )}
                                  >
                                    <Heart className={cn("h-6 w-6", field.value && "fill-current")} />
                                  </motion.button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(1)}
                            className="border-2"
                          >
                            Back to Personal Info
                          </Button>
                          <Button
                            type="button"
                            onClick={handleNextStep}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Continue to Address
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Address & Review */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-foreground mb-2">Address & Review</h3>
                          <p className="text-muted-foreground">Final details and confirmation</p>
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Address (Optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter full address"
                                  {...field}
                                  className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-all duration-300"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Review Section */}
                        <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-emerald-950/20 border-0">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              Review Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground">Name</p>
                                <p className="font-semibold">{watchedFields.name || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Email</p>
                                <p className="font-semibold">{watchedFields.email || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Bank</p>
                                <p className="font-semibold">{watchedFields.bankName || 'Not provided'}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Category</p>
                                <div className="flex items-center gap-2">
                                  {getCategoryIcon(watchedFields.category)}
                                  <span className="font-semibold capitalize">{watchedFields.category}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(2)}
                            className="border-2"
                          >
                            Back to Banking Info
                          </Button>
                          <div className="flex gap-3">
                            {onCancel && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                className="border-2"
                              >
                                Cancel
                              </Button>
                            )}
                            <Button
                              type="submit"
                              disabled={isSubmitting || progress < 100}
                              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[120px]"
                            >
                              {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  {mode === 'create' ? 'Adding...' : 'Updating...'}
                                </div>
                              ) : (
                                mode === 'create' ? 'Add Beneficiary' : 'Update Beneficiary'
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UpsertBeneficiaryForm
