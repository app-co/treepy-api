import { z } from 'zod';

export const schemaCard = z.object({
  userId: z.string(),
  amount: z.number(),
  installments: z.number(),
  encrypted: z.string(),
});

export type TCard = z.infer<typeof schemaCard>;
