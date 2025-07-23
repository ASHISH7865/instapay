'use client'

import { useState, useCallback } from 'react'
import { useLoading } from '@/components/shared/LoadingProvider'

export function usePageLoading() {
  const [isPageLoading, setIsPageLoading] = useState(false)
  const { showLoading, hideLoading } = useLoading()

  const showPageLoading = useCallback(
    (message?: string) => {
      setIsPageLoading(true)
      showLoading(message || 'Loading page...')
    },
    [showLoading],
  )

  const hidePageLoading = useCallback(() => {
    setIsPageLoading(false)
    hideLoading()
  }, [hideLoading])

  return {
    isPageLoading,
    showPageLoading,
    hidePageLoading,
  }
}

// Hook for showing loading during async operations
export function useAsyncLoading() {
  const { showLoading, hideLoading } = useLoading()

  const withLoading = useCallback(
    async <T>(asyncFn: () => Promise<T>, message?: string): Promise<T> => {
      try {
        showLoading(message || 'Processing...')
        const result = await asyncFn()
        return result
      } finally {
        hideLoading()
      }
    },
    [showLoading, hideLoading],
  )

  return {
    withLoading,
    showLoading,
    hideLoading,
  }
}
