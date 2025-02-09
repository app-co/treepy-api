import { Auth } from '@/shared/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { Controller } from './controller';

const controler = new Controller()

export async function routesMetrica(app: FastifyInstance) {
  app.addHook('onRequest', Auth)

  app.get('/metricas/user', controler.register);
}