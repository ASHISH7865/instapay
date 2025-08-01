export const themes = [
  {
    name: 'instapay',
    label: 'InstaPay Brand',
    cssVars: {
      light: {
        primary: '180 66% 41%', // Professional teal - trust, security, innovation
        'primary-foreground': '0 0% 98%',
        secondary: '180 40% 96%', // Light teal background
        'secondary-foreground': '180 66% 25%', // Dark teal text
        destructive: '0 84% 60%', // Error red
        'destructive-foreground': '0 0% 98%',
        ring: '180 66% 41%',
      },
      dark: {
        primary: '180 66% 41%', // Same teal for consistency
        'primary-foreground': '0 0% 98%',
        secondary: '180 40% 15%', // Dark teal background
        'secondary-foreground': '180 40% 90%', // Light teal text
        destructive: '0 84% 60%', // Error red
        'destructive-foreground': '0 0% 98%',
        ring: '180 66% 41%',
      },
    },
  },
] as const

export const grayColors = [
  {
    name: 'zinc',
    label: 'Default',
    activeColor: {
      light: '240 5.9% 10%',
      dark: '240 5.2% 33.9%',
    },
    cssVars: {
      light: {
        background: '0 0% 100%',
        foreground: '240 10% 3.9%',
        card: '0 0% 100%',
        'card-foreground': '240 10% 3.9%',
        popover: '0 0% 100%',
        'popover-foreground': '240 10% 3.9%',
        muted: '240 4.8% 95.9%',
        'muted-foreground': '240 3.8% 46.1%',
        accent: '240 4.8% 95.9%',
        'accent-foreground': '240 5.9% 10%',
        border: '240 5.9% 90%',
        input: '240 5.9% 90%',
      },
      dark: {
        background: '240 10% 3.9%',
        foreground: '0 0% 98%',
        card: '240 10% 3.9%',
        'card-foreground': '0 0% 98%',
        popover: '240 10% 3.9%',
        'popover-foreground': '0 0% 98%',
        muted: '240 3.7% 15.9%',
        'muted-foreground': '240 5% 64.9%',
        accent: '240 3.7% 15.9%',
        'accent-foreground': '0 0% 98%',
        border: '240 3.7% 15.9%',
        input: '240 3.7% 15.9%',
      },
    },
  },
] as const

export type Theme = (typeof themes)[number]
export type ThemeColor = (typeof themes)[number]['name']
export type Gray = (typeof grayColors)[number]

export type GrayColor = (typeof grayColors)[number]['name']
