import { prisma } from '@/lib/prisma';
import { Err } from '@/modules/charges/errors/Err';
import { IHistory } from '@/modules/dtos';
import { IUsersRepository } from '@/modules/users/repositories/IUser-repository';
import { History } from '@prisma/client';

import { IRepoHistory } from '../repositories/repo-historory';

export class CasesHistory implements IRepoHistory {
  constructor(
    private repoHistory: IRepoHistory,
    private repoUser: IUsersRepository,
  ) {}

  async create(data: IHistory): Promise<History> {
    const find = await this.repoUser.findById(data.fk_user_id);

    if (!find) {
      throw new Err('Usuário não encontrado');
    }
    const create = await this.repoHistory.create(data);

    return create;
  }

  async listByUserId(fk_user_id: string): Promise<History[]> {
    const find = await this.repoHistory.listByUserId(fk_user_id);

    return find;
  }

  async delete(id: string): Promise<History> {
    const del = await this.repoHistory.delete(id);

    return del;
  }

  async listAll(): Promise<History[]> {
    const list = await this.repoHistory.listAll();
    return list;
  }
}
