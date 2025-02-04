import { PrismaJangles } from '@/modules/jangles/repositories/PrismaJangles';

import { PrismaUserRepository } from '../../repositories/prisma-users-repository';
import { RelatorioAdm } from '../relatorio-adm';

export function makeRelatorio() {
  const repoUser = new PrismaUserRepository();
  const repoJangle = new PrismaJangles();

  const make = new RelatorioAdm(repoJangle, repoUser);

  return make;
}
