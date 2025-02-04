/* eslint-disable @typescript-eslint/no-unused-vars */
import { Err } from '@/modules/charges/errors/Err';
import { IUsersRepository } from '@/modules/users/repositories/IUser-repository';
import { UserNotFound } from '@/modules/users/use-cases/errors/user-not-found';
import { Treepycash, Prisma } from '@prisma/client';

import { IRepoTreepycash } from '../repositories/repo-treepycash';

interface props {
  id: string;
}

export class TreepycashUseCases implements IRepoTreepycash {
  constructor(
    private repoTreepycash: IRepoTreepycash,
    private repoUser: IUsersRepository,
  ) {}

  async findByUser(fk_user_id: string): Promise<Treepycash[]> {
    const find = await this.repoTreepycash.findByUser(fk_user_id);

    return find;
  }

  async create(
    data: Prisma.TreepycashUncheckedCreateInput,
  ): Promise<Treepycash> {
    const checkUser = this.repoUser.findById(data.fk_user_id);

    if (!checkUser) {
      throw new UserNotFound();
    }

    const create = await this.repoTreepycash.create(data);

    return create;
  }

  async findById(id: string): Promise<Treepycash | null> {
    const find = await this.repoTreepycash.findById(id);

    if (!find) {
      throw new Err('TreepyCashe não encontrado');
    }

    return find;
  }

  async listall(): Promise<Treepycash[]> {
    const list = this.repoTreepycash.listall();

    return list;
  }

  async delete(id: string): Promise<Treepycash> {
    const find = await this.repoTreepycash.findById(id);

    if (!find) {
      throw new Err('TreepyCashe não encontrado');
    }

    const del = this.repoTreepycash.delete(id);

    return del;
  }
}
