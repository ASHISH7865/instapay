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


export const months = [
  { name: 'January', short: 'Jan', value: 0 },
  { name: 'February', short: 'Feb', value: 1 },
  { name: 'March', short: 'Mar', value: 2 },
  { name: 'April', short: 'Apr', value: 3 },
  { name: 'May', short: 'May', value: 4 },
  { name: 'June', short: 'Jun', value: 5 },
  { name: 'July', short: 'Jul', value: 6 },
  { name: 'August', short: 'Aug', value: 7 },
  { name: 'September', short: 'Sep', value: 8 },
  { name: 'October', short: 'Oct', value: 9 },
  { name: 'November', short: 'Nov', value: 10 },
  { name: 'December', short: 'Dec', value: 11 },
]