import { z } from 'zod'

// show error perfectly and keep in mind every edge case
// validation for amount should be a number and greater than 0 and less than 1000000 and walletId should be a string and greater than 0 and less than 1000000
export const sendMoneyToWalletSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, 'Amount should be greater than 0')
    .nonnegative('Amount should be greater than 0'),
  recieverEmail: z.string().email('Invalid email address'),
})

export type SendMoneyToWalletFormValuesType = z.infer<typeof sendMoneyToWalletSchema>
