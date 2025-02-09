import { prisma } from '@/lib/prisma';
import { AppError } from '@/shared/app-error/AppError';
import { addDays } from 'date-fns';
import { api } from './api';
import { IResultCard } from './dtos/interfaces';
import { TInfo, TPixInfo } from './dtos/types';


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

  async pix({ value, userId }: TPixInfo) {
    try {
      const dt = {
        addressKey: 'contato@treepy.com.br',
        description: 'Compra de TreepyCaches',
        value: value,
        format: 'ALL',
        expirationDate: addDays(new Date(), 1),
      };

      const { data } = await api.post('/pix/qrCodes/static', dt);

      return {
        payload: data.payload,
        image: data.encodedImage,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(error.error);
      }
    }

    return null;
  }


}