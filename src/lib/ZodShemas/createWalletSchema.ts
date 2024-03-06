import { z } from 'zod';

export const createWalletSchema = z.object({
    walletName: z.string({ required_error: 'Wallet name is required'}).min(2, { message: 'Wallet name must be at least 2 characters long' }),
    walletType: z.enum(['personal', 'business', 'testing', 'other'], {errorMap: (issue, ctx) => ({ message: 'Wallet type is required' })}),
    walletCurrency: z.enum(['USD', 'EUR', 'GBP',"INR", 'Other'],{errorMap: (issue, ctx) => ({ message: 'Currency is required' })}),
    governmentId: z.string({ required_error: 'Government ID is required'}).min(2, { message: 'Government ID must be at least 2 characters long' }),
    // walletpin should be 6 digits long and should be a number 
    walletPin: z.string().refine((data) => data.length === 6 && !isNaN(Number(data)), { message: 'Wallet pin must be 6 digits long and should be a number' }),
  });

  export type CreateWalletType = z.infer<typeof createWalletSchema>;