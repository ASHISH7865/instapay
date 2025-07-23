/**
 * InstaPay Brand Color Palette
 * Professional financial app color scheme designed for trust, security, and innovation
 */

export const instapayBrandColors = {
  // Primary Brand Colors
  primary: {
    50: 'hsl(180, 100%, 97%)',   // Very light teal
    100: 'hsl(180, 100%, 92%)',  // Light teal
    200: 'hsl(180, 100%, 84%)',  // Lighter teal
    300: 'hsl(180, 100%, 72%)',  // Light teal
    400: 'hsl(180, 100%, 58%)',  // Medium light teal
    500: 'hsl(180, 66%, 41%)',   // Primary brand teal
    600: 'hsl(180, 66%, 35%)',   // Darker teal
    700: 'hsl(180, 66%, 28%)',   // Dark teal
    800: 'hsl(180, 66%, 22%)',   // Very dark teal
    900: 'hsl(180, 66%, 16%)',   // Darkest teal
  },

  // Secondary Brand Colors
  secondary: {
    50: 'hsl(210, 100%, 97%)',   // Very light blue
    100: 'hsl(210, 100%, 92%)',  // Light blue
    200: 'hsl(210, 100%, 84%)',  // Lighter blue
    300: 'hsl(210, 100%, 72%)',  // Light blue
    400: 'hsl(210, 100%, 58%)',  // Medium light blue
    500: 'hsl(210, 66%, 41%)',   // Secondary brand blue
    600: 'hsl(210, 66%, 35%)',   // Darker blue
    700: 'hsl(210, 66%, 28%)',   // Dark blue
    800: 'hsl(210, 66%, 22%)',   // Very dark blue
    900: 'hsl(210, 66%, 16%)',   // Darkest blue
  },

  // Accent Colors
  accent: {
    success: {
      50: 'hsl(142, 100%, 97%)',
      100: 'hsl(142, 100%, 92%)',
      200: 'hsl(142, 100%, 84%)',
      300: 'hsl(142, 100%, 72%)',
      400: 'hsl(142, 100%, 58%)',
      500: 'hsl(142, 66%, 41%)',  // Success green
      600: 'hsl(142, 66%, 35%)',
      700: 'hsl(142, 66%, 28%)',
      800: 'hsl(142, 66%, 22%)',
      900: 'hsl(142, 66%, 16%)',
    },
    warning: {
      50: 'hsl(45, 100%, 97%)',
      100: 'hsl(45, 100%, 92%)',
      200: 'hsl(45, 100%, 84%)',
      300: 'hsl(45, 100%, 72%)',
      400: 'hsl(45, 100%, 58%)',
      500: 'hsl(45, 66%, 41%)',   // Warning amber
      600: 'hsl(45, 66%, 35%)',
      700: 'hsl(45, 66%, 28%)',
      800: 'hsl(45, 66%, 22%)',
      900: 'hsl(45, 66%, 16%)',
    },
    error: {
      50: 'hsl(0, 100%, 97%)',
      100: 'hsl(0, 100%, 92%)',
      200: 'hsl(0, 100%, 84%)',
      300: 'hsl(0, 100%, 72%)',
      400: 'hsl(0, 100%, 58%)',
      500: 'hsl(0, 84%, 60%)',    // Error red
      600: 'hsl(0, 84%, 50%)',
      700: 'hsl(0, 84%, 40%)',
      800: 'hsl(0, 84%, 30%)',
      900: 'hsl(0, 84%, 20%)',
    },
    info: {
      50: 'hsl(220, 100%, 97%)',
      100: 'hsl(220, 100%, 92%)',
      200: 'hsl(220, 100%, 84%)',
      300: 'hsl(220, 100%, 72%)',
      400: 'hsl(220, 100%, 58%)',
      500: 'hsl(220, 66%, 41%)',  // Info blue
      600: 'hsl(220, 66%, 35%)',
      700: 'hsl(220, 66%, 28%)',
      800: 'hsl(220, 66%, 22%)',
      900: 'hsl(220, 66%, 16%)',
    },
  },

  // Financial Status Colors
  financial: {
    positive: 'hsl(142, 66%, 41%)',    // Green for positive amounts
    negative: 'hsl(0, 84%, 60%)',      // Red for negative amounts
    neutral: 'hsl(180, 66%, 41%)',     // Teal for neutral amounts
    pending: 'hsl(45, 66%, 41%)',      // Amber for pending transactions
    completed: 'hsl(142, 66%, 41%)',   // Green for completed transactions
    failed: 'hsl(0, 84%, 60%)',        // Red for failed transactions
  },

  // UI State Colors
  states: {
    hover: 'hsl(180, 66%, 35%)',       // Darker teal for hover
    active: 'hsl(180, 66%, 28%)',      // Even darker for active state
    disabled: 'hsl(0, 0%, 60%)',       // Gray for disabled state
    focus: 'hsl(180, 66%, 41%)',       // Primary teal for focus
    selected: 'hsl(180, 40%, 96%)',    // Light teal for selected state
  },

  // Background Colors
  backgrounds: {
    primary: 'hsl(0, 0%, 100%)',       // White background
    secondary: 'hsl(180, 40%, 96%)',   // Light teal background
    tertiary: 'hsl(0, 0%, 98%)',       // Very light gray background
    dark: 'hsl(240, 10%, 3.9%)',       // Dark background
    card: 'hsl(0, 0%, 100%)',          // Card background
    modal: 'hsl(0, 0%, 100%)',         // Modal background
  },

  // Text Colors
  text: {
    primary: 'hsl(240, 10%, 3.9%)',    // Primary text color
    secondary: 'hsl(240, 3.8%, 46.1%)', // Secondary text color
    muted: 'hsl(240, 3.8%, 46.1%)',    // Muted text color
    inverse: 'hsl(0, 0%, 98%)',        // Inverse text color (on dark backgrounds)
    link: 'hsl(180, 66%, 41%)',        // Link color
    success: 'hsl(142, 66%, 41%)',     // Success text color
    warning: 'hsl(45, 66%, 41%)',      // Warning text color
    error: 'hsl(0, 84%, 60%)',         // Error text color
  },

  // Border Colors
  borders: {
    primary: 'hsl(240, 5.9%, 90%)',    // Primary border color
    secondary: 'hsl(180, 40%, 90%)',   // Secondary border color
    focus: 'hsl(180, 66%, 41%)',       // Focus border color
    error: 'hsl(0, 84%, 60%)',         // Error border color
    success: 'hsl(142, 66%, 41%)',     // Success border color
  },

  // Shadow Colors
  shadows: {
    primary: 'hsla(180, 66%, 41%, 0.1)',   // Primary shadow with teal tint
    secondary: 'hsla(0, 0%, 0%, 0.1)',     // Secondary shadow
    focus: 'hsla(180, 66%, 41%, 0.2)',     // Focus shadow
  },
} as const

