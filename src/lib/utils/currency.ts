// Currency formatting utilities
export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  symbolNative: string
  decimalDigits: number
  rounding: number
  namePlural: string
}

// Common currencies with their formatting information
export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolNative: '$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'US dollars'
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolNative: '€',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'euros'
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    symbolNative: '£',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'British pounds'
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    symbolNative: '₹',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Indian rupees'
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    symbolNative: '$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Canadian dollars'
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    symbolNative: '$',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Australian dollars'
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    symbolNative: '¥',
    decimalDigits: 0,
    rounding: 0,
    namePlural: 'Japanese yen'
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    symbolNative: 'CHF',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Swiss francs'
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    symbolNative: '¥',
    decimalDigits: 2,
    rounding: 0,
    namePlural: 'Chinese yuan'
  }
}

/**
 * Format currency amount based on currency code
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = 'USD',
  locale: string = 'en-US'
): string {
  const currency = CURRENCIES[currencyCode.toUpperCase()]

  if (!currency) {
    // Fallback to USD if currency not found
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalDigits,
      maximumFractionDigits: currency.decimalDigits
    }).format(amount)
  } catch (error) {
    // Fallback formatting
    return `${currency.symbol}${amount.toFixed(currency.decimalDigits)}`
  }
}

/**
 * Format currency amount with custom options
 */
export function formatCurrencyCustom(
  amount: number,
  currencyCode: string = 'USD',
  options: {
    showSymbol?: boolean
    showCode?: boolean
    locale?: string
    compact?: boolean
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    locale = 'en-US',
    compact = false
  } = options

  const currency = CURRENCIES[currencyCode.toUpperCase()]

  if (!currency) {
    return `${amount.toFixed(2)}`
  }

  try {
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimalDigits,
      maximumFractionDigits: currency.decimalDigits
    }

    if (compact) {
      formatOptions.notation = 'compact'
    }

    let formatted = new Intl.NumberFormat(locale, formatOptions).format(amount)

    if (!showSymbol) {
      formatted = formatted.replace(currency.symbol, '').trim()
    }

    if (showCode) {
      formatted += ` ${currency.code}`
    }

    return formatted
  } catch (error) {
    // Fallback formatting
    let result = `${amount.toFixed(currency.decimalDigits)}`
    if (showSymbol) {
      result = `${currency.symbol}${result}`
    }
    if (showCode) {
      result += ` ${currency.code}`
    }
    return result
  }
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const currency = CURRENCIES[currencyCode.toUpperCase()]
  return currency?.symbol || '$'
}

/**
 * Get currency info for a given currency code
 */
export function getCurrencyInfo(currencyCode: string): CurrencyInfo | null {
  return CURRENCIES[currencyCode.toUpperCase()] || null
}

/**
 * Get all available currencies
 */
export function getAvailableCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCIES)
}

/**
 * Parse currency string back to number
 */
export function parseCurrency(
  value: string,
  currencyCode: string = 'USD'
): number {
  const currency = CURRENCIES[currencyCode.toUpperCase()]
  if (!currency) return 0

  // Remove currency symbol and other non-numeric characters except decimal
  const cleaned = value.replace(/[^\d.,]/g, '')

  // Handle different decimal separators
  const normalized = cleaned.replace(',', '.')

  return parseFloat(normalized) || 0
}
