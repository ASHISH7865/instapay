'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'

export function useLogout() {
  const { signOut } = useClerk()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true)

      // Immediately redirect to landing page for better UX
      router.push('/')

      // Sign out in the background
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
      // Even if there's an error, we've already redirected
    } finally {
      setIsLoggingOut(false)
    }
  }, [signOut, router])

  return {
    logout,
    isLoggingOut
  }
}
