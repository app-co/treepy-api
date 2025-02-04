import { verifyJwt } from '@/shared/http/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';

import { WebhookController } from '../controller/webhook-controller';

const controller = new WebhookController();

export async function hookRoutes(app: FastifyInstance) {
  app.post('/web-hook', controller.createWebHook);
  app.get('/web-hook', controller.listMany);
}
