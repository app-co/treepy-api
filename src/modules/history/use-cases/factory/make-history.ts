import { PrismaUserRepository } from '@/modules/users/repositories/prisma-users-repository';

import { PrismaHistory } from '../../repositories/prisma-history';
import { CasesHistory } from '../cases-history';

export function makeHistory() {
  const repoHistory = new PrismaHistory();
  const repoUser = new PrismaUserRepository();
  const make = new CasesHistory(repoHistory, repoUser);

  return make;
}
