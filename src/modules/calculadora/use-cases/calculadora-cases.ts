/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from '@/lib/prisma';
import { Err } from '@/modules/charges/errors/Err';
import { Calculadora } from '@prisma/client';

import { ICalculadora } from '../dtos';
import { TCalcUpdate } from '../http/controller/register';
import { IRepoCalculadora } from '../repositories/repo-calculadora';

interface props {
  id: string;
}

export class CalculadoraUseCases {
  constructor(private repoCalculadora: IRepoCalculadora) { }

  async findByUser(fk_user_id: string): Promise<Calculadora[]> {
    const list = await this.repoCalculadora.findByUser(fk_user_id);

    return list;
  }

  async create(data: ICalculadora): Promise<any> {
    const find = await this.repoCalculadora.findByUser(data.fk_user_id);

    let calc = null;

    if (find.length > 0) {
      const { id } = find[0];
      const dt = {
        ...data,
        id,
      };

      const up = await this.repoCalculadora.update(dt);
      calc = up;
    } else {
      const create = await this.repoCalculadora.create(data);
      calc = create;
    }

    return calc;
  }

  async findById(id: string): Promise<Calculadora | null> {
    const find = await this.repoCalculadora.findById(id);

    if (!find) {
      throw new ProprertyNotFound();
    }

    return find;
  }

  async listall(): Promise<Calculadora[]> {
    const list = this.repoCalculadora.listall();

    return list;
  }

  async delete(id: string): Promise<Calculadora> {
    const del = this.repoCalculadora.delete(id);

    return del;
  }

  async update(data: TCalcUpdate): Promise<Calculadora> {
    const user = await prisma.user.findUnique({
      where: { id: data.fk_user_id },
      include: { Calculadora: true },
    });

    if (!user) {
      throw new Err('User not found');
    }

    const up = await prisma.calculadora.update({
      where: { id: user!.Calculadora!.id },
      data,
    });

    return up;
  }
}
