import { FastifyReply, FastifyRequest } from 'fastify';

import * as schema from './schema';
import { PaymentService } from './service';

const service = new PaymentService();

export class Controller {
  async card(req: FastifyRequest, res: FastifyReply) {
    const userId = req.user.sub;
    const scheme = schema.schemaCard.parse({
      ...(req.body as unknown as any),
      userId,
    });

    const execute = await service.card(scheme);

    return res.status(201).send(execute);
  }
}
