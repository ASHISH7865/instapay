import { z } from 'zod';

export const onboardingSchema = z.object({
    firstName: z.string({ required_error: 'First name is required'}).min(2, { message: 'First name must be at least 2 characters long' }),
    lastName: z.string({ required_error: 'Last name is required'}).min(2, { message: 'Last name must be at least 2 characters long' }),
    username : z.string({ required_error: 'Username is required'}).min(2, { message: 'Username must be at least 2 characters long' }),
    gender: z.enum(['male', 'female', 'other']), 

    phoneNumbers: z.string().min(10, { message: 'Phone number must be at least 10 characters long' }), 
    primaryEmailAddresses: z.string().email({message: 'Invalid email address'}),
    addresses: z.object({ 
      streetAddress: z.string().optional(),
      city: z.string().min(2, { message: 'City must be at least 2 characters long' }),
      stateOrProvince: z.string().min(2, { message: 'State or Province must be at least 2 characters long' }),
      postalCode: z.string().min(5, { message: 'Postal code must be at least 5 characters long' }),
      country: z.string().min(2, { message: 'Country must be at least 2 characters long' }),
    }),

    // if passwordType is pin, then value must be a 4 digit number
    walletSecurityPreferences: z.object({
      passwordType: z.enum(['PIN'], { errorMap:  (issue, ctx) => ({ message: 'Password Type requried' })}), 
      value: z.string().refine((val) => val.length === 4, { message: 'PIN must be 4 digits long' }),
    }),
      
  
    // Currency Preferences
    currencyPreferences: z.enum(['USD', 'EUR', 'GBP',"INR", 'Other'],{errorMap: (issue, ctx) => ({ message: 'Currency is required' })}),
  
    // Usage Preferences
    usagePreferences: z.enum(['Personal', 'Business', 'Testing', 'Other'], {errorMap: (issue, ctx) => ({ message: 'Usage Preferences is required' })}),
  });

  export type OnboardingFormValuesType = z.infer<typeof onboardingSchema>;