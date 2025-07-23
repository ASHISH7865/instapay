'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useGeoData } from '@/hooks/useGeoData'
import { formatCurrencyCustom, getCurrencyInfo } from '@/lib/utils/currency'

interface UserPreferences {
  currency: string
  timezone: string
  country: string
  language: string
  dateFormat: string
  numberFormat: string
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  updatePreferences: (updates: Partial<UserPreferences>) => void
  formatAmount: (amount: number, options?: { showSymbol?: boolean; showCode?: boolean; compact?: boolean }) => string
  getCurrentCurrency: () => { code: string; symbol: string; name: string } | null
  isLoading: boolean
}

const defaultPreferences: UserPreferences = {
  currency: 'USD',
  timezone: 'UTC',
  country: 'US',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  numberFormat: 'US'
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

interface UserPreferencesProviderProps {
  children: ReactNode
  initialPreferences?: Partial<UserPreferences>
}

export function UserPreferencesProvider({
  children,
  initialPreferences = {}
}: UserPreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...defaultPreferences,
    ...initialPreferences
  })

  const { userCountry, isLoading: geoDataLoading } = useGeoData()

  // Auto-detect user country and set preferences
  useEffect(() => {
    if (userCountry && preferences.country === defaultPreferences.country) {
      setPreferences(prev => ({
        ...prev,
        country: userCountry.code,
        currency: userCountry.currency.code,
        timezone: userCountry.timezone
      }))
    }
  }, [userCountry, preferences.country])

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('instapay-user-preferences')
      if (saved) {
        const parsed = JSON.parse(saved)
        setPreferences(prev => ({
          ...prev,
          ...parsed
        }))
      }
    } catch (error) {
      console.error('Error loading user preferences:', error)
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('instapay-user-preferences', JSON.stringify(preferences))
    } catch (error) {
      console.error('Error saving user preferences:', error)
    }
  }, [preferences])

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }))
  }

      const formatAmount = (
    amount: number,
    options: { showSymbol?: boolean; showCode?: boolean; compact?: boolean } = {}
  ) => {
    return formatCurrencyCustom(amount, preferences.currency, options)
  }

  const getCurrentCurrency = () => {
    const currencyInfo = getCurrencyInfo(preferences.currency)
    if (!currencyInfo) return null

    return {
      code: currencyInfo.code,
      symbol: currencyInfo.symbol,
      name: currencyInfo.name
    }
  }

  const value: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    formatAmount,
    getCurrentCurrency,
    isLoading: geoDataLoading
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}
