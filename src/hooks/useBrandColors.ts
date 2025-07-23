import { instapayBrandColors } from '@/lib/themes/instapay-brand-colors'

/**
 * Custom hook for accessing InstaPay brand colors
 * Provides easy access to all brand colors and utilities
 */
export function useBrandColors() {
  return {
    // All brand colors
    colors: instapayBrandColors,

    // Primary brand colors
    primary: instapayBrandColors.primary,

    // Secondary brand colors
    secondary: instapayBrandColors.secondary,

    // Accent colors
    accent: instapayBrandColors.accent,

    // Financial status colors
    financial: instapayBrandColors.financial,

    // UI state colors
    states: instapayBrandColors.states,

    // Background colors
    backgrounds: instapayBrandColors.backgrounds,

    // Text colors
    text: instapayBrandColors.text,

    // Border colors
    borders: instapayBrandColors.borders,

    // Shadow colors
    shadows: instapayBrandColors.shadows,

        // Utility functions
    getColor: (path: string) => {
      const keys = path.split('.')
      let value: unknown = instapayBrandColors

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = (value as Record<string, unknown>)[key]
        } else {
          return undefined
        }
      }

      return value
    },

    // Get financial color based on status
    getFinancialColor: (status: 'positive' | 'negative' | 'neutral' | 'pending' | 'completed' | 'failed') => {
      return instapayBrandColors.financial[status]
    },

        // Get semantic color based on type
    getSemanticColor: (type: 'success' | 'warning' | 'error' | 'info', shade: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' = '500') => {
      return instapayBrandColors.accent[type][shade]
    },

    // Get primary color shade
    getPrimaryColor: (shade: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' = '500') => {
      return instapayBrandColors.primary[shade]
    },

    // Get secondary color shade
    getSecondaryColor: (shade: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' = '500') => {
      return instapayBrandColors.secondary[shade]
    },
  }
}
