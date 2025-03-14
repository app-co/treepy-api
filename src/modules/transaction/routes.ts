import { Auth } from '@/shared/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { ControlerTransactions } from './controler';

const controler = new ControlerTransactions()

export async function routeTransaction(app: FastifyInstance) {
  app.addHook('onRequest', Auth)

  app.post('/transaction-card', controler.card)
  app.post('/transaction-pix', controler.pix)
}