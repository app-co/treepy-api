import { Prisma, userHotel } from '@prisma/client';

export interface IRepoUserHotel {
  create(data: Prisma.userHotelCreateInput): Promise<userHotel>;
  listall(): Promise<userHotel[]>;
}
