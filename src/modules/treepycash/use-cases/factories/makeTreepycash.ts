import { PrismaUserRepository } from '@/modules/users/repositories/prisma-users-repository';

import { PrismaTreepycash } from '../../repositories/PrismaTreepycash';
import { TreepycashUseCases } from '../treepycash-cases';

export function makeTreepycash() {
  const repoTreepy = new PrismaTreepycash();
  const repoUser = new PrismaUserRepository();

  const make = new TreepycashUseCases(repoTreepy, repoUser);

  return make;
}
