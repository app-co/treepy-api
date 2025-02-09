import { z } from "zod";
import { schemas } from "./schemas";

export type TCard = z.infer<typeof schemas.card>

export type TValidationTransaction = {
  valorCompra: number;
  metodo: 'BOLETO' | 'PIX' | 'CARTAO'
  orderId: string;
  userId: string;
}