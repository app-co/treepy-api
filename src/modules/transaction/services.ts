import { _toTreepycash } from "@/@utils/unidades";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/shared/app-error/AppError";
import { format } from "date-fns";
import type { IResultCard } from "../payment/dtos/interfaces";
import type { TInfo, TPaymentCardToken } from "../payment/dtos/types";
import type { ServicePayment } from "../payment/service";
import type { UserService } from "../user/service";
import type {
	TCard,
	TPayCardToken,
	TPix,
	TValidationTransaction,
} from "./dtos/types";

export class transactionServices {
	constructor(
		private user: UserService,
		private payment: ServicePayment,
		// private validateTransactions: ValidatedTransactions
	) {}

	private async registerCardToken({
		userId,
		card,
	}: { userId: string; card: IResultCard }) {
		const cardToken = await prisma.cardToken.findFirst({
			where: {
				userId: userId,
				token: card.creditCard.creditCardToken,
			},
		});

		if (!cardToken) {
			const token = await prisma.cardToken.create({
				data: {
					userId,
					token: card.creditCard.creditCardToken,
					creditCardNumber: card.creditCard.creditCardNumber,
					creditCardBrand: card.creditCard.creditCardBrand,
				},
			});

			return token;
		}

		const token = await prisma.cardToken.create({
			data: {
				userId,
				token: card.creditCard.creditCardToken,
				creditCardNumber: card.creditCard.creditCardNumber,
				creditCardBrand: card.creditCard.creditCardBrand,
			},
		});

		return token;
	}

	private async validationTransaction(item: TValidationTransaction) {
		const valorUnitario = item.valorUnitario;

		const qntComprTreepycashe = _toTreepycash(
			item.valorCompra,
			valorUnitario,
		);
		let qntRestanteCompraTreepycashe = qntComprTreepycashe;

		const order = await prisma.transacoesUser.findFirst({
			where: { orderId: item.orderId },
		});

		if (!order) {
			await prisma.transacoesUser.create({
				data: {
					metodo: item.metodo,
					orderId: item.orderId,
					userId: item.userId,
					valo_compra: item.valorCompra,
					status: 1,
				},
			});
		} else {
			await prisma.transacoesUser.update({
				where: { id: order.id },
				data: {
					metodo: item.metodo,
					orderId: item.orderId,
					userId: item.userId,
					valo_compra: item.valorCompra,
					status: 1,
				},
			});
		}

		const florestas = await prisma.florestas.findMany({
			where: {
				AND: [
					{
						treepycash_disponivel: { gt: 0 }, // maior que ...
					},
				],
			},
			orderBy: {
				projeto: "asc",
			},
		});

		for (const h of florestas) {
			if (qntRestanteCompraTreepycashe <= 0) break;
			const tenho = qntRestanteCompraTreepycashe;
			const tree = h.treepycash_disponivel;
			const soma = tree - tenho;
			let sobraTree = 0;
			let restaMi = 10;

			if (tenho <= tree) {
				sobraTree = soma;
				restaMi = 0;
			}

			if (tenho >= tree) {
				sobraTree = 0;
				restaMi = tenho - tree;
			}

			qntRestanteCompraTreepycashe = restaMi;

			await prisma.florestas.update({
				where: { id: h.id },
				data: {
					treepycash_disponivel: Number(sobraTree.toFixed(3)),
				},
			});

			await prisma.treepycaches.create({
				data: {
					isValid: true,
					qnt: qntComprTreepycashe,
					florestaId: h.id,
					userId: item.userId,
				},
			});
		}

		return qntRestanteCompraTreepycashe;

		const oneHourInMilliseconds = 60 * 1000;

		// cron.schedule('* * * * *', async () => {

		//   const update = await prisma.treepycaches.updateMany({
		//     where: {
		//       AND: [
		//         {
		//           isValid: true,
		//         },
		//         {
		//           updated_at: { gt: new Date(new Date().getTime() - oneHourInMilliseconds) } // menos de 1h
		//         }
		//       ]
		//     },
		//     data: {
		//       isValid: false,
		//     }
		//   });

		//   console.log(`Atualizando ${update.count} treepycashes invalidos`);
		// }, {
		//   timezone: 'America/Sao_Paulo'
		// }
		// );
	}

	private async validarDisponibilidadeTreepycash(valor: number) {
		const valorTreepy = await prisma.precificacao.findFirst();
		const valorEmTreepycash = _toTreepycash(
			valor,
			valorTreepy?.unid_trepycash,
		);

		const florestas = await prisma.florestas.findMany({
			where: {
				AND: [
					{
						treepycash_disponivel: { gt: 0 }, // maior que ...
					},
				],
			},
			orderBy: {
				projeto: "asc",
			},
		});

		if (florestas.length === 1) {
			if (florestas[0].treepycash_disponivel < valorEmTreepycash) {
				throw new AppError(
					`Há apenas ${florestas[0].treepycash_disponivel} treepycash(s) disponível, tente um valor menor`,
				);
			}
		}

		if (florestas.length === 0) {
			throw new AppError(
				"Nenhuma treepycash disponível para realizar a compra",
			);
		}
	}

