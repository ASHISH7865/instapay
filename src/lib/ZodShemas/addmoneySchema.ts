import { z } from 'zod';

export const addMoneySchema = z.object({
  amount: z.coerce
    .number()
    .min(1, 'Amount should be greater than 0')
    .max(100000, 'Amount should be less than 100000')
    .nonnegative('Amount should be greater than 0'),
});

export type AddMoneyType = z.infer<typeof addMoneySchema>;
