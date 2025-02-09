import { _toTreepycash } from "@/@utils/unidades"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/shared/app-error/AppError"
import { format } from "date-fns"
import { IResultCard } from "../payment/dtos/interfaces"
import { TInfo } from "../payment/dtos/types"
import { ServicePayment } from "../payment/service"
import { UserService } from "../user/service"
import { TCard, TPix, TValidationTransaction } from "./dtos/types"

export class transactionServices {
  constructor(
    private user: UserService,
    private payment: ServicePayment,
    // private validateTransactions: ValidatedTransactions
  ) { }

  private async registerCardToken({ userId, card }: { userId: string, card: IResultCard }) {

    const cardToken = await prisma.cardToken.findFirst({
      where:
      {
        userId: userId,
        token: card.creditCard.creditCardToken
      }
    })

    if (!cardToken) {
      const token = await prisma.cardToken.create({
        data: {
          userId,
          token: card.creditCard.creditCardToken,
          creditCardNumber: card.creditCard.creditCardNumber,
          creditCardBrand: card.creditCard.creditCardBrand,
        }
      })

      return token
    }

    const token = await prisma.cardToken.create({
      data: {
        userId,
        token: card.creditCard.creditCardToken,
        creditCardNumber: card.creditCard.creditCardNumber,
        creditCardBrand: card.creditCard.creditCardBrand,
      }
    })

    return token

  }

  private async validationTransaction(item: TValidationTransaction) {
    const valorUnitarioTreepycashe = await prisma.precificacao.findFirst({ select: { unid_trepycash: true } })

    if (!valorUnitarioTreepycashe) return

    const qntComprTreepycashe = _toTreepycash(item.valorCompra, valorUnitarioTreepycashe?.unid_trepycash)
    console.log({ qntComprTreepycashe })


    await prisma.transacoesUser.create({
      data: {
        metodo: item.metodo,
        orderId: item.orderId,
        userId: item.userId,
        valo_compra: item.valorCompra,
        status: 1,
      }
    })

    const floresta = await prisma.florestas.findFirst({
      where: {
        AND: [
          {
            treepycash_disponivel: { gt: 0 } // maior que ...
          }
        ]
      },
      orderBy: {
        projeto: 'asc'
      }
    })

    if (!floresta) throw new AppError('Sem florestas disponiveis')

    const recalculateTreepycash = floresta.treepycash_disponivel - qntComprTreepycashe

    await prisma.florestas.update({
      where: { id: floresta.id },
      data: {
        treepycash_disponivel: recalculateTreepycash
      }
    });

    await prisma.treepycaches.create({
      data: {
        userId: item.userId,
        florestaId: floresta.id,
        qnt: qntComprTreepycashe,
        isValid: true,
      }
    })

    return recalculateTreepycash


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

  async pay_card(obj: TCard) {
    const user = await this.user.getUserById(obj.userId)

    if (!user?.endereco) {
      throw new AppError('Endereço não configurado')
    }

    if (!user?.customerId) {
      throw new AppError('Customer não encontrado')
    }

    const info: TInfo = {
      customer: user.customerId,
      billingType: "CREDIT_CARD",
      value: obj.value,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
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
        mobilePhone: "47998781877"
      },
      remoteIp: ''
    }

    try {
      const pyment = await this.payment.card(info, obj.userId)

      if (obj.history && pyment) {
        await this.registerCardToken({ userId: obj.userId, card: pyment })
        pyment
      }

      const validate = await this.validationTransaction({
        valorCompra: obj.value,
        metodo: 'CARTAO',
        orderId: pyment!.id,
        userId: obj.userId,
      })

      return validate

    } catch (error: any) {
      if (error instanceof AppError) {
        throw new AppError(error.error)
      }

      throw new Error(error)
    }

  }
  async pay_pix(obj: TPix) {
    try {
      const payment = await this.payment.pix(obj)

      return payment

    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(error.error)
      }
    }
  }
  async pay_boleto(obj: any) {
    try {
      const payment = await this.payment.boleto(obj)

      return payment

    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(error.error)
      }
    }
  }
  async webHooks(obj: any) {
    console.log(obj)

    return obj
  }


}