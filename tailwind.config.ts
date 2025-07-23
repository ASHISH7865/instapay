import type { Config } from 'tailwindcss'
import svgToDataUri from 'mini-svg-data-uri'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // InstaPay Brand Colors
        instapay: {
          50: 'hsl(180, 100%, 97%)',
          100: 'hsl(180, 100%, 92%)',
          200: 'hsl(180, 100%, 84%)',
          300: 'hsl(180, 100%, 72%)',
          400: 'hsl(180, 100%, 58%)',
          500: 'hsl(180, 66%, 41%)',
          600: 'hsl(180, 66%, 35%)',
          700: 'hsl(180, 66%, 28%)',
          800: 'hsl(180, 66%, 22%)',
          900: 'hsl(180, 66%, 16%)',
        },
        // Financial Status Colors
        financial: {
          positive: 'hsl(142, 66%, 41%)',
          negative: 'hsl(0, 84%, 60%)',
          neutral: 'hsl(180, 66%, 41%)',
          pending: 'hsl(45, 66%, 41%)',
          completed: 'hsl(142, 66%, 41%)',
          failed: 'hsl(0, 84%, 60%)',
        },
        // Semantic Colors
        success: {
          50: 'hsl(142, 100%, 97%)',
          100: 'hsl(142, 100%, 92%)',
          200: 'hsl(142, 100%, 84%)',
          300: 'hsl(142, 100%, 72%)',
          400: 'hsl(142, 100%, 58%)',
          500: 'hsl(142, 66%, 41%)',
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
          500: 'hsl(45, 66%, 41%)',
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
          500: 'hsl(0, 84%, 60%)',
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
          500: 'hsl(220, 66%, 41%)',
          600: 'hsl(220, 66%, 35%)',
          700: 'hsl(220, 66%, 28%)',
          800: 'hsl(220, 66%, 22%)',
          900: 'hsl(220, 66%, 16%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ matchUtilities, theme }: { matchUtilities: (utilities: Record<string, (value: string) => Record<string, string>>, options: { values: Record<string, string>; type: string }) => void; theme: (path: string) => Record<string, string> }) {
      matchUtilities(
        {
          'bg-grid': (value: string) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-grid-small': (value: string) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-dot': (value: string) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        { values: theme('colors'), type: 'color' },
      )
    },
  ],
} satisfies Config

export default config
