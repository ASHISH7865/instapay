/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PartyPopper } from 'lucide-react'
import { onboardUser, generateWelcomeNotification } from '@/lib/actions/onbaording.action'
import { useToast } from '../ui/use-toast'

// Import step components
import OnboardingProgress from '../onboarding/OnboardingProgress'
import PersonalInfoStep from '../onboarding/steps/PersonalInfoStep'
import AddressStep from '../onboarding/steps/AddressStep'
import PreferencesStep from '../onboarding/steps/PreferencesStep'
import SecurityStep from '../onboarding/steps/SecurityStep'

import {
  PersonalInfoType,
  AddressType,
  PreferencesType,
  SecurityType,
  OnboardingFormValuesType
} from '@/lib/ZodShemas/onboardingSchema'



const CompletionStep = ({ onComplete }: any) => (
  <div className="text-center p-8">
    <div className="mb-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <PartyPopper className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Welcome to InstaPay! 🎉</h2>
      <p className="text-muted-foreground">Your account has been created successfully.</p>
    </div>
    <button onClick={onComplete} className="px-8 py-3 bg-green-500 text-white rounded-lg">
      Go to Dashboard
    </button>
  </div>
)

interface OnboardingFormData {
  personalInfo?: PersonalInfoType
  address?: AddressType
  preferences?: PreferencesType
  security?: SecurityType
}

const TOTAL_STEPS = 4

export default function OnboardingForm() {
  const { userId } = useAuth()
  const { user } = useUser()
  const { toast } = useToast()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [formData, setFormData] = useState<OnboardingFormData>({})

  // Track completed steps
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(TOTAL_STEPS).fill(false)
  )

  const handleStepComplete = (stepIndex: number, data: any) => {
    const stepKeys: (keyof OnboardingFormData)[] = ['personalInfo', 'address', 'preferences', 'security']
    const stepKey = stepKeys[stepIndex - 1]

    setFormData(prev => ({
      ...prev,
      [stepKey]: data
    }))

    setCompletedSteps(prev => {
      const newCompleted = [...prev]
      newCompleted[stepIndex - 1] = true
      return newCompleted
    })

    if (stepIndex < TOTAL_STEPS) {
      setCurrentStep(stepIndex + 1)
    } else {
      handleFormSubmit()
    }
  }

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFormSubmit = async () => {
    if (!userId || !user?.primaryEmailAddress?.emailAddress) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to continue',
        variant: 'destructive',
      })
      return
    }

    const { personalInfo, address, preferences, security } = formData

    if (!personalInfo || !address || !preferences || !security) {
      toast({
        title: 'Incomplete Data',
        description: 'Please complete all steps',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const onboardingData: OnboardingFormValuesType = {
        personalInfo,
        address,
        preferences,
        security,
      }

      const result = await onboardUser(
        userId,
        user.primaryEmailAddress.emailAddress,
        onboardingData
      )

      if (result.success) {
        // Generate welcome notification
        if (result.userId) {
          await generateWelcomeNotification(result.userId)
        }

        setIsCompleted(true)
        toast({
          title: '🎉 Welcome to InstaPay!',
          description: 'Your account has been created successfully',
          variant: 'default',
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error: any) {
      console.error('Onboarding error:', error)
      toast({
        title: 'Onboarding Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = () => {
    router.push('/dashboard')
  }

  // Animation variants
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const [direction, setDirection] = useState(0)

  const handleNext = (stepIndex: number, data: any) => {
    setDirection(1)
    handleStepComplete(stepIndex, data)
  }

  const handleBack = () => {
    setDirection(-1)
    handleStepBack()
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CompletionStep onComplete={handleComplete} />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto px-4">
      {/* Progress Indicator */}
      <OnboardingProgress
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        completedSteps={completedSteps}
      />

      {/* Step Content */}
      <div className="w-full relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            {currentStep === 1 && (
              <PersonalInfoStep
                data={formData.personalInfo || {}}
                onNext={(data) => handleNext(1, data)}
              />
            )}
            {currentStep === 2 && (
              <AddressStep
                data={formData.address || {}}
                onNext={(data) => handleNext(2, data)}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <PreferencesStep
                data={formData.preferences || {}}
                onNext={(data) => handleNext(3, data)}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <SecurityStep
                data={formData.security || {}}
                onNext={(data) => handleNext(4, data)}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Creating your account...</p>
            <p className="text-sm text-muted-foreground">This will only take a moment</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
