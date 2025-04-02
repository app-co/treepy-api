import { randomBytes } from "crypto";
import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/shared/app-error/AppError";
import { addDays } from "date-fns";
import { api } from "./api";
import type { IResultCard } from "./dtos/interfaces";
import type {
	TBoletoInfo,
	TInfo,
	TPaymentCardToken,
	TPixInfo,
} from "./dtos/types";

export class ServicePayment {
	async card(info: TInfo, userId: string) {
		try {
			const { data } = await api.post<IResultCard>("/payments", info);
			const dt = {
				orderId: data.id,
				paymentType: "creditCard",
				valorLiquido: data.netValue,
				valorBruto: info.value,
				status: data.status,
			};

			await prisma.transacoes.create({
				data: dt,
			});

			if (data.status === "CONFIRMED" || data.status === "RECEIVED") {
				return data;
			}
		} catch (error) {
			console.log(error);
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}
		}
	}

	async payWithToken(obj: TPaymentCardToken) {
		try {
			const { data } = await api.post<IResultCard>("/payments", obj);
			const dt = {
				orderId: data.id,
				paymentType: "creditCard",
				valorLiquido: data.netValue,
				valorBruto: obj.value,
				status: data.status,
			};

			await prisma.transacoes.create({
				data: dt,
			});

			if (data.status === "CONFIRMED" || data.status === "RECEIVED") {
				return data;
			}
		} catch (error) {
			console.log(error);
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}
		}
	}

	async pix({ value, userId }: TPixInfo) {
		const keyPix =
			env.NODE_ENV === "tst" ? env.KEY_PIX_SANDBOX : env.KEY_PIX;

		try {
			const dt = {
				addressKey: keyPix,
				description: "Compra de TreepyCaches",
				value: value,
				format: "ALL",
				expirationDate: addDays(new Date(), 1),
				externalReference: randomBytes(3).toString("hex").toUpperCase(),
			};

			const { data } = await api.post("/pix/qrCodes/static", dt);

			return {
				payload: data.payload,
				image: data.encodedImage,
				orderId: data.id,
			};
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}
		}

		return null;
	}

	async boleto({ value, userId, customerId }: TBoletoInfo) {
		const dt = {
			customer: customerId,
			billingType: "BOLETO",
			value: value,
			dueDate: addDays(new Date(), 5),
		};

		try {
			const { data } = await api.post("/payments", dt);
			const barCode = await api.get(
				`payments/${data.id}/identificationField`,
			);

			const response = {
				invoiceUrl: data.invoiceUrl,
				barCode: barCode.data.barCode,
				id: data.id,
			};

			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}
		}

		return null;
	}

	async registerWebhook() {
		const url =
			env.NODE_ENV === "tst"
				? env.WEB_HOOKS_SANDBOX_URL
				: env.WEB_HOOKS_URL;

		try {
			const dt = {
				name: "hook",
				url,
				email: "contato@treepy.com.br",
				enabled: true,
				interrupted: false,
				authToken: null,
				sendType: "SEQUENTIALLY",
				events: [
					"PAYMENT_RECEIVED",
					"PAYMENT_CONFIRMED",
					"PAYMENT_CREATED",
					"PAYMENT_AWAITING_RISK_ANALYSIS",
					"PAYMENT_APPROVED_BY_RISK_ANALYSIS",
					"PAYMENT_REPROVED_BY_RISK_ANALYSIS",
					"PAYMENT_AUTHORIZED",
					"PAYMENT_UPDATED",
					"PAYMENT_CONFIRMED",
					"PAYMENT_RECEIVED",
					"PAYMENT_CREDIT_CARD_CAPTURE_REFUSED",
					"PAYMENT_ANTICIPATED",
					"PAYMENT_OVERDUE",
					"PAYMENT_DELETED",
					"PAYMENT_RESTORED",
					"PAYMENT_REFUNDED",
					"PAYMENT_PARTIALLY_REFUNDED",
					"PAYMENT_REFUND_IN_PROGRESS",
					"PAYMENT_RECEIVED_IN_CASH_UNDONE",
					"PAYMENT_CHARGEBACK_REQUESTED",
					"PAYMENT_CHARGEBACK_DISPUTE",
					"PAYMENT_AWAITING_CHARGEBACK_REVERSAL",
					"PAYMENT_DUNNING_RECEIVED",
					"PAYMENT_DUNNING_REQUESTED",
					"PAYMENT_BANK_SLIP_VIEWED",
					"PAYMENT_CHECKOUT_VIEWED",
					"PAYMENT_SPLIT_CANCELLED",
					"PAYMENT_SPLIT_DIVERGENCE_BLOCK",
					"PAYMENT_SPLIT_DIVERGENCE_BLOCK_FINISHED",
				],
			};

			const { data } = await api.post("/webhooks", dt);

			return data;
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}
		}
	}

	public async listarWebHooks() {
		const { data } = await api.get("/webhooks");

		return data;
	}

	async deletarWebhook(id: string) {
		await api.delete(`/webhooks/${id}`);
	}

	async atualizarWebhook(id: string) {
		await api.put(`/webhooks/${id}`);
	}
}
