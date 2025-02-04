import { FastifyInstance } from 'fastify';
import {Controller} from './controller'

const controler = new Controller()

export async function RoutesClient(app: FastifyInstance) {
app.post('/historico/register', controler.register);
}