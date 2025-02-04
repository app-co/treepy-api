import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { Controller } from './controller';

const control = new Controller();

export async function metricaRoute(app: FastifyInstance) {
  app.get('/metrica-user', { onRequest: verifyJwt }, control.user);
}
