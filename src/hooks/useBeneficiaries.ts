import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface Beneficiary {
  id: string
  name: string
  email?: string
  phoneNumber?: string
  relationship: 'family' | 'friend' | 'business' | 'other'
  nickname?: string
  isActive: boolean
  isFavorite: boolean
  lastUsedAt?: string
  totalTransactions: number
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface CreateBeneficiaryData {
  name: string
  email?: string
  phoneNumber?: string
  relationship: 'family' | 'friend' | 'business' | 'other'
  nickname?: string
  isFavorite?: boolean
}

export interface UpdateBeneficiaryData extends Partial<CreateBeneficiaryData> {
  isActive?: boolean
}

export interface BeneficiariesFilters {
  search?: string
  category?: string
  favoritesOnly?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BeneficiariesResponse {
  beneficiaries: Beneficiary[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function useBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<BeneficiariesResponse['pagination'] | null>(null)
  const [filters, setFilters] = useState<BeneficiariesFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const { toast } = useToast()

  // Fetch beneficiaries with filters
  const fetchBeneficiaries = useCallback(async (newFilters?: Partial<BeneficiariesFilters>) => {
    try {
      setLoading(true)
      setError(null)

      const updatedFilters = { ...filters, ...newFilters }
      setFilters(updatedFilters)

      // Build query string
      const params = new URLSearchParams()
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/beneficiaries?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch beneficiaries')
      }

      const data: BeneficiariesResponse = await response.json()
      setBeneficiaries(data.beneficiaries)
      setPagination(data.pagination)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch beneficiaries'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [filters, toast])

  // Create new beneficiary
  const createBeneficiary = useCallback(async (data: CreateBeneficiaryData): Promise<Beneficiary | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/beneficiaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create beneficiary')
      }

      const newBeneficiary: Beneficiary = await response.json()

      // Add to current list
      setBeneficiaries(prev => [newBeneficiary, ...prev])

      toast({
        title: 'Success',
        description: 'Beneficiary created successfully!',
      })

      return newBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create beneficiary'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Update beneficiary
  const updateBeneficiary = useCallback(async (id: string, data: UpdateBeneficiaryData): Promise<Beneficiary | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/beneficiaries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update beneficiary')
      }

      const updatedBeneficiary: Beneficiary = await response.json()

      // Update in current list
      setBeneficiaries(prev =>
        prev.map(ben => ben.id === id ? updatedBeneficiary : ben)
      )

      toast({
        title: 'Success',
        description: 'Beneficiary updated successfully!',
      })

      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update beneficiary'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Delete beneficiary
  const deleteBeneficiary = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/beneficiaries/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete beneficiary')
      }

      // Remove from current list
      setBeneficiaries(prev => prev.filter(ben => ben.id !== id))

      toast({
        title: 'Success',
        description: 'Beneficiary deleted successfully!',
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete beneficiary'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Toggle favorite status
  const toggleFavorite = useCallback(async (id: string): Promise<boolean> => {
    const beneficiary = beneficiaries.find(ben => ben.id === id)
    if (!beneficiary) return false

    const success = await updateBeneficiary(id, { isFavorite: !beneficiary.isFavorite })
    return success !== null
  }, [beneficiaries, updateBeneficiary])

  // Get single beneficiary
  const getBeneficiary = useCallback(async (id: string): Promise<Beneficiary | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/beneficiaries/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch beneficiary')
      }

      const beneficiary: Beneficiary = await response.json()
      return beneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch beneficiary'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Search beneficiaries
  const searchBeneficiaries = useCallback((search: string) => {
    fetchBeneficiaries({ search, page: 1 })
  }, [fetchBeneficiaries])

  // Filter by category
  const filterByCategory = useCallback((category: string) => {
    fetchBeneficiaries({ category, page: 1 })
  }, [fetchBeneficiaries])

  // Toggle favorites filter
  const toggleFavoritesFilter = useCallback((favoritesOnly: boolean) => {
    fetchBeneficiaries({ favoritesOnly, page: 1 })
  }, [fetchBeneficiaries])

  // Change page
  const changePage = useCallback((page: number) => {
    fetchBeneficiaries({ page })
  }, [fetchBeneficiaries])

  // Change sort
  const changeSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    fetchBeneficiaries({ sortBy, sortOrder, page: 1 })
  }, [fetchBeneficiaries])

  // Refresh beneficiaries
  const refresh = useCallback(() => {
    fetchBeneficiaries()
  }, [fetchBeneficiaries])

  // Initialize on mount
  useEffect(() => {
    fetchBeneficiaries()
  }, []) // Only run on mount

  return {
    // Data
    beneficiaries,
    pagination,
    filters,

    // State
    loading,
    error,

    // Actions
    fetchBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    getBeneficiary,
    toggleFavorite,

    // Filter actions
    searchBeneficiaries,
    filterByCategory,
    toggleFavoritesFilter,
    changePage,
    changeSort,
    refresh,

    // Utility
    setFilters
  }
}
