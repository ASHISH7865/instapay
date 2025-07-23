'use client'

import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import {
  useGetUserProfileQuery,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useVerifyUserMutation,
  type CreateUserProfileData,
  type UpdateUserProfileData,
} from '@/lib/store/slices/userApi'

// Optimized hook for user profile
export function useUser() {
  const { userId } = useAuth()

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserProfileQuery(undefined, {
    skip: !userId,
  })

  return {
    user,
    isLoading,
    error,
    refetch,
    isLoaded: !isLoading,
  }
}

// Optimized hook for creating user profile
export function useCreateUser() {
  const [createUserProfile, { isLoading, error }] = useCreateUserProfileMutation()

  const createUser = async (data: CreateUserProfileData) => {
    try {
      const result = await createUserProfile(data).unwrap()
      toast.success('Profile created successfully')
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create profile'
      toast.error(message)
      throw err
    }
  }

  return {
    createUser,
    isLoading,
    error,
  }
}

// Optimized hook for updating user profile
export function useUpdateUser() {
  const [updateUserProfile, { isLoading, error }] = useUpdateUserProfileMutation()

  const updateUser = async (data: UpdateUserProfileData) => {
    try {
      const result = await updateUserProfile(data).unwrap()
      toast.success('Profile updated successfully')
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      toast.error(message)
      throw err
    }
  }

  return {
    updateUser,
    isLoading,
    error,
  }
}

// Optimized hook for user verification
export function useUserVerification() {
  const [verifyUser, { data, isLoading, error }] = useVerifyUserMutation()

  const verifyUserHandler = async (email: string) => {
    const result = await verifyUser(email).unwrap()
    return result
  }

  return {
    verifyUserHandler,
    data,
    isLoading,
    error,
  }
}
