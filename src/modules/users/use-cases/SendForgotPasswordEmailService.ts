/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from '@/env';
import { IMailProvider } from '@/shared/providers/emails/providers/models/IMailProvider';
import path from 'path';

import { IUsersRepository } from '../repositories/IUser-repository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import { UserNotFound } from './errors/user-not-found';

interface IRequest {
  email: string;
}

export class SendForgotPasswordEmailService {
  constructor(
    private userRepository: IUsersRepository,

    private mailProvider: IMailProvider,

    private userTokenRepository: IUserTokenRepository,
  ) { }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFound();
    }
    const { token } = await this.userTokenRepository.generate(user.id);

    const mailUrl =
      env.NODE_ENV === 'dev'
        ? `http://localhost:5173/resetpass/${token}/reset`
        : `https://www.treepy.com.br/resetpass/${token}/reset`;

    const forgotPassword = path.resolve(
      __dirname,
      '..',
      'view',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.full_name,
        email: user.email,
      },
      subject: '[Treepy] Recuperação de senha',
      templateData: {
        file: forgotPassword,
        variables: {
          name: user.full_name,
          token,
          link: mailUrl,
        },
      },
    });
  }
}
