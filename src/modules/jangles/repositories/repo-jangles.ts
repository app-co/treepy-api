import { Prisma, jangle } from '@prisma/client';

import { IJangleUpdate } from '../dtos';

export interface IRepoJangles {
  create(data: Prisma.jangleUncheckedCreateInput): Promise<jangle>;
  findById(id: string): Promise<jangle | null>;
  findByCodigo(id: string): Promise<jangle | null>;
  listall(): Promise<jangle[]>;
  delete(id: string): Promise<jangle>;
  update(id: IJangleUpdate): Promise<jangle>;
}
