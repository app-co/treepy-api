import { Prisma, Treepycash } from '@prisma/client';

export interface IRepoTreepycash {
  create(data: Prisma.TreepycashUncheckedCreateInput): Promise<Treepycash>;
  findById(id: string): Promise<Treepycash | null>;
  findByUser(fk_user_id: string): Promise<Treepycash[]>;
  listall(): Promise<Treepycash[]>;
  delete(id: string): Promise<Treepycash>;
}
