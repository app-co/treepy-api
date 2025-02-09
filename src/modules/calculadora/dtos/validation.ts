import { z } from "zod";

const registerCalculadora = z.object({
  gas: z.number(),
  eletricidade: z.number(),
  transporte_individual: z.number(),
  transporte_coletivo: z.number(),
  alimentacao: z.number(),
  residuos: z.number(),
  userId: z.string()
})


export const validation = {
  registerCalculadora
}