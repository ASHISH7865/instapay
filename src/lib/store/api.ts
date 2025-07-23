import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base query with error handling
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Wallet',
    'Transaction',
    'Beneficiary',
    'Notification',
    'Dashboard',
    'Analytics',
    'SendMoney',
  ],
  endpoints: () => ({}),
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnFocus: false, // Disable refetch on focus
})

// Export hooks for use in components
export const {
  util: { getRunningQueriesThunk },
} = api
