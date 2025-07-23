'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { getUserInfo } from '@/lib/actions/onbaording.action'
import Spinner from '@/components/shared/spinner'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import OnboardingForm from '@/components/forms/OnboardingForm'

const OnboardingPage = () => {
  const { userId, isLoaded } = useAuth()
  const [userExists, setUserExists] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && userId) {
      setLoading(true)
      getUserInfo(userId)
        .then((userInfo) => {
          if (userInfo) {
            // User already onboarded, redirect to dashboard
            setUserExists(true)
            router.push('/dashboard')
          } else {
            // User needs onboarding
            setUserExists(false)
          }
        })
        .catch((err) => {
          console.error('Error checking user info:', err)
          setUserExists(false) // Allow onboarding if there's an error
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (isLoaded && !userId) {
      // User not authenticated, redirect to sign in
      router.push('/sign-in')
    }
  }, [isLoaded, userId, router])

  // Show loading spinner while checking authentication and user status
  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  // User not authenticated
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
      </div>
    )
  }

  // User already onboarded
  if (userExists) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p className="text-muted-foreground">Taking you to your dashboard</p>
          <Spinner className="w-6 h-6 mx-auto mt-4" />
        </div>
      </div>
    )
  }

  // Show onboarding form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-4">
            Welcome to InstaPay
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let&apos;s set up your account in just a few simple steps. We&apos;ll get you ready to send, receive, and manage your money with ease.
          </p>
        </motion.div>

        {/* Onboarding Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OnboardingForm />
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </motion.div>
  )
}

export default OnboardingPage
