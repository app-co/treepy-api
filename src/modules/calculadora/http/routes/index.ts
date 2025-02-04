import { envRoutes } from '@/env';
import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { listByUser } from '../controller/list-by-user';
import { registerCalculadora, updateCalculadora } from '../controller/register';

export async function calculadoraRoutes(app: FastifyInstance) {
  app.post(envRoutes.CALCULADORA_CREATE, registerCalculadora);
  app.get(envRoutes.CALCULADORA_LIST_BY_USER, listByUser);
  app.put('/calculadora-update', { onRequest: [verifyJwt] }, updateCalculadora);
}
