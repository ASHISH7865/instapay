import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// create a currency array which have their symbol and name and value of money compare to indian rupee
export const currencies = [
  { symbol: '₹', name: 'Indian Rupee', value: 1, code: 'INR' },
  { symbol: '$', name: 'US Dollar', value: 74.23, code: 'USD' },
  { symbol: '€', name: 'Euro', value: 88.23, code: 'EUR' },
  { symbol: '£', name: 'British Pound', value: 102.45, code: 'GBP' },
  { symbol: '¥', name: 'Japanese Yen', value: 0.67, code: 'JPY' },
]
