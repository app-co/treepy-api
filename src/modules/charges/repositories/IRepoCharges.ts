import { Charges, Prisma } from '@prisma/client';

import { ICharge } from '../dtos';

export interface IRepoCharge {
  create(data: ICharge): Promise<Charges>;
  update(data: Prisma.ChargesUpdateInput, id: string): Promise<Charges>;
  findById(id: string): Promise<Charges | null>;
  findByChargeId(charge_id: string): Promise<Charges | null>;
  findByOrderId(order_id: string): Promise<Charges | null>;
  findByUser(user_id: string): Promise<Charges[]>;
  listAll(): Promise<Charges[]>;
  delete(id: string): Promise<Charges>;
}
