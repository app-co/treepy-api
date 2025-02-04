import { z } from "zod";

export const validation = {
  create: z.object({
    nome: z.string(),
    codigo: z.string(),
    lat: z.string(),
    long: z.string(),
    id: z.number(),
    qnt_arvores: z.number(),
    treepycash_disponivel: z.number(),
    projeto: z.number(),
  })
}