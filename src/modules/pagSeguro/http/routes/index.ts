import { envRoutes } from '@/env';
import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { installments } from '../controller/installments';
import { listORder } from '../controller/list-order';

export async function pagseguroRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);
  app.get(envRoutes.PAGSEGURO_INSTALLMENTS, installments);
  app.get('/find-order/:order_id', listORder);
}
