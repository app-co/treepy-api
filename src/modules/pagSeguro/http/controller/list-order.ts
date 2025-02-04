import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makePagSeguro } from '../../use-cases/factories';

export async function listORder(req: FastifyRequest, res: FastifyReply) {
  const registerScheme = z.object({
    order_id: z.string(),
  });

  const { order_id } = registerScheme.parse(req.params);

  try {
    const make = makePagSeguro();

    const rs = await make.order(order_id);
    return res.status(201).send(rs);
  } catch (err) {
    return res.status(409).send({ error: err });
  }
}
