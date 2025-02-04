import { z } from 'zod';

export const schemaCard = z.object({
  userId: z.string(),
  amount: z.number(),
  installmentCount: z.number(),
  installmentValue: z.number(),
  cardToken: z.string(),
});

export const schemaCardToken = z.object({
  userId: z.string(),
  holderName: z.string(),
  card_number: z.string(),
  expiryMonth: z.string(),
  expiryYear: z.string(),
  ccv: z.string(),
  permission: z.boolean(),
});

export const schemaPix = z.object({
  value: z.number(),
  userId: z.string(),
});

export const schemaCharges = z.object({
  userId: z.string(),
  orderId: z.string(),
  type: z.enum(['pix', 'cartao', 'boleto']),
  value: z.number(),
});

export const schemaValidatePayment = z.object({
  orderId: z.string(),
  tree: z.number(),
  adm: z.boolean().default(false).optional().nullable(),
  orderm: z.number().optional().nullable(),
  userId: z.string().optional().nullable(),
});
