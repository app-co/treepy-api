import { Prisma, hooks } from '@prisma/client';

export interface IWebhookRepository {
  create(data: Prisma.hooksCreateInput): Promise<hooks>;
  findById(id: string): Promise<hooks | null>;
  listMany(): Promise<hooks[]>;
}
