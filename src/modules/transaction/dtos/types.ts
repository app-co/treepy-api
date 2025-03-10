import type { z } from "zod";
import type { schemas } from "./schemas";

export type TCard = z.infer<typeof schemas.card>;
export type TPix = z.infer<typeof schemas.pix>;
export type TPayCardToken = z.infer<typeof schemas.payCardToken>;

export type TValidationTransaction = {
	valorCompra: number;
	metodo: "BOLETO" | "PIX" | "CARTAO";
	orderId: string;
	userId: string;
	valorUnitario: number;
};
