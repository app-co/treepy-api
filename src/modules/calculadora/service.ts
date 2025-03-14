import { prisma } from '@/lib/prisma';
import RedisCacheProvider from '@/shared/providers/redis/redis-provider';
import { subYears } from 'date-fns';
import { ICalculadora } from './dtos/interface';
import { TRegisterCalculadora } from './dtos/types';

const redis = new RedisCacheProvider()

export class ServiceCalculadora {

  async register(obj: TRegisterCalculadora) {
    const umAnoAtras = subYears(new Date(), 1);

    const total =
      obj.gas +
      obj.eletricidade +
      obj.transporte_individual +
      obj.transporte_coletivo +
      obj.alimentacao +
      obj.residuos

    const calculadora = await this.getCalcById(obj.userId)

    if (!calculadora) {
      console.log('created')
      await prisma.calculadora.create({
        data: {
          ...obj,
          total
        }
      })
      await redis.invalidatePrefix(`${obj.userId}:calc`)
      await redis.invalidatePrefix(`${obj.userId}:calcAll`)
      return
    }

    const calc = await prisma.calculadora.update({
      where: {
        id: calculadora.id,
      },
      data: {
        ...obj,
        total
      }
    })

    await redis.invalidatePrefix(`${obj.userId}:calc`)
    await redis.invalidatePrefix(`${obj.userId}:calcAll`)

    return calc;
  }

  async getCalcById(userId: string) {
    let calc = await redis.recover<ICalculadora>(`${userId}:calc`)
    const umAnoAtras = subYears(new Date(), 1);

    if (!calc) {
      calc = await prisma.calculadora.findFirst({
        where: {
          userId: userId,
          updated_at: {
            gte: umAnoAtras,
          }
        },
        orderBy: { id: 'desc' }
      })

      await redis.recover(`${userId}:calc`);
    }

    return calc
  }

  async getAllByUserId(userId: string) {
    let calc = await redis.recover<ICalculadora[]>(`${userId}:calcAll`)

    const umAnoAtras = subYears(new Date(), 1);

    if (!calc) {
      calc = await prisma.calculadora.findMany({
        where: {
          userId: userId
        },
        orderBy: { updated_at: 'asc' }
      }) as unknown as ICalculadora[]

      await redis.recover(`${userId}:calcAll`);
    }

    const calcVencido = calc.filter(h => h.updated_at <= umAnoAtras)

    const calcValido = calc.filter(h => h.updated_at >= umAnoAtras)

    return {
      validos: calcValido,
      vencidos: calcVencido,
    }
  }


}