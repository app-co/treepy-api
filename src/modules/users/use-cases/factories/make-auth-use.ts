import { PrismaUserRepository } from '../../repositories/prisma-users-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuth() {
  const repo = new PrismaUserRepository();
  const cas = new AuthenticateUseCase(repo);

  return cas;
}
