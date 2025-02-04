/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '@/lib/prisma';
import { jangle, Prisma } from '@prisma/client';

import { IJangleUpdate } from '../dtos';
import { IRepoJangles } from './repo-jangles';

export class PrismaJangles implements IRepoJangles {
  public async create(
    data: Prisma.jangleUncheckedCreateInput,
  ): Promise<jangle> {
    const create = await prisma.jangle.create({ data });

    return create;
  }

  public async findById(id: string): Promise<jangle | null> {
    const list = await prisma.jangle.findUnique({ where: { id } });

    return list;
  }

  public async findByCodigo(codigo: string): Promise<jangle | null> {
    const list = await prisma.jangle.findFirst({ where: { codigo } });

    return list;
  }

  public async update(data: IJangleUpdate): Promise<jangle> {
    const list = await prisma.jangle.update({ where: { id: data.id! }, data });

    return list;
  }

  public async delete(id: string): Promise<jangle> {
    const list = await prisma.jangle.delete({ where: { id } });

    return list;
  }

  public async listall(): Promise<jangle[]> {
    const list = await prisma.jangle.findMany();

    return list;
  }
}
