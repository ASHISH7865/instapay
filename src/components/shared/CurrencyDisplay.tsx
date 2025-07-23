'use client'

import { useUserPreferences } from '@/contexts/UserPreferencesContext'

interface CurrencyDisplayProps {
  amount: number
  currency?: string
  showSymbol?: boolean
  showCode?: boolean
  compact?: boolean
  className?: string
}

export function CurrencyDisplay({
  amount,
  showSymbol = true,
  showCode = false,
  compact = false,
  className = ''
}: CurrencyDisplayProps) {
  const { formatAmount } = useUserPreferences()

  const formattedAmount = formatAmount(amount, {
    showSymbol,
    showCode,
    compact
  })

  return (
    <span className={className}>
      {formattedAmount}
    </span>
  )
}

export default CurrencyDisplay
