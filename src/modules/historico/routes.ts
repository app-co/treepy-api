import { Auth } from '@/shared/middlewares/verify-jwt';
import { FastifyInstance } from 'fastify';
import { Controller } from './controller';

const controler = new Controller()

export async function routesHistorico(app: FastifyInstance) {
    app.addHook('onRequest', Auth)

    app.post('/historico/register', controler.register);
    app.get('/historico-user', controler.getByUser);
}