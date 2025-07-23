import { useState, useEffect, useCallback } from 'react'
import { fetchCountries, fetchTimezones, fetchCurrencies, getUserCountry, type Country, type Timezone, type Currency } from '@/lib/services/geoApi'

interface GeoDataState {
  countries: Country[]
  timezones: Timezone[]
  currencies: Currency[]
  userCountry: Country | null
  loading: {
    countries: boolean
    timezones: boolean
    currencies: boolean
    userCountry: boolean
  }
  error: {
    countries: string | null
    timezones: string | null
    currencies: string | null
    userCountry: string | null
  }
}

export function useGeoData() {
  const [state, setState] = useState<GeoDataState>({
    countries: [],
    timezones: [],
    currencies: [],
    userCountry: null,
    loading: {
      countries: false,
      timezones: false,
      currencies: false,
      userCountry: false
    },
    error: {
      countries: null,
      timezones: null,
      currencies: null,
      userCountry: null
    }
  })

  // Fetch countries
  const fetchCountriesData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, countries: true },
      error: { ...prev.error, countries: null }
    }))

    try {
      const countries = await fetchCountries()
      setState(prev => ({
        ...prev,
        countries,
        loading: { ...prev.loading, countries: false }
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, countries: false },
        error: { ...prev.error, countries: error instanceof Error ? error.message : 'Failed to fetch countries' }
      }))
    }
  }, [])

  // Fetch timezones
  const fetchTimezonesData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, timezones: true },
      error: { ...prev.error, timezones: null }
    }))

    try {
      const timezones = await fetchTimezones()
      setState(prev => ({
        ...prev,
        timezones,
        loading: { ...prev.loading, timezones: false }
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, timezones: false },
        error: { ...prev.error, timezones: error instanceof Error ? error.message : 'Failed to fetch timezones' }
      }))
    }
  }, [])

  // Fetch currencies
  const fetchCurrenciesData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, currencies: true },
      error: { ...prev.error, currencies: null }
    }))

    try {
      const currencies = await fetchCurrencies()
      setState(prev => ({
        ...prev,
        currencies,
        loading: { ...prev.loading, currencies: false }
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, currencies: false },
        error: { ...prev.error, currencies: error instanceof Error ? error.message : 'Failed to fetch currencies' }
      }))
    }
  }, [])

  // Fetch user country
  const fetchUserCountryData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, userCountry: true },
      error: { ...prev.error, userCountry: null }
    }))

    try {
      const userCountry = await getUserCountry()
      setState(prev => ({
        ...prev,
        userCountry,
        loading: { ...prev.loading, userCountry: false }
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, userCountry: false },
        error: { ...prev.error, userCountry: error instanceof Error ? error.message : 'Failed to fetch user country' }
      }))
    }
  }, [])

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchCountriesData(),
      fetchTimezonesData(),
      fetchCurrenciesData(),
      fetchUserCountryData()
    ])
  }, [fetchCountriesData, fetchTimezonesData, fetchCurrenciesData, fetchUserCountryData])

  // Initialize data on mount
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Helper functions
  const getCountryByCode = useCallback((code: string): Country | undefined => {
    return state.countries.find(country => country.code === code)
  }, [state.countries])

  const getTimezoneByValue = useCallback((value: string): Timezone | undefined => {
    return state.timezones.find(timezone => timezone.value === value)
  }, [state.timezones])

  const getCurrencyByCode = useCallback((code: string): Currency | undefined => {
    return state.currencies.find(currency => currency.code === code)
  }, [state.currencies])

  const searchCountries = useCallback((query: string): Country[] => {
    if (!query.trim()) return state.countries
    return state.countries.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase()) ||
      country.code.toLowerCase().includes(query.toLowerCase())
    )
  }, [state.countries])

  const searchTimezones = useCallback((query: string): Timezone[] => {
    if (!query.trim()) return state.timezones
    return state.timezones.filter(timezone =>
      timezone.label.toLowerCase().includes(query.toLowerCase()) ||
      timezone.value.toLowerCase().includes(query.toLowerCase()) ||
      timezone.region.toLowerCase().includes(query.toLowerCase())
    )
  }, [state.timezones])

  const searchCurrencies = useCallback((query: string): Currency[] => {
    if (!query.trim()) return state.currencies
    return state.currencies.filter(currency =>
      currency.name.toLowerCase().includes(query.toLowerCase()) ||
      currency.code.toLowerCase().includes(query.toLowerCase()) ||
      currency.symbol.toLowerCase().includes(query.toLowerCase())
    )
  }, [state.currencies])

  return {
    // Data
    countries: state.countries,
    timezones: state.timezones,
    currencies: state.currencies,
    userCountry: state.userCountry,

    // Loading states
    loading: state.loading,
    isLoading: Object.values(state.loading).some(Boolean),

    // Error states
    error: state.error,
    hasError: Object.values(state.error).some(Boolean),

    // Actions
    fetchCountries: fetchCountriesData,
    fetchTimezones: fetchTimezonesData,
    fetchCurrencies: fetchCurrenciesData,
    fetchUserCountry: fetchUserCountryData,
    fetchAll: fetchAllData,

    // Helper functions
    getCountryByCode,
    getTimezoneByValue,
    getCurrencyByCode,
    searchCountries,
    searchTimezones,
    searchCurrencies
  }
}
