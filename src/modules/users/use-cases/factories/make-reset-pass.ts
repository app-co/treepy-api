import { PrismaUserRepository } from '../../repositories/prisma-users-repository';
import UserTokenRepository from '../../repositories/UserTokenRepositorie';
import { ResePassService } from '../resetPassService';

export function makeResePass() {
  const repouser = new PrismaUserRepository();
  const repoToken = new UserTokenRepository();

  const make = new ResePassService(repouser, repoToken);

  return make;
}
