import { FastifyReply, FastifyRequest } from 'fastify';

import { Metricass } from './service';

const service = new Metricass();

export class Controller {
  async user(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.sub;
    const exec = await service.user(userId);

    return res.status(201).send(exec);
  }
}
