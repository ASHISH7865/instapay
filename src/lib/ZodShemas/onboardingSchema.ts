import { z } from 'zod'

export const personalInfoSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(50, { message: 'First name must not exceed 50 characters' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(50, { message: 'Last name must not exceed 50 characters' }),
  displayName: z
    .string()
    .min(2, { message: 'Display name must be at least 2 characters long' })
    .max(50, { message: 'Display name must not exceed 50 characters' })
    .optional(),
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username must not exceed 30 characters' })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, hyphens, and underscores' }),
  dateOfBirth: z
    .date({ required_error: 'Date of birth is required' })
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear()
      return age >= 18
    }, { message: 'You must be at least 18 years old' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], {
    required_error: 'Please select your gender'
  }),
  phoneNumber: z
    .string({ required_error: 'Phone number is required' })
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must not exceed 15 digits' })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' }),
})

export const addressSchema = z.object({
  street: z
    .string({ required_error: 'Street address is required' })
    .min(5, { message: 'Street address must be at least 5 characters long' }),
  city: z
    .string({ required_error: 'City is required' })
    .min(2, { message: 'City must be at least 2 characters long' }),
  state: z
    .string({ required_error: 'State/Province is required' })
    .min(2, { message: 'State/Province must be at least 2 characters long' }),
  country: z
    .string({ required_error: 'Country is required' })
    .min(2, { message: 'Country must be at least 2 characters long' }),
  postalCode: z
    .string({ required_error: 'Postal code is required' })
    .min(3, { message: 'Postal code must be at least 3 characters long' })
    .max(10, { message: 'Postal code must not exceed 10 characters' }),
})

export const preferencesSchema = z.object({
  language: z
    .string()
    .default('en'),
  timezone: z
    .string()
    .default('UTC'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY'], {
    required_error: 'Please select your preferred currency'
  }),
  marketingEmails: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
  transactionNotifications: z.boolean().default(true),
})

export const securitySchema = z.object({
  walletPin: z
    .string({ required_error: 'Wallet PIN is required' })
    .length(6, { message: 'PIN must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'PIN must contain only numbers' }),
  confirmPin: z
    .string({ required_error: 'Please confirm your PIN' }),
  twoFactorEnabled: z.boolean().default(true),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, { message: 'You must agree to the terms and conditions' }),
  agreeToPrivacy: z
    .boolean()
    .refine((val) => val === true, { message: 'You must agree to the privacy policy' }),
}).refine((data) => data.walletPin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
})

// Complete onboarding schema
export const onboardingSchema = z.object({
  personalInfo: personalInfoSchema,
  address: addressSchema,
  preferences: preferencesSchema,
  security: securitySchema,
})

// Individual step schemas for validation
export type PersonalInfoType = z.infer<typeof personalInfoSchema>
export type AddressType = z.infer<typeof addressSchema>
export type PreferencesType = z.infer<typeof preferencesSchema>
export type SecurityType = z.infer<typeof securitySchema>
export type OnboardingFormValuesType = z.infer<typeof onboardingSchema>

// KYC verification schema (for future use)
export const kycVerificationSchema = z.object({
  documentType: z.enum(['passport', 'drivers_license', 'national_id'], {
    required_error: 'Please select a document type'
  }),
  documentNumber: z
    .string({ required_error: 'Document number is required' })
    .min(5, { message: 'Document number must be at least 5 characters' }),
  expiryDate: z
    .date({ required_error: 'Document expiry date is required' })
    .refine((date) => date > new Date(), { message: 'Document must not be expired' }),
  frontImage: z
    .string({ required_error: 'Front image of document is required' })
    .url({ message: 'Please provide a valid image URL' }),
  backImage: z
    .string()
    .url({ message: 'Please provide a valid image URL' })
    .optional(),
  selfieImage: z
    .string({ required_error: 'Selfie image is required' })
    .url({ message: 'Please provide a valid image URL' }),
})

export type KYCVerificationType = z.infer<typeof kycVerificationSchema>

// Default values for forms
export const defaultPersonalInfo: Partial<PersonalInfoType> = {
  firstName: '',
  lastName: '',
  displayName: '',
  username: '',
  gender: undefined,
  phoneNumber: '',
}

export const defaultAddress: Partial<AddressType> = {
  street: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
}

export const defaultPreferences: PreferencesType = {
  language: 'en',
  timezone: 'UTC',
  currency: 'USD',
  marketingEmails: true,
  securityAlerts: true,
  transactionNotifications: true,
}

export const defaultSecurity: Partial<SecurityType> = {
  walletPin: '',
  confirmPin: '',
  twoFactorEnabled: true,
  agreeToTerms: false,
  agreeToPrivacy: false,
}
