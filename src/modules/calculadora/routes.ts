import { Auth } from '@/shared/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { Controller } from './controller';

const controler = new Controller()

export async function routesCalculadora(app: FastifyInstance) {
  app.addHook('onRequest', Auth)

  app.get('/calculadora/byUserId', controler.byUserId);
  app.get('/calculadora', controler.getAll);

  app.post('/calculadora/register', controler.register);
}