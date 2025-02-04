import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { Controller } from './controller';

const control = new Controller();

export async function paymentAsaasRoute(app: FastifyInstance) {
  app.post('/payment/card', { onRequest: verifyJwt }, control.payCard);
  app.post('/payment/card-token', { onRequest: verifyJwt }, control.cardToken);
  app.post('/payment/pix', { onRequest: verifyJwt }, control.payPix);
  app.post('/payment/boleto', { onRequest: verifyJwt }, control.boleto);
  app.post('/asaas/webhook', control.responsePix);
  app.post('/payment/register-webhook', control.registerWebHook);
  app.post('/key-pix', control.keypix);
  app.post('/transers', control.transferTreepycaches);
}