// CSS Custom Properties for easy use in components
export const instapayCSSVars = {
  '--instapay-primary': instapayBrandColors.primary[500],
  '--instapay-primary-light': instapayBrandColors.primary[100],
  '--instapay-primary-dark': instapayBrandColors.primary[700],
  '--instapay-secondary': instapayBrandColors.secondary[500],
  '--instapay-success': instapayBrandColors.accent.success[500],
  '--instapay-warning': instapayBrandColors.accent.warning[500],
  '--instapay-error': instapayBrandColors.accent.error[500],
  '--instapay-info': instapayBrandColors.accent.info[500],
  '--instapay-financial-positive': instapayBrandColors.financial.positive,
  '--instapay-financial-negative': instapayBrandColors.financial.negative,
  '--instapay-financial-neutral': instapayBrandColors.financial.neutral,
  '--instapay-financial-pending': instapayBrandColors.financial.pending,
  '--instapay-financial-completed': instapayBrandColors.financial.completed,
  '--instapay-financial-failed': instapayBrandColors.financial.failed,
} as const

// Type definitions for TypeScript
export type InstapayBrandColor = keyof typeof instapayBrandColors
export type InstapayPrimaryColor = keyof typeof instapayBrandColors.primary
export type InstapayAccentColor = keyof typeof instapayBrandColors.accent
export type InstapayFinancialColor = keyof typeof instapayBrandColors.financial
