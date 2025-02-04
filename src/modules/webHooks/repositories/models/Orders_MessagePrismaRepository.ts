/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '@/lib/prisma';
import { hooks, Prisma } from '@prisma/client';

import { IWebhookRepository } from '../IRepository/IWebhook-repository';

export class WebHooksPrismaRepository implements IWebhookRepository {
  public async create(data: Prisma.hooksCreateInput): Promise<hooks> {
    const create = await prisma.hooks.create({ data });

    return create;
  }

  public async findById(id: string): Promise<hooks | null> {
    const list = await prisma.hooks.findUnique({ where: { id } });

    return list;
  }

  public async listMany(): Promise<hooks[]> {
    const list = await prisma.hooks.findMany();

    return list;
  }
}
