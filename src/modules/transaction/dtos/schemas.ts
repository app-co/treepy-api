import { z } from "zod";

const card = z.object({
  value: z.number(),
  cardNumber: z.string(),
  cvv: z.string(),
  expiryYear: z.string(),
  expiryMonth: z.string(),
  userId: z.string(),
  holderName: z.string(),
  history: z.boolean().default(false)
})

export const schemas = {
  card
}