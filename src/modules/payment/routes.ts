import { FastifyInstance } from 'fastify';
import { Controller } from './controller';

const controler = new Controller()

export async function routesPayment(app: FastifyInstance) {
  app.get('/payment/register', controler.register);
}