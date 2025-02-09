import { FastifyReply, FastifyRequest } from 'fastify';
import { ServicePayment } from './service';

const make = new ServicePayment()

export class Controller {
  async register(req: FastifyRequest, res: FastifyReply) {
    const schema = req.body
    const rs = await make.registerWebhook();

    return res.status(201).send(rs);
  }



}