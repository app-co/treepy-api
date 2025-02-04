import SESMailProvider from '@/shared/providers/emails/providers/implementations/SESMailProvider';
import HandleBars from '@/shared/providers/emails/templates/implementations/HandleBaars';

import { PrismaUserRepository } from '../../repositories/prisma-users-repository';
import UserTokenRepository from '../../repositories/UserTokenRepositorie';
import { SendContactService } from '../sendContact.Service';
import { SendForgotPasswordEmailService } from '../SendForgotPasswordEmailService';
import { SendOrdemCompraService } from '../sendOrdemCompra.Service';

export function MakeSendMail() {
  const repo = new HandleBars();
  const forgot = new SESMailProvider(repo);

  const repouser = new PrismaUserRepository();

  const repoUserToken = new UserTokenRepository();

  const sendForgotPass = new SendForgotPasswordEmailService(
    repouser,
    forgot,
    repoUserToken,
  );
  const sendContacMail = new SendContactService(forgot);
  const sendOrderMail = new SendOrdemCompraService(forgot);

  return { sendContacMail, sendForgotPass, sendOrderMail };
}
