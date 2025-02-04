import { PrismaHistory } from '@/modules/history/repositories/prisma-history';
import SESMailProvider from '@/shared/providers/emails/providers/implementations/SESMailProvider';
import HandleBars from '@/shared/providers/emails/templates/implementations/HandleBaars';

import { PrismaUserRepository } from '../../repositories/prisma-users-repository';
import { RegisterUseCase } from '../register';

export function makeRegisterUseCase() {
  const repo = new PrismaUserRepository();
  const repoHistory = new PrismaHistory();

  const repoBars = new HandleBars();
  const mail = new SESMailProvider(repoBars);
  const register = new RegisterUseCase(repo, repoHistory, mail);

  return register;
}
