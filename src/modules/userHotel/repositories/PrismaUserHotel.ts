/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '@/lib/prisma';
import { Prisma, userHotel } from '@prisma/client';

import { IRepoUserHotel } from './repo-userHotel';

export class PrismaUserHotel implements IRepoUserHotel {
  public async create(data: Prisma.userHotelCreateInput): Promise<userHotel> {
    const create = await prisma.userHotel.create({ data });

    return create;
  }

  public async listall(): Promise<userHotel[]> {
    const list = await prisma.userHotel.findMany();

    return list;
  }
}
