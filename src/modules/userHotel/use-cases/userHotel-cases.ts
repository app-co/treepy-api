/* eslint-disable @typescript-eslint/no-unused-vars */
import { userHotel, Prisma } from '@prisma/client';

import { IRepoUserHotel } from '../repositories/repo-userHotel';

interface props {
  id: string;
}

export class UserHotelUseCases {
  constructor(private repoUserHotel: IRepoUserHotel) {}

  async create(data: Prisma.userHotelCreateInput): Promise<userHotel> {
    const create = await this.repoUserHotel.create(data);

    return create;
  }

  // async findById(id: string): Promise<userHotel | null> {
  //   const find = await this.repoUserHotel.findById(id);

  //   if (!find) {
  //     throw new ProprertyNotFound();
  //   }

  //   return find;
  // }

  // async listall(): Promise<userHotel[]> {
  //   const list = this.repoUserHotel.listall();

  //   return list;
  // }

  // async delete(id: string): Promise<userHotel> {
  //   const del = this.repoUserHotel.delete(id);

  //   return del;
  // }

  // async update(data: IProprertyUpdate): Promise<userHotel> {
  //   const find = await this.repoUserHotel.findById(data.id);

  //   if (!find) {
  //     throw new ProprertyNotFound();
  //   }
  //   const up = this.repoUserHotel.update(data);

  //   return up;
  // }
}
