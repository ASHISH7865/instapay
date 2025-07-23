import { api } from '../api'

// Types
export interface UserProfile {
  id: string
  clerkId: string
  email: string
  username: string
  firstName: string
  lastName: string
  displayName?: string
  avatar?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  isActive: boolean
  isVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  kycStatus: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  language: string
  timezone: string
  createdAt: string
  updatedAt: string
  address?: {
    id: string
    street: string
    city: string
    state: string
    country: string
    postalCode: string
    latitude?: number
    longitude?: number
  }
  wallets?: Array<{
    id: string
    name: string
    type: string
    currency: string
    balance: number
    availableBalance: number
    status: string
    isDefault: boolean
  }>
}

export interface CreateUserProfileData {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  address?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

export interface UpdateUserProfileData {
  firstName?: string
  lastName?: string
  displayName?: string
  phoneNumber?: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  address?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

// User API slice
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/api/users',
      providesTags: ['User'],
      keepUnusedDataFor: 300, // 5 minutes
    }),

    // Create user profile
    createUserProfile: builder.mutation<UserProfile, CreateUserProfileData>({
      query: (data) => ({
        url: '/api/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<UserProfile, UpdateUserProfileData>({
      query: (data) => ({
        url: '/api/users',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Verify user email
    verifyUser: builder.mutation<
      {
        data: {
            exists?: boolean
            user?: {
              displayName?: string
              email: string
            }
        }
      },
      string
    >({
      query: (email) => ({
        url: `/api/users/verify`,
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

// Export hooks
export const {
  useGetUserProfileQuery,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useVerifyUserMutation,
} = userApi
