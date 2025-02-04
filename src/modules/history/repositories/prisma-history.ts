import { prisma } from '@/lib/prisma';
import { IHistory } from '@/modules/dtos';
import { History } from '@prisma/client';

import { IRepoHistory } from './repo-historory';

export class PrismaHistory implements IRepoHistory {
  async create(data: IHistory): Promise<History> {
    const create = await prisma.history.create({
      data,
    });

    return create;
  }

  async listAll(): Promise<History[]> {
    const list = await prisma.history.findMany();
    return list;
  }

  async listByUserId(fk_user_id: string): Promise<History[]> {
    const find = await prisma.history.findMany({
      where: { fk_user_id },
    });

    return find;
  }

  async delete(id: string): Promise<History> {
    const del = await prisma.history.delete({
      where: { id },
    });

    return del;
  }
}
