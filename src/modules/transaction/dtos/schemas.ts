import { z } from "zod";

const card = z.object({
  value: z.number(),
  cardNumber: z.string(),
  cvv: z.string(),
  expiryYear: z.string(),
  expiryMonth: z.string(),
  userId: z.string(),
  holderName: z.string(),
  history: z.boolean().default(false),
  installmentCount: z.number().default(1),
  installmentValue: z.number()
})

const payCardToken = z.object({
  userId: z.string(),
  customer: z.string(),
  dueDate: z.string(),
  creditCardToken: z.string(),
  remoteIp: z.string(),
  value: z.number(),
})

const pix = z.object({
  value: z.number(),
  userId: z.string(),
})

export const schemas = {
  card,
  pix,
  payCardToken
}