	async pay_card(obj: TCard) {
		const user = await this.user.getUserById(obj.userId);

		const valorUnitarioTreepycashe = await prisma.precificacao.findFirst({
			select: { unid_trepycash: true },
		});
		if (!valorUnitarioTreepycashe) {
			throw new AppError("Precificacao não encontrada");
		}

		if (!user?.endereco) {
			throw new AppError("Endereço não configurado");
		}

		if (!user?.customerId) {
			throw new AppError("Customer não encontrado");
		}

		const info: TInfo = {
			customer: user.customerId,
			billingType: "CREDIT_CARD",
			value: obj.value,
			dueDate: format(new Date(), "yyyy-MM-dd"),
			installmentCount: obj.installmentCount,
			installmentValue: obj.installmentValue,
			creditCard: {
				holderName: obj.holderName,
				number: obj.cardNumber,
				expiryMonth: obj.expiryMonth,
				expiryYear: obj.expiryYear,
				ccv: obj.cvv,
			},
			creditCardHolderInfo: {
				name: user.nome,
				email: user.email,
				cpfCnpj: user.cpfCnpj,
				postalCode: user.endereco.cep,
				addressNumber: user.endereco.numero,
				phone: "4738010919",
				mobilePhone: "47998781877",
			},
			remoteIp: "",
		};

		try {
			await this.validarDisponibilidadeTreepycash(obj.value);
			const pyment = await this.payment.card(info, obj.userId);

			if (obj.history && pyment) {
				await this.registerCardToken({
					userId: obj.userId,
					card: pyment,
				});
				pyment;
			}

			const validate = await this.validationTransaction({
				valorCompra: obj.value,
				metodo: "CARTAO",
				orderId: pyment.id,
				userId: obj.userId,
				valorUnitario: valorUnitarioTreepycashe.unid_trepycash,
			});

			return validate;
		} catch (error: any) {
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}

			throw new Error(error);
		}
	}

	async pay_cardToken(obj: TPayCardToken) {
		const user = await this.user.getUserById(obj.userId);

		const info: TPaymentCardToken = {
			billingType: "CREDIT_CARD",
			creditCardToken: obj.creditCardToken,
			remoteIp: "",
			customer: user.customerId,
			dueDate: obj.dueDate,
		};

		try {
			await this.validarDisponibilidadeTreepycash(obj.value);
			// const pyment = await this.payment.card(info, obj.userId)

			// if (obj.history && pyment) {
			//   await this.registerCardToken({ userId: obj.userId, card: pyment })
			//   pyment
			// }

			const validate = await this.validationTransaction({
				valorCompra: obj.value,
				metodo: "CARTAO",
				orderId: "005",
				userId: obj.userId,
			});

			return validate;
		} catch (error: any) {
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}

			throw new Error(error);
		}
	}
	async pay_pix(obj: TPix) {
		const value = obj.value / 100;

		try {
			const payment = await this.payment.pix(obj);

			await prisma.transacoesUser.create({
				data: {
					metodo: "PIX",
					orderId: payment?.orderId,
					userId: obj.userId,
					valo_compra: obj.value,
					status: 0,
				},
			});

			return payment;
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}
		}
	}
	async pay_boleto(obj: any) {
		try {
			const payment = await this.payment.boleto(obj);

			await prisma.transacoesUser.create({
				data: {
					metodo: "BOLETO",
					orderId: payment?.id,
					userId: obj.userId,
					valo_compra: obj.value,
					status: 0,
				},
			});

			return payment;
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError(error.error);
			}
		}
	}
	async webHooks(obj: iResponseWeebHook) {
		if (
			obj.event === "PAYMENT_CONFIRMED" ||
			obj.event === "PAYMENT_RECEIVED"
		) {
			const order = await prisma.transacoesUser.findFirst({
				where: { orderId: obj.payment.id },
			});
			if (!order) return;
			const dt = {
				orderId: obj.payment.id,
				paymentType: obj.payment.id,
				valorLiquido: obj.payment.netValue,
				valorBruto: obj.payment.value,
				status: obj.event,
			};

			await prisma.transacoes.create({
				data: dt,
			});

			await this.validationTransaction({
				valorCompra: order.valo_compra,
				metodo: order.metodo,
				orderId: order.orderId,
				userId: order.userId,
			});
		}

		return { received: true };
	}
}
