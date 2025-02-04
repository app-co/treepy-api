import { IMailProvider } from '@/shared/providers/emails/providers/models/IMailProvider';
import path from 'path';

interface IRequest {
  message: string;
  email: string;
  nome: string;
  assunto: string;
}

export class SendContactService {
  constructor(private mailProvider: IMailProvider) {}

  public async execute({
    message,
    email,
    nome,
    assunto,
  }: IRequest): Promise<void> {
    const forgotPassword = path.resolve(
      __dirname,
      '..',
      'view',
      'sendContact.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: '[Equipe Treepy]',
        email: 'contato@treepy.com.br',
      },
      cc: [email],
      subject: assunto,
      templateData: {
        file: forgotPassword,
        variables: {
          message,
          nome,
        },
      },
    });
  }
}
