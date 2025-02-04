/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcryptjs';

import { IUsersRepository } from '../repositories/IUser-repository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import { TokenInválido } from './errors/token-invalido';
import { UserNotFound } from './errors/user-not-found';

interface Props {
  password: string;
  token: string;
}

export class ResePassService {
  constructor(
    private userRepository: IUsersRepository,

    private userToken: IUserTokenRepository,
  ) {}

  async execute({ password, token }: Props): Promise<any> {
    const userToken = await this.userToken.findByToken(token);

    if (!userToken) {
      throw new TokenInválido();
    }
    const user = await this.userRepository.findById(userToken.user_id!);

    if (!user) {
      throw new UserNotFound();
    }

    const pass = await hash(password, 8);

    await this.userRepository.resetPassWord(pass, user.id);

    return user;
  }
}
