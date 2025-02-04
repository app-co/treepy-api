import { _toTreepycash } from "@/@utils/unidades"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/shared/app-error/AppError"
import { format } from "date-fns"
import { UserService } from "../user/service"
import { api } from "./api"
import { IResultCard } from "./mox/interface"
import { TCard } from "./mox/types"
import { ValidatedTransactions } from "../validate-transaction/services"



export class transactionServices {
  constructor(
    private user: UserService
  ) { }

  async pay_card(obj: TCard) {
    const user = await this.user.getUserById(obj.userId)
    const getPrice = await prisma.precificacao.findFirst()
    const price = getPrice?.unid_trepycash

    if (!user?.endereco) {
      throw new AppError('Endereço não configurado')
    }
    const info = {
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

    const treepycash = _toTreepycash(obj.value, price!)

    try {

      const { data } = await api.post<IResultCard>('/payments', info);

      if (data.status === 'CONFIRMED' || data.status === 'RECEIVED') {

        const dt = {
          id: data.id,
          card: data.creditCard,
          valorBruto: obj.value,
          valorLiquido: data.netValue,
          status: data.status
        }

        await prisma.pagamentos.create({
          data: {
            metodo: 'CARTAO',
            orderId: data.id,
            userId: user.id,
            valo_compra: obj.value,
            status: 1,
          }
        })

        if (obj.history) {
          const cards = user?.cardToken ?? []
          const cardToken = await prisma.cardToken.findFirst({
            where: {
              token: { in: cards.map(h => h.token) }
            }
          })

          if (cardToken) {
            const card = await prisma.cardToken.update({
              where: { id: cardToken.id },
              data: {
                ...data.creditCard
              }
            })
            return card
          }

          await prisma.cardToken.create({
            data: {
              userId: user.id,
              token: data.creditCard.creditCardToken,
              creditCardNumber: data.creditCard.creditCardNumber,
              creditCardBrand: data.creditCard.creditCardBrand,
            }
          })

          return data
        }

        return data
      }


    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(error.error)
      }
    }

  }
  async pay_pix(obj: any) {
    await ValidatedTransactions({
      amount: obj.value,
      metodo: 'PIX',
      orderId: '1234567890',
      userId: obj.userId,
    })
  }
  async pay_boleto(obj: any) { }
}