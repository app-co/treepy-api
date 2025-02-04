import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { Controller } from './controller';

const control = new Controller();
export async function paymentRoutes(app: FastifyInstance) {
  app.post('/payments/card', { onRequest: verifyJwt }, control.card);
}
