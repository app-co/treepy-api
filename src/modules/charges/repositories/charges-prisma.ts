import { prisma } from '@/lib/prisma';
import { Prisma, Charges } from '@prisma/client';

import { ICharge } from '../dtos';
import { IRepoCharge } from './IRepoCharges';

export class ChargePrisma implements IRepoCharge {
  async create(data: ICharge): Promise<Charges> {
    const dt = await prisma.charges.create({
      data: {
        order_id: data.order_id,
        charge_id: data.charge_id,
        fk_user_id: data.fk_user_id,
        customer: data.customer,
        type: data.type,
        status: data.status,
        value: data.value,
      },
    });

    return dt;
  }

  async update(data: Prisma.ChargesUpdateInput, id: string): Promise<Charges> {
    const up = await prisma.charges.update({
      where: { id },
      data,
    });

    return up;
  }

  async findById(id: string): Promise<Charges | null> {
    const find = await prisma.charges.findUnique({
      where: { id },
    });

    return find;
  }

  async findByChargeId(charge_id: string): Promise<Charges | null> {
    const find = prisma.charges.findFirst({
      where: { charge_id },
    });

    return find;
  }

  async findByOrderId(order_id: string): Promise<Charges | null> {
    const find = await prisma.charges.findFirst({
      where: { order_id },
    });

    return find;
  }

  async findByUser(user_id: string): Promise<Charges[]> {
    const find = await prisma.charges.findMany({
      where: { fk_user_id: user_id },
    });
    return find;
  }

  async listAll(): Promise<Charges[]> {
    const list = await prisma.charges.findMany();
    return list;
  }

  async delete(id: string): Promise<Charges> {
    const del = await prisma.charges.delete({
      where: { id },
    });

    return del;
  }
}
