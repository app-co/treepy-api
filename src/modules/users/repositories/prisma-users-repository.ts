import { prisma } from '@/lib/prisma';
import { Prisma, User } from '@prisma/client';

import { IPermission } from '../dtos';
import { IUsersRepository } from './IUser-repository';

export class PrismaUserRepository implements IUsersRepository {
  async listAll(): Promise<User[]> {
    const list = await prisma.user.findMany({
      include: { Calculadora: true, cashe_cliente: true },
    });

    return list;
  }

  async findByCPF(cpf: string): Promise<User | null> {
    const find = await prisma.user.findUnique({ where: { cpf } });
    return find;
  }

  async resetPassWord(password: string, user_id: string): Promise<User> {
    const up = await prisma.user.update({
      where: { id: user_id },
      data: {
        password,
      },
    });

    return up;
  }

  async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        jangle: true,
        cashe_cliente: true,
        Calculadora: true,
        History: true,
        Permissons: true,
        profile: true,
        end: true,
        cardToken: true,
        Charges: true,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { email } });
    return user;
  }

  async create(data: Prisma.UserCreateInput, permission: IPermission) {
    const user = await prisma.user.create({
      data: {
        ...data,
        Permissons: {
          create: permission,
        },
      },
    });

    return user;
  }
}
