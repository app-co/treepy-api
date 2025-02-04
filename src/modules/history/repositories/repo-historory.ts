import { IHistory } from '@/modules/dtos';
import { History } from '@prisma/client';

export interface IRepoHistory {
  create(data: IHistory): Promise<History>;
  listAll(): Promise<History[]>;
  listByUserId(fk_user_id: string): Promise<History[]>;
  delete(id: string): Promise<History>;
}
