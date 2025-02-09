import { prisma } from '@/lib/prisma';
import { AppError } from '@/shared/app-error/AppError';
import { api } from './api';
import { IResultCard } from './dtos/interfaces';
import { TInfo } from './dtos/types';


export class ServicePayment {

  async card(info: TInfo, userId: string) {
    try {
      const { data } = await api.post<IResultCard>('/payments', info);
      const dt = {
        orderId: data.id,
        paymentType: "creditCard",
        valorLiquido: data.netValue,
        valorBruto: info.value,
        status: data.status
      }

      await prisma.transacoes.create({
        data: dt
      })

      if (data.status === 'CONFIRMED' || data.status === 'RECEIVED') {
        return data
      }

    } catch (error) {
      console.log(error)
      if (error instanceof AppError) {
        throw new AppError(error.error)
      }
    }


  }

}