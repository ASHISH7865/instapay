'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLoading } from '@/components/shared/LoadingProvider'

export function useNavigationLoading() {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { showLoading, hideLoading } = useLoading()
  const previousPath = useRef(pathname)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startNavigation = useCallback(
    (message?: string) => {
      setIsNavigating(true)
      showLoading(message || 'Navigating...')
    },
    [showLoading],
  )

  const stopNavigation = useCallback(() => {
    setIsNavigating(false)
    hideLoading()
  }, [hideLoading])

  useEffect(() => {
    // Only trigger on actual path changes, not initial load
    if (previousPath.current && previousPath.current !== pathname) {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }

      // Show navigation loading
      startNavigation('Loading page...')

      // Set a minimum loading time to prevent flickering
      loadingTimeoutRef.current = setTimeout(() => {
        stopNavigation()
      }, 200)

      // Update previous path
      previousPath.current = pathname
    } else {
      // Update previous path on initial load
      previousPath.current = pathname
    }

    // Cleanup function
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [pathname, searchParams, startNavigation, stopNavigation])

  return {
    isNavigating,
    startNavigation,
    stopNavigation,
  }
}
