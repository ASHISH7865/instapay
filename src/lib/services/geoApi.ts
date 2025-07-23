// Geo API services for countries, timezones, and currencies

export interface Country {
  name: string
  code: string
  flag: string
  phoneCode: string
  currency: {
    code: string
    name: string
    symbol: string
  }
  timezone: string
}

export interface Timezone {
  value: string
  label: string
  offset: string
  region: string
}

export interface Currency {
  code: string
  name: string
  symbol: string
  symbolNative: string
  decimalDigits: number
  rounding: number
  namePlural: string
}

// Cache for API responses
const cache = {
  countries: null as Country[] | null,
  timezones: null as Timezone[] | null,
  currencies: null as Currency[] | null,
  lastFetch: {
    countries: 0,
    timezones: 0,
    currencies: 0
  }
}

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Fetch countries from REST Countries API
 */
export async function fetchCountries(): Promise<Country[]> {
  const now = Date.now()

  // Return cached data if still valid
  if (cache.countries && (now - cache.lastFetch.countries) < CACHE_DURATION) {
    return cache.countries
  }

  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,cca3,flags,idd,currencies,timezones')

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`)
    }

    const data = await response.json()

        interface CountryApiResponse {
      name: { common: string }
      cca2: string
      flags: { svg?: string; png?: string }
      idd: { root: string; suffixes?: string[] }
      currencies: Record<string, { name: string; symbol?: string }>
      timezones?: string[]
    }

    const countries: Country[] = data
      .filter((country: CountryApiResponse) =>
        country.name?.common &&
        country.cca2 &&
        country.currencies &&
        Object.keys(country.currencies).length > 0
      )
      .map((country: CountryApiResponse) => {
        const currencyCode = Object.keys(country.currencies)[0]
        const currency = country.currencies[currencyCode]

        return {
          name: country.name.common,
          code: country.cca2,
          flag: country.flags?.svg || country.flags?.png || '',
          phoneCode: country.idd?.root + (country.idd?.suffixes?.[0] || ''),
          currency: {
            code: currencyCode,
            name: currency.name,
            symbol: currency.symbol || currencyCode
          },
          timezone: country.timezones?.[0] || 'UTC'
        }
      })
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name))

    // Cache the result
    cache.countries = countries
    cache.lastFetch.countries = now

    return countries
  } catch (error) {
    console.error('Error fetching countries:', error)

    // Return fallback data if API fails
    return getFallbackCountries()
  }
}

/**
 * Fetch timezones from TimezoneDB API (or use built-in list)
 */
export async function fetchTimezones(): Promise<Timezone[]> {
  const now = Date.now()

  // Return cached data if still valid
  if (cache.timezones && (now - cache.lastFetch.timezones) < CACHE_DURATION) {
    return cache.timezones
  }

  try {
    // Use a public timezone API or built-in list
    const timezones = getBuiltInTimezones()

    // Cache the result
    cache.timezones = timezones
    cache.lastFetch.timezones = now

    return timezones
  } catch (error) {
    console.error('Error fetching timezones:', error)
    return getBuiltInTimezones()
  }
}

/**
 * Fetch currencies from Exchange Rate API
 */
export async function fetchCurrencies(): Promise<Currency[]> {
  const now = Date.now()

  // Return cached data if still valid
  if (cache.currencies && (now - cache.lastFetch.currencies) < CACHE_DURATION) {
    return cache.currencies
  }

  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')

    if (!response.ok) {
      throw new Error(`Failed to fetch currencies: ${response.status}`)
    }

    const data = await response.json()

    const currencies: Currency[] = Object.keys(data.rates).map(code => ({
      code,
      name: getCurrencyName(code),
      symbol: getCurrencySymbol(code),
      symbolNative: getCurrencySymbol(code),
      decimalDigits: getCurrencyDecimalDigits(code),
      rounding: 0,
      namePlural: getCurrencyName(code) + 's'
    }))

    // Cache the result
    cache.currencies = currencies
    cache.lastFetch.currencies = now

    return currencies
  } catch (error) {
    console.error('Error fetching currencies:', error)

    // Return fallback data if API fails
    return getFallbackCurrencies()
  }
}

/**
 * Get user's location-based country
 */
export async function getUserCountry(): Promise<Country | null> {
  try {
    const response = await fetch('https://ipapi.co/json/')

    if (!response.ok) {
      throw new Error(`Failed to fetch user location: ${response.status}`)
    }

    const data = await response.json()
    const countries = await fetchCountries()

    return countries.find(country => country.code === data.country_code) || null
  } catch (error) {
    console.error('Error fetching user country:', error)
    return null
  }
}

// Helper functions

function getBuiltInTimezones(): Timezone[] {
  return [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00', region: 'Global' },
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00', region: 'North America' },
    { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-06:00', region: 'North America' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-07:00', region: 'North America' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00', region: 'North America' },
    { value: 'America/Toronto', label: 'Eastern Time (Canada)', offset: '-05:00', region: 'North America' },
    { value: 'America/Vancouver', label: 'Pacific Time (Canada)', offset: '-08:00', region: 'North America' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: '+00:00', region: 'Europe' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: '+01:00', region: 'Europe' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET)', offset: '+01:00', region: 'Europe' },
    { value: 'Europe/Rome', label: 'Central European Time (CET)', offset: '+01:00', region: 'Europe' },
    { value: 'Europe/Madrid', label: 'Central European Time (CET)', offset: '+01:00', region: 'Europe' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: '+09:00', region: 'Asia' },
    { value: 'Asia/Seoul', label: 'Korea Standard Time (KST)', offset: '+09:00', region: 'Asia' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)', offset: '+08:00', region: 'Asia' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: '+05:30', region: 'Asia' },
    { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: '+04:00', region: 'Asia' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: '+10:00', region: 'Oceania' },
    { value: 'Australia/Melbourne', label: 'Australian Eastern Time (AET)', offset: '+10:00', region: 'Oceania' },
    { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST)', offset: '+12:00', region: 'Oceania' }
  ]
}

function getFallbackCountries(): Country[] {
  return [
    { name: 'United States', code: 'US', flag: '🇺🇸', phoneCode: '+1', currency: { code: 'USD', name: 'US Dollar', symbol: '$' }, timezone: 'America/New_York' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', phoneCode: '+1', currency: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }, timezone: 'America/Toronto' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', phoneCode: '+44', currency: { code: 'GBP', name: 'British Pound', symbol: '£' }, timezone: 'Europe/London' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪', phoneCode: '+49', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, timezone: 'Europe/Berlin' },
    { name: 'France', code: 'FR', flag: '🇫🇷', phoneCode: '+33', currency: { code: 'EUR', name: 'Euro', symbol: '€' }, timezone: 'Europe/Paris' },
    { name: 'India', code: 'IN', flag: '🇮🇳', phoneCode: '+91', currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹' }, timezone: 'Asia/Kolkata' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺', phoneCode: '+61', currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }, timezone: 'Australia/Sydney' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵', phoneCode: '+81', currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }, timezone: 'Asia/Tokyo' },
    { name: 'China', code: 'CN', flag: '🇨🇳', phoneCode: '+86', currency: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }, timezone: 'Asia/Shanghai' },
    { name: 'Brazil', code: 'BR', flag: '🇧🇷', phoneCode: '+55', currency: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }, timezone: 'America/Sao_Paulo' }
  ]
}

function getFallbackCurrencies(): Currency[] {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$', symbolNative: '$', decimalDigits: 2, rounding: 0, namePlural: 'US dollars' },
    { code: 'EUR', name: 'Euro', symbol: '€', symbolNative: '€', decimalDigits: 2, rounding: 0, namePlural: 'euros' },
    { code: 'GBP', name: 'British Pound', symbol: '£', symbolNative: '£', decimalDigits: 2, rounding: 0, namePlural: 'British pounds' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolNative: '₹', decimalDigits: 2, rounding: 0, namePlural: 'Indian rupees' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', symbolNative: '$', decimalDigits: 2, rounding: 0, namePlural: 'Canadian dollars' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', symbolNative: '$', decimalDigits: 2, rounding: 0, namePlural: 'Australian dollars' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolNative: '¥', decimalDigits: 0, rounding: 0, namePlural: 'Japanese yen' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', symbolNative: 'CHF', decimalDigits: 2, rounding: 0, namePlural: 'Swiss francs' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', symbolNative: '¥', decimalDigits: 2, rounding: 0, namePlural: 'Chinese yuan' }
  ]
}

function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    INR: 'Indian Rupee',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    JPY: 'Japanese Yen',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan'
  }
  return names[code] || code
}

function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CHF: 'CHF',
    CNY: '¥'
  }
  return symbols[code] || code
}

function getCurrencyDecimalDigits(code: string): number {
  const digits: Record<string, number> = {
    JPY: 0,
    USD: 2,
    EUR: 2,
    GBP: 2,
    INR: 2,
    CAD: 2,
    AUD: 2,
    CHF: 2,
    CNY: 2
  }
  return digits[code] || 2
}
