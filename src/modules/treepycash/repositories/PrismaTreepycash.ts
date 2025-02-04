/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '@/lib/prisma';
import { Treepycash, Prisma } from '@prisma/client';

import { IRepoTreepycash } from './repo-treepycash';

export class PrismaTreepycash implements IRepoTreepycash {
  public async create(
    data: Prisma.TreepycashUncheckedCreateInput,
  ): Promise<Treepycash> {
    const create = await prisma.treepycash.create({ data });

    return create;
  }

  public async findById(id: string): Promise<Treepycash | null> {
    const list = await prisma.treepycash.findUnique({ where: { id } });

    return list;
  }

  public async findByUser(fk_user_id: string): Promise<Treepycash[]> {
    const list = await prisma.treepycash.findMany({ where: { fk_user_id } });

    return list;
  }

  public async delete(id: string): Promise<Treepycash> {
    const list = await prisma.treepycash.delete({ where: { id } });

    return list;
  }

  public async listall(): Promise<Treepycash[]> {
    const list = await prisma.treepycash.findMany();

    return list;
  }
}
