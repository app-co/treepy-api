/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '@/lib/prisma';
import { Calculadora } from '@prisma/client';

import { ICalculadora, ICalculadoraUp } from '../dtos';
import { IRepoCalculadora } from './repo-calculadora';

export class PrismaCalculadora implements IRepoCalculadora {
  public async create(data: ICalculadora): Promise<Calculadora> {
    const create = await prisma.calculadora.create({ data });

    return create;
  }

  public async findById(id: string): Promise<Calculadora | null> {
    const list = await prisma.calculadora.findUnique({ where: { id } });

    return list;
  }

  public async findByUser(fk_user_id: string): Promise<Calculadora[]> {
    const list = await prisma.calculadora.findMany({ where: { fk_user_id } });

    return list;
  }

  public async update(data: ICalculadoraUp): Promise<Calculadora> {
    const list = await prisma.calculadora.update({
      where: { id: data.id },
      data,
    });

    return list;
  }

  public async delete(id: string): Promise<Calculadora> {
    const list = await prisma.calculadora.delete({ where: { id } });

    return list;
  }

  public async listall(): Promise<Calculadora[]> {
    const list = await prisma.calculadora.findMany();

    return list;
  }
}
