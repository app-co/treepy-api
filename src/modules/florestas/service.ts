import { prisma } from '@/lib/prisma';
import { AppError } from '@/shared/app-error/AppError';
import RedisCacheProvider from '@/shared/providers/redis/redis-provider';
import { TCreateFloresta } from './dtos/types';




export class ServiceFloresta {

  constructor(
    private redis: RedisCacheProvider
  ) { }

  async create(obj: Omit<TCreateFloresta, 'id'>) {
    const floresta = await prisma.florestas.findFirst({ where: { codigo: obj.codigo } })

    if (floresta) {
      throw new AppError('Floresta já cadastrada com esse código');
    }

    const create = await prisma.florestas.create({
      data: obj,
    })

    await this.redis.invalidatePrefix(`${obj.projeto}:florestas`)
    await this.redis.invalidate(`florestas`)

    return create
  }

  async update(obj: TCreateFloresta) {
    const floresta = await this.byProjeto(obj.projeto)

    if (!floresta) {
      throw new AppError('Floresta não encontrada');
    }

    await prisma.florestas.update({
      where: {
        projeto: floresta.projeto,
      },
      data: obj,
    })

    await this.redis.invalidatePrefix(`${obj.projeto}:florestas`)
    await this.redis.invalidate(`florestas`)
  }

  async byProjeto(projeto: number) {
    let floresta = await this.redis.recover<TCreateFloresta>(`${projeto}:florestas`)

    if (!floresta) {
      floresta = await prisma.florestas.findUnique({ where: { projeto } });
      await this.redis.save('florestas', floresta)
    }

    return floresta
  }

  async listAll() {
    let florestas = await this.redis.recover('florestas')

    if (!florestas) {
      florestas = await prisma.florestas.findMany();
      await this.redis.save('florestas', florestas)
    }

    return florestas
  }

  async deletefloresta(projeto: number) {
    await prisma.florestas.delete({ where: { projeto } });

    await this.redis.invalidatePrefix(`${projeto}:florestas`)
    await this.redis.invalidatePrefix(`florestas`)
  }
}