import { envRoutes } from '@/env';
import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { authenticate } from './controllers/athenticate';
import { checkUser } from './controllers/check-user';
import { listAllUserController } from './controllers/list-all-controller';
import { listById } from './controllers/list-by-id';
import { refe } from './controllers/refe';
import { refreshToken } from './controllers/refles-token';
import { register } from './controllers/register';
import { relatorioControlerAdm } from './controllers/relatorio-controller';
import { resetPass } from './controllers/reset-pass';
import { resumoController } from './controllers/resumo-controller';
import { sendForgotPass } from './controllers/send-forgot-mail';
import { sendMailContact } from './controllers/send-mail-contact';
import { sendMailOrder } from './controllers/send-mail-order';
import { UpdatEnd, UpdateUser } from './controllers/update-user';

export async function userRoutes(app: FastifyInstance) {
  app.post(envRoutes.USER_SESSION, authenticate);
  app.post(envRoutes.USER_CREATE, register);

  app.patch(envRoutes.USER_REFRESH, refreshToken);

  app.put(envRoutes.USER_UPDATE, { onRequest: [verifyJwt] }, UpdateUser);
  app.put('/user/update-end', { onRequest: [verifyJwt] }, UpdatEnd);

  app.put(envRoutes.USER_RESET_PASS, resetPass);
  app.get(envRoutes.USER_CHECK, checkUser);

  app.post(envRoutes.SEND_FORGOT_MAIL, sendForgotPass);
  app.post(envRoutes.SEND_MAIL_CONTACT, sendMailContact);
  app.post(envRoutes.SEND_MAIL_ORDER, sendMailOrder);

  app.get('/me', { onRequest: [verifyJwt] }, listById);
  app.get(envRoutes.USER_RESUMO, { onRequest: [verifyJwt] }, resumoController);
  app.get(envRoutes.USER_LIST_ALL, listAllUserController);

  app.get(
    envRoutes.ADM_RELATORIO,
    { onRequest: [verifyJwt] },
    relatorioControlerAdm,
  );

  app.get('/refe', refe)
}
