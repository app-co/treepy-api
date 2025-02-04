import { envRoutes } from '@/env';
import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { ListChargesByUserId } from '../controllers/list-charges-by-user';
import { payBoleto } from '../controllers/pay-boleto';
import { payCard } from '../controllers/pay-card';
import { payPix } from '../controllers/pay-pix';

export async function chargesRoutes(app: FastifyInstance) {
  app.post(envRoutes.PAY_CARD, { onRequest: [verifyJwt] }, payCard);
  app.post(envRoutes.PAY_PIX, { onRequest: [verifyJwt] }, payPix);
  app.post(envRoutes.PAY_BOLE, { onRequest: [verifyJwt] }, payBoleto);
  app.get(
    envRoutes.LIST_ORDER_BY_USER,
    { onRequest: [verifyJwt] },
    ListChargesByUserId,
  );
}
