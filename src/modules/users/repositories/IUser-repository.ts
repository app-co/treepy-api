import { Prisma, User } from '@prisma/client';

import { IEndDto, IPermission } from '../dtos';

export interface IUsersRepository {
  create(data: Prisma.UserCreateInput, permission: IPermission): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
  findByCPF(userId: string): Promise<User | null>;
  resetPassWord(password: string, user_id: string): Promise<User>;
  listAll(): Promise<User[]>;
}
