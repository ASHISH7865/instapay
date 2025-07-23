'use client'

import React from 'react'
import { CheckCircle, User, MapPin, Settings, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
  completedSteps: boolean[]
}

const stepConfig = [
  {
    id: 1,
    title: 'Personal Info',
    description: 'Basic information',
    icon: User,
  },
  {
    id: 2,
    title: 'Address',
    description: 'Location details',
    icon: MapPin,
  },
  {
    id: 3,
    title: 'Preferences',
    description: 'Currency & settings',
    icon: Settings,
  },
  {
    id: 4,
    title: 'Security',
    description: 'PIN & verification',
    icon: Shield,
  },
]

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  completedSteps
}: OnboardingProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-center">
          <h3 className="font-semibold text-lg">
            {stepConfig[currentStep - 1]?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {stepConfig[currentStep - 1]?.description}
          </p>
        </div>
      </div>

      {/* Desktop Step Indicators */}
      <div className="hidden md:flex justify-between items-center relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-muted z-0">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step Items */}
        {stepConfig.map((step, index) => {
          const isCompleted = completedSteps[index]
          const isCurrent = currentStep === step.id
          const isPast = currentStep > step.id
          const IconComponent = step.icon

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center z-10  px-4",
                "transition-all duration-300"
              )}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2",
                  "transition-all duration-300 shadow-lg",
                  {
                    "bg-primary border-primary text-primary-foreground shadow-primary/25":
                      isCurrent || isPast || isCompleted,
                    "bg-background border-muted-foreground/30 text-muted-foreground":
                      !isCurrent && !isPast && !isCompleted,
                    "scale-110": isCurrent,
                  }
                )}
              >
                {isPast || isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <IconComponent className="w-6 h-6" />
                )}
              </div>

              {/* Step Info */}
              <div className="text-center max-w-[120px]">
                <h3
                  className={cn(
                    "font-semibold text-sm mb-1 transition-colors",
                    {
                      "text-primary": isCurrent || isPast || isCompleted,
                      "text-muted-foreground": !isCurrent && !isPast && !isCompleted,
                    }
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "text-xs transition-colors",
                    {
                      "text-muted-foreground": isCurrent || isPast || isCompleted,
                      "text-muted-foreground/60": !isCurrent && !isPast && !isCompleted,
                    }
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Step Counter */}
      <div className="hidden md:flex justify-center mt-6">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                {
                  "bg-primary": index < currentStep,
                  "bg-muted": index >= currentStep,
                }
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